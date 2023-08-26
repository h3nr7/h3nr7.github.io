import { useMemo } from "react";
import { Texture, WebGLRenderer, Vector3, RepeatWrapping } from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { velocityFrag } from "./shaders/velocityFrag";
import { positionFrag } from "./shaders/positionFrag";

const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

export interface BoidComputationProps {
  boundary?: [number, number]
  renderer: WebGLRenderer
}

export function BoidComputation({ 
  boundary = [200, 200],
  renderer
}:BoidComputationProps) {


  const gpuCompute = useMemo(() => {
    const gpu = new GPUComputationRenderer(boundary[0], boundary[1], renderer)
    const dtVelocity = gpu.createTexture()
    const dtPosition = gpu.createTexture()
    fillVelocityTexture(dtVelocity)
    fillPositionTexture(dtPosition)

    const velocityVariable = gpu.addVariable('textureVelocity', velocityFrag, dtVelocity)
    const positionVariable = gpu.addVariable('texturePosition', positionFrag, dtPosition)

    const { uniforms: velocityUniform } = velocityVariable.material
    const { uniforms: positionUniform } = positionVariable.material

    velocityUniform['time'] = { value: 1.0 }
    velocityUniform['delta'] = { value: 0.0 }
    velocityUniform['testing'] = { value: 1.0 }
    velocityUniform['separationDistance'] = { value: 1.0 }
    velocityUniform['alignmentDistance'] = { value: 1.0 }
    velocityUniform['cohesionDistance'] = { value: 1.0 }
    velocityUniform['freedomFactor'] = { value: 1.0 }
    velocityUniform['predator'] = { value: new Vector3() }

    positionUniform['time'] = { value: 0.0 }
    positionUniform['delta'] = { value: 0.0 }


    velocityVariable.wrapS = RepeatWrapping
    velocityVariable.wrapT = RepeatWrapping

    positionVariable.wrapS = RepeatWrapping
    positionVariable.wrapT = RepeatWrapping

    try {
      gpu.init()
    } catch(e) {
      console.error('BoidComputation Error:' + (e as Error)?.message)
    }

    return gpu
  }, [boundary, renderer])

  return gpuCompute
}

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
