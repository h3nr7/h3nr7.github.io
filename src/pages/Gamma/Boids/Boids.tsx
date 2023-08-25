import { PropsWithChildren, useRef, useMemo } from "react";
import { BoidProps, BoidsProps } from "./Boids.interface";
import { Instance, Instances } from "@react-three/drei";
import { ThreeEvent, useThree, useFrame, extend, Object3DNode } from "@react-three/fiber";
import { 
  ConeGeometry, 
  ShaderMaterial, Color, Vector3, DoubleSide,
  MeshLambertMaterial, Texture, RepeatWrapping } from 'three'
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";

import { velocityFrag } from "./shaders/velocityFrag";
import { positionFrag } from "./shaders/positionFrag";
import { vert } from "./shaders/vert";
import { frag } from "./shaders/frag";
import { Boid } from "./Boid";
import { now } from "three/examples/jsm/libs/tween.module.js";
import BirdGeometry from "./geometry/BirdGeometry";


const SIZE_LIMIT = 5
const BOUNDS = 100, BOUNDS_HALF = BOUNDS / 2

export function Boids({ 
  devMode, 
  hasPhysics, 
  total=100 
}:PropsWithChildren<BoidsProps>) {

  const { gl } = useThree()


  const { 
    gpuCompute, 
    velocityVariable,
    positionVariable,
    velocityUniform, 
    positionUniform 
  } = useMemo(() => {
    const gpu = new GPUComputationRenderer(50, 50, gl)

    const dtVelocity = gpu.createTexture()
    const dtPosition = gpu.createTexture()
    fillVelocityTexture(dtVelocity)
    fillPositionTexture(dtPosition)
  
    const velocityVariable = gpu.addVariable('textureVelocity', velocityFrag, dtVelocity)
    const positionVariable = gpu.addVariable('texturePosition', positionFrag, dtPosition)
  
    gpu.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
    gpu.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );


    const { uniforms: velocityUniform, defines: velocityDefines } = velocityVariable.material
    const { uniforms: positionUniform } = positionVariable.material
  
    velocityUniform['time'] = { value: 1.0 }
    velocityUniform['delta'] = { value: 0.0 }
    velocityUniform['testing'] = { value: 1.0 }
    velocityUniform['separationDistance'] = { value: 10.0 }
    velocityUniform['alignmentDistance'] = { value: 10.0 }
    velocityUniform['cohesionDistance'] = { value: 10.0 }
    velocityUniform['freedomFactor'] = { value: 0.50 }
    velocityUniform['predator'] = { value: new Vector3() }
  
    positionUniform['time'] = { value: 0.0 }
    positionUniform['delta'] = { value: 0.0 }
  
  
    velocityVariable.wrapS = RepeatWrapping
    velocityVariable.wrapT = RepeatWrapping
    velocityDefines.BOUNDS = BOUNDS.toFixed( 2 );
  
    positionVariable.wrapS = RepeatWrapping
    positionVariable.wrapT = RepeatWrapping

    try {
      gpu.init()
    } catch(e) {
      console.error('BoidComputation Error:' + (e as Error)?.message)
    }
  
    return { gpuCompute: gpu, velocityVariable, positionVariable, velocityUniform, positionUniform }
  }, [])

  const birdUniforms = useMemo(() => {

    return  {
      color: { value: new Color( 0xff2200 ) },
      texturePosition: { value: new Texture() },
      textureVelocity: { value: new Texture() },
      time: { value: 1.0 },
      delta: { value: 0.0 }
    }
  }, [])

  let last = performance.now()

  useFrame(f => {

    if(!gpuCompute || !velocityUniform || !positionUniform) return
    let now = f.clock.oldTime
    let delta = ( now - last ) / 1000;

    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    last = now;

    velocityUniform['time'].value = now
    velocityUniform['delta'].value = delta

    positionUniform['time'].value = now
    positionUniform['delta'].value = delta


    gpuCompute.compute()

    birdUniforms[ 'texturePosition' ].value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    birdUniforms[ 'textureVelocity' ].value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

  })

  const material = new ShaderMaterial({
    uniforms: birdUniforms,
    vertexShader: vert,
    fragmentShader: frag,
    side: DoubleSide

  })

  const geometry = new BirdGeometry()

  return (
    // <Instances 
    //   material={material} 
    //   geometry={geometry} 
    //   scale={0.2} 
    //   castShadow>
    //   { generateBoids(total) }
    // </Instances>
    <mesh 
      matrixAutoUpdate={false}
      geometry={geometry} 
      material={material} 
      rotation={[0, Math.PI / 2, 0]} />
  )
}

/**
 * generate boids
 * @param tot 
 * @returns 
 */
function generateBoids(tot: number) {

  const dat = useMemo(() => {
    const bArray:Array<[number, number, number]> = [];
    for (let i=0; i<tot; i++) {
      bArray.push([(2*Math.random() - 1) * SIZE_LIMIT/2, Math.random() * SIZE_LIMIT, (2*Math.random() - 1) * SIZE_LIMIT/2])
    }

    return bArray;
  }, [])

  return dat.map((props, i) => <Boid key={i} position={props}/>)
}


/**
 * fill position texture
 * @param texture 
 */
function fillPositionTexture(texture:Texture) {
  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    const x = Math.random() * BOUNDS - BOUNDS_HALF;
    const y = Math.random() * BOUNDS - BOUNDS_HALF;
    const z = Math.random() * BOUNDS - BOUNDS_HALF;

    theArray[ k + 0 ] = x;
    theArray[ k + 1 ] = y;
    theArray[ k + 2 ] = z;
    theArray[ k + 3 ] = 1;
  }
}

/**
 * fill velocity texture
 * @param texture 
 */
function fillVelocityTexture(texture:Texture) {
  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;

    theArray[ k + 0 ] = x * 10;
    theArray[ k + 1 ] = y * 10;
    theArray[ k + 2 ] = z * 10;
    theArray[ k + 3 ] = 1;

  }
}
