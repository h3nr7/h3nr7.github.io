import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react"
import { 
  MeshStandardMaterial, DataTexture, BufferGeometry,
  Shader, Mesh,
  RGBAFormat, FloatType, BufferAttribute
} from 'three'
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { glsl } from "typed-glsl"
import { BoidsMeshProps } from "./BoidsBird.interface";

const WIDTH = 64;
const BIRDS = WIDTH * WIDTH;

interface BoidsBirdGeometryProps extends BoidsMeshProps {
  size: number
}

export function BoidsBirdGeometry({
  size,
  computationRenderer,
  velocityVariable,
  positionVariable,
}: PropsWithChildren<BoidsBirdGeometryProps>) {
  
  const geometry = new BufferGeometry()
  const material = new MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 1,
    metalness: 0
  })
  const [materialShader, setMaterialShader] = useState<Shader>()
  const gltf = useGLTF('/Parrot.glb')


  /**
   * prepare gltf assets when loaded
   */
  const { 
    durationAnimation, 
    indicesPerBird, 
    textureAnimation, 
    birdGeo,
    tWidth, tHeight 
  } = useMemo(() => {
    if(!gltf) return {}

    const animations = gltf.animations
    const durationAnimation = Math.round( animations[ 0 ].duration * 60 )
    const birdGeo = (gltf.scene.children[ 0 ] as Mesh).geometry;
    const morphAttributes = birdGeo.morphAttributes.position;
    const tHeight = nextPowerOf2( durationAnimation );
    const tWidth = nextPowerOf2( birdGeo.getAttribute( 'position' ).count );
    const indicesPerBird = birdGeo.index?.count;
    const tData = new Float32Array( 4 * tWidth * tHeight );

    // assign animation data...
    for ( let i = 0; i < tWidth; i ++ ) {
      for ( let j = 0; j < tHeight; j ++ ) {
        const offset = j * tWidth * 4;

        const curMorph = Math.floor( j / durationAnimation * morphAttributes.length );
        const nextMorph = ( Math.floor( j / durationAnimation * morphAttributes.length ) + 1 ) % morphAttributes.length;
        const lerpAmount = j / durationAnimation * morphAttributes.length % 1;

        if ( j < durationAnimation ) {

          let d0, d1;

          d0 = morphAttributes[ curMorph ].array[ i * 3 ];
          d1 = morphAttributes[ nextMorph ].array[ i * 3 ];

          if ( d0 !== undefined && d1 !== undefined ) tData[ offset + i * 4 ] = lerp( d0, d1, lerpAmount );

          d0 = morphAttributes[ curMorph ].array[ i * 3 + 1 ];
          d1 = morphAttributes[ nextMorph ].array[ i * 3 + 1 ];

          if ( d0 !== undefined && d1 !== undefined ) tData[ offset + i * 4 + 1 ] = lerp( d0, d1, lerpAmount );

          d0 = morphAttributes[ curMorph ].array[ i * 3 + 2 ];
          d1 = morphAttributes[ nextMorph ].array[ i * 3 + 2 ];

          if ( d0 !== undefined && d1 !== undefined ) tData[ offset + i * 4 + 2 ] = lerp( d0, d1, lerpAmount );

          tData[ offset + i * 4 + 3 ] = 1;
        }
      }
    }

    const textureAnimation = new DataTexture( tData, tWidth, tHeight, RGBAFormat, FloatType );
    textureAnimation.needsUpdate = true;

    console.log(durationAnimation, indicesPerBird, textureAnimation, birdGeo, tWidth, tHeight)

    return { durationAnimation, indicesPerBird, textureAnimation, birdGeo, tWidth, tHeight }
  }, [gltf])


  /**
   * setup and modify shader
   */
  useEffect(() => {
    if(textureAnimation) {
      material.onBeforeCompile = shader => {
        shader.uniforms = {
          ...shader.uniforms,
          texturePosition:{ value: null },
          textureVelocity: { value: null },
          textureAnimation: { value: textureAnimation },
          time: { value: 1.0 },
          size: { value: size },
          delta: { value: 0.0 }
        }

        // inject variable declaration into vertex shader
        let token = '#define STANDARD'
        let insert = glsl`
          attribute vec4 reference;
          attribute vec4 seeds;
          attribute vec3 birdColor;
          uniform sampler2D texturePosition;
          uniform sampler2D textureVelocity;
          uniform sampler2D textureAnimation;
          uniform float size;
          uniform float time;
        `

        shader.vertexShader = shader.vertexShader.replace(token, token + insert)

        // inject code to main
        token = '#include <begin_vertex>'
        insert = glsl`
          vec4 tmpPos = texture2D( texturePosition, reference.xy );

          vec3 pos = tmpPos.xyz;
          vec3 velocity = normalize(texture2D( textureVelocity, reference.xy ).xyz);
          vec3 aniPos = texture2D( textureAnimation, vec2( reference.z, mod( time + ( seeds.x ) * ( ( 0.0004 + seeds.y / 10000.0) + normalize( velocity ) / 20000.0 ), reference.w ) ) ).xyz;
          vec3 newPosition = position;

          newPosition = mat3( modelMatrix ) * ( newPosition + aniPos );
          newPosition *= size + seeds.y * size * 0.2;

          velocity.z *= -1.;
          float xz = length( velocity.xz );
          float xyz = 1.;
          float x = sqrt( 1. - velocity.y * velocity.y );

          float cosry = velocity.x / xz;
          float sinry = velocity.z / xz;

          float cosrz = x / xyz;
          float sinrz = velocity.y / xyz;

          mat3 maty =  mat3( 
            cosry, 0, -sinry, 
            0    , 1, 0     , 
            sinry, 0, cosry );
          mat3 matz =  mat3( 
            cosrz , sinrz, 0, 
            -sinrz, cosrz, 0, 
            0     , 0    , 1 );

          newPosition =  maty * matz * newPosition;
          newPosition += pos;

          // vec3 transformed = vec3( newPosition );
          vec3 transformed = vec3( position );
        `
        shader.vertexShader = shader.vertexShader.replace(token, insert)

        setMaterialShader(shader)
      }
    }
  }, [textureAnimation])



  /**
   * setup and modify geometry
   */
  useEffect(() => {
    if(!birdGeo) return
    const vertices = [], color = [], reference = [], seeds = [], indices = [];
    const totalVertices = birdGeo.getAttribute( 'position' ).count * 3 * BIRDS;
    for ( let i = 0; i < totalVertices; i ++ ) {

      const bIndex = i % ( birdGeo.getAttribute( 'position' ).count * 3 );
      vertices.push( birdGeo.getAttribute( 'position' ).array[ bIndex ] );
      color.push( birdGeo.getAttribute( 'color' ).array[ bIndex ] );

    }

    let r = Math.random();
    for ( let i = 0; i < birdGeo.getAttribute( 'position' ).count * BIRDS; i ++ ) {

      const bIndex = i % ( birdGeo.getAttribute( 'position' ).count );
      const bird = Math.floor( i / birdGeo.getAttribute( 'position' ).count );
      if ( bIndex == 0 ) r = Math.random();
      const j = ~ ~ bird;
      const x = ( j % WIDTH ) / WIDTH;
      const y = ~ ~ ( j / WIDTH ) / WIDTH;
      reference.push( x, y, bIndex / tWidth, durationAnimation / tHeight );
      seeds.push( bird, r, Math.random(), Math.random() );

    }


    const len = birdGeo.index?.array.length || 0
    const indexArr = birdGeo.index?.array || []
    for ( let i = 0; i < len * BIRDS; i ++ ) {

      const offset = Math.floor( i / indexArr.length ) * ( birdGeo.getAttribute( 'position' ).count );
      indices.push( indexArr[ i % indexArr.length ] + offset );

    }

    geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
    geometry.setAttribute( 'birdColor', new BufferAttribute( new Float32Array( color ), 3 ) );
    geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( color ), 3 ) );
    geometry.setAttribute( 'reference', new BufferAttribute( new Float32Array( reference ), 4 ) );
    geometry.setAttribute( 'seeds', new BufferAttribute( new Float32Array( seeds ), 4 ) );

    geometry.setIndex( indices );
    geometry.setDrawRange(0, (indicesPerBird || 0) * BIRDS * 4)

  }, [birdGeo])


  let last = performance.now()

  useFrame(f => {
    if(!computationRenderer || !positionVariable || !velocityVariable) return
    let now = f.clock.oldTime
    let delta = ( now - last ) / 1000;

    if ( materialShader ) materialShader.uniforms[ 'time' ].value = now / 1000;
    if ( materialShader ) materialShader.uniforms[ 'delta' ].value = delta;


    if ( materialShader ) materialShader.uniforms[ 'texturePosition' ].value = computationRenderer.getCurrentRenderTarget( positionVariable ).texture;
    if ( materialShader ) materialShader.uniforms[ 'textureVelocity' ].value = computationRenderer.getCurrentRenderTarget( velocityVariable ).texture;
    
  })


  return (
    <mesh 
      castShadow
      receiveShadow
      rotation={[0, Math.PI/2, 0]}
      geometry={geometry} 
      material={material} />
  )

}

/**
 * math function to calculate next power of 2
 * @param n 
 * @returns 
 */
function nextPowerOf2( n:number ) {

  return Math.pow( 2, Math.ceil( Math.log( n ) / Math.log( 2 ) ) );

}

/**
 * 
 */
function lerp( value1: number, value2: number, amount: number ) {

  amount = Math.max( Math.min( amount, 1 ), 0 );
  return value1 + ( value2 - value1 ) * amount;

}