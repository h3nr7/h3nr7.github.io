import { BufferAttribute, BufferGeometry, DataTexture, FloatType, Shader, Mesh, MeshStandardMaterial, RGBAFormat } from "three";
import { useBoids } from "./Boids";
import { useGLTF } from "@react-three/drei";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { BIRDS, WIDTH } from ".";
import { glsl } from "typed-glsl";
import { useFrame } from "@react-three/fiber";

interface BoidsGltfProps {
  size?: number
}

export function BoidsGltf({
  size = 0.2
}: PropsWithChildren<BoidsGltfProps>) {

  let materialShader:Shader
  const { computationRenderer, positionVariable, velocityVariable } = useBoids()
  const geometry = new BufferGeometry()
  
  // const gltf = useGLTF('/Parrot.glb')
  const gltf = useGLTF('/Flamingo.glb')
  // const gltf = useGLTF('/bird.glb')
  // const gltf = useGLTF('/toucan_bird.glb')


  const {
    textureAnimation
  } = useMemo(() => {
    if(!gltf) return {}

    // initialise
    const animations = gltf.animations
    const durationAnimation = Math.round( animations[ 0 ].duration * 60 )
    const birdGeo = (gltf.scene.children[ 0 ] as Mesh).geometry
    const morphAttributes = birdGeo.morphAttributes.position
    const tWidth = nextPowerOf2( birdGeo.getAttribute( 'position' ).count )
    const tHeight = nextPowerOf2( durationAnimation )
    const indicesPerBird = birdGeo.index?.count || 0
    const tData = new Float32Array( 4 * tWidth * tHeight );

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

    const birdGeoArr = birdGeo.index?.array || []
    for ( let i = 0; i <birdGeoArr.length * BIRDS; i ++ ) {

      const offset = Math.floor( i / birdGeoArr.length ) * ( birdGeo.getAttribute( 'position' ).count );
      indices.push( birdGeoArr[ i % birdGeoArr.length ] + offset );

    }

    geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
    geometry.setAttribute( 'birdColor', new BufferAttribute( new Float32Array( color ), 3 ) );
    geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( color ), 3 ) );
    geometry.setAttribute( 'reference', new BufferAttribute( new Float32Array( reference ), 4 ) );
    geometry.setAttribute( 'seeds', new BufferAttribute( new Float32Array( seeds ), 4 ) );

    geometry.setIndex( indices );
    geometry.setDrawRange(0, indicesPerBird * BIRDS)

    console.log('ta: ', textureAnimation)
    return { textureAnimation }

  }, [gltf])

  const material = useMemo(() => {

    const m = new MeshStandardMaterial( {
      vertexColors: true,
      flatShading: true,
      roughness: 1,
      metalness: 0
    })

    m.onBeforeCompile = shader => {

      shader.uniforms.texturePosition = { value: null };
      shader.uniforms.textureVelocity = { value: null };
      shader.uniforms.textureAnimation = { value: textureAnimation };
      shader.uniforms.time = { value: 1.0 };
      shader.uniforms.size = { value: size };
      shader.uniforms.delta = { value: 0.0 };

      let token = '#define STANDARD';
      let insert = glsl`
        attribute vec4 reference;
        attribute vec4 seeds;
        attribute vec3 birdColor;
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        uniform sampler2D textureAnimation;
        uniform float size;
        uniform float time;
      `;
      shader.vertexShader = shader.vertexShader.replace( token, token + insert );

      token = '#include <begin_vertex>';

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

        mat3 maty =  mat3( cosry, 0, -sinry, 0    , 1, 0     , sinry, 0, cosry );
        mat3 matz =  mat3( cosrz , sinrz, 0, -sinrz, cosrz, 0, 0     , 0    , 1 );

        newPosition =  maty * matz * newPosition;
        newPosition += pos;

        vec3 transformed = vec3( newPosition );
      `;

      shader.vertexShader = shader.vertexShader.replace( token, insert );
      // set material shader
      materialShader = shader
      
    }

    return m

  }, [textureAnimation])

  let last = performance.now()
  useFrame(f => {
    if(!computationRenderer || !positionVariable || !velocityVariable || !materialShader) return
    let now = f.clock.oldTime
    let delta = ( now - last ) / 1000;

    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    last = now;

    // console.log('render')

    materialShader.uniforms[ 'time' ].value = now / 1000;
    materialShader.uniforms[ 'delta' ].value = delta;

    materialShader.uniforms[ 'texturePosition' ].value = computationRenderer.getCurrentRenderTarget( positionVariable ).texture;
    materialShader.uniforms[ 'textureVelocity' ].value = computationRenderer.getCurrentRenderTarget( velocityVariable ).texture;
  })

  return (
    <mesh 
      rotation={[0, Math.PI/2, 0]}
      material={material} 
      geometry={geometry} />
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