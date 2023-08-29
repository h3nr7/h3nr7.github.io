import { 
  BufferAttribute, BufferGeometry, DataTexture, 
  FloatType, Shader, Mesh, 
  MeshStandardMaterial, RGBAFormat, Texture,
  ShaderLib, 
  UVMapping
} from "three";
import { useBoids } from "./Boids";
import { useGLTF } from "@react-three/drei";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { BIRDS, WIDTH } from ".";
import { glsl } from "typed-glsl";
import { vec3 } from 'gl-matrix'
import { useFrame } from "@react-three/fiber";

interface BoidsGltfProps {
  size?: number
  pause?:boolean
  rotation?: [number, number, number]
}

export function BoidsGltf({
  size = 0.2,
  pause = false,
  rotation = [0, Math.PI/2, 0]
}: PropsWithChildren<BoidsGltfProps>) {

  const [pauseAnim, setPauseAnim] = useState(pause)
  useEffect(() => setPauseAnim(pause), [pause])

  let materialShader:Shader
  const { computationRenderer, positionVariable, velocityVariable } = useBoids()
  const geometry = new BufferGeometry()
  
  // const gltf = useGLTF('/Parrot.glb')
  const gltf = useGLTF('/Flamingo.glb')
  // const gltf = useGLTF('/bird_skin.glb')
  // const gltf = useGLTF('/bird-new.glb')
  // const gltf = useGLTF('/bird.glb')
  // const gltf = useGLTF('/toucan_bird.glb')


  // intialised data when gltf is ready
  const {
    textureAnimation,
    birdMaterialMap
  } = useMemo(() => {

    if(!gltf) return {}

    // initialise
    const animations = gltf.animations
    const durationAnimation = Math.round( animations[ 0 ].duration * 60 )
    const birdGeo = (gltf.scene.children[ 0 ] as Mesh).geometry
    const birdMaterialMap = ((gltf.scene.children[ 0 ] as Mesh).material as MeshStandardMaterial).map
    const morphAttributes = birdGeo.morphAttributes.position
    const tWidth = nextPowerOf2( birdGeo.getAttribute( 'position' ).count )
    const tHeight = nextPowerOf2( durationAnimation )
    const indicesPerBird = birdGeo.index?.count || 0
    const tData = new Float32Array( 4 * tWidth * tHeight );

    // create cur and next animation morph in a Data Texture
    for ( let i = 0; i < tWidth; i ++ ) {
      for ( let j = 0; j < tHeight; j ++ ) {

        const offset = j * tWidth * 4;
        const curMorph = Math.floor( j / durationAnimation * morphAttributes.length );
        const nextMorph = ( Math.floor( j / durationAnimation * morphAttributes.length ) + 1 ) % morphAttributes.length;
        const lerpAmount = j / durationAnimation * morphAttributes.length % 1;

        if ( j < durationAnimation ) {

          const cur = vec3.create()
          cur[0] = morphAttributes[ curMorph ].array[i * 3]
          cur[1] = morphAttributes[ curMorph ].array[i * 3 + 1]
          cur[2] = morphAttributes[ curMorph ].array[i * 3 + 2]

          const next = vec3.create()
          next[0] = morphAttributes[ nextMorph ].array[i * 3]
          next[1] = morphAttributes[ nextMorph ].array[i * 3 + 1]
          next[2] = morphAttributes[ nextMorph ].array[i * 3 + 2]

          const out = vec3.create()
          vec3.lerp(out, cur, next, lerpAmount)

          tData[offset + i * 4] = out[0]
          tData[offset + i * 4 + 1] = out[1]
          tData[offset + i * 4 + 2] = out[2]
          tData[offset + i * 4 + 3] = 1

        }
      }
    }

    // Data texture for shaders
    const textureAnimation = new DataTexture( tData, tWidth, tHeight, RGBAFormat, FloatType );
    textureAnimation.needsUpdate = true;

    const vertices = [], uv = [], reference = [], seeds = [], indices = [];

    // generate all the vertices for all the birds
    const totalVertices = birdGeo.getAttribute( 'position' ).count * 3 * BIRDS;
    for ( let i = 0; i < totalVertices; i ++ ) {

      const bIndex = i % ( birdGeo.getAttribute( 'position' ).count * 3 );
      vertices.push( birdGeo.getAttribute( 'position' ).array[ bIndex ] );

    }

    // generate all the UV mapping data for all the birds
    const totalUv = birdGeo.getAttribute( 'uv' ).count * 2 * BIRDS;
    for ( let i = 0; i < totalUv; i ++ ) {

      const bIndex = i % ( birdGeo.getAttribute( 'uv' ).count * 2 );
      uv.push( birdGeo.getAttribute( 'uv' ).array[ bIndex ])

    }

    // randomly placed the birds and its references
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

    // indices for allt each bird and its vertices
    const birdGeoArr = birdGeo.index?.array || []
    for ( let i = 0; i <birdGeoArr.length * BIRDS; i ++ ) {

      const offset = Math.floor( i / birdGeoArr.length ) * ( birdGeo.getAttribute( 'position' ).count );
      indices.push( birdGeoArr[ i % birdGeoArr.length ] + offset );

    }

    // set attributes to buffer
    geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
    geometry.setAttribute( 'uv', new BufferAttribute( new Float32Array( uv ), 2 ) );
    geometry.setAttribute( 'reference', new BufferAttribute( new Float32Array( reference ), 4 ) );
    geometry.setAttribute( 'seeds', new BufferAttribute( new Float32Array( seeds ), 4 ) );
    // set index and drawing range
    geometry.setIndex( indices );
    geometry.setDrawRange(0, indicesPerBird * BIRDS)

    // return created variables
    return { textureAnimation, birdMaterialMap }

  }, [gltf])

  // generate the material
  const material = useMemo(() => {

    // generate mesh standard material
    const m = new MeshStandardMaterial( {
      vertexColors: false,
      flatShading: true,
      roughness: 1,
      metalness: 0,
      map: birdMaterialMap,
    })

    // modify shanders on before compile
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
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        uniform sampler2D textureAnimation;
        uniform float size;
        uniform float time;
      `;
      shader.vertexShader = shader.vertexShader.replace( token, token + insert );

      token = '#include <begin_vertex>';
      insert = glsl`
        // get position from boid position texture
        vec4 tmpPos = texture2D( texturePosition, reference.xy );
        vec3 pos = tmpPos.xyz;
        // get velocity from boid velocity texture and normalise
        vec3 velocity = normalize(texture2D( textureVelocity, reference.xy ).xyz);
        // get animation from data texture generated above in time.
        vec3 aniPos = texture2D( textureAnimation, vec2( reference.z, mod( time + ( seeds.x ) * ( ( 0.0004 + seeds.y / 10000.0) + velocity / 20000.0 ), reference.w ) ) ).xyz;
        
        // adding all the positions together and multiply by the model matrix
        vec3 newPosition = position;
        newPosition = mat3( modelMatrix ) * ( newPosition + aniPos );
        // applying the size and initial random position
        newPosition *= size + seeds.y * size * 0.2;

        // applying the rotations through quanternion 
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


      // set material shader, accessibly by the animation useFrame 
      // (cannot use react useState as it would break!)
      materialShader = shader
      
      // initial position and velocity applied before useFrame 
      // Not really required however good for debuggin when we stop the animation
      if(!computationRenderer || !positionVariable || !velocityVariable) return
      materialShader.uniforms[ 'texturePosition' ].value = computationRenderer.getCurrentRenderTarget( positionVariable ).texture;
      materialShader.uniforms[ 'textureVelocity' ].value = computationRenderer.getCurrentRenderTarget( velocityVariable ).texture;

    }

    return m

  }, [textureAnimation, birdMaterialMap])

  let last = performance.now()
  useFrame(f => {
    if(!computationRenderer || !positionVariable || !velocityVariable || !materialShader || pauseAnim) return
    let now = f.clock.oldTime
    let delta = ( now - last ) / 1000;

    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    last = now;

    materialShader.uniforms[ 'time' ].value = now / 1000;
    materialShader.uniforms[ 'delta' ].value = delta;

    materialShader.uniforms[ 'texturePosition' ].value = computationRenderer.getCurrentRenderTarget( positionVariable ).texture;
    materialShader.uniforms[ 'textureVelocity' ].value = computationRenderer.getCurrentRenderTarget( velocityVariable ).texture;
  })

  return (
    <mesh 
      rotation={rotation}
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