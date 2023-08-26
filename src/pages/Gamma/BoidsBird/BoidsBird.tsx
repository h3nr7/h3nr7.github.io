import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { BoidsBirdProps, BoidsMeshProps, IBoidsCtx } from "./BoidsBird.interface";
import { BoidsBirdGeometry } from './BoidsBirdGeometry'
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Texture, RepeatWrapping } from 'three'
import { velocityFrag } from "../Boids/shaders/velocityFrag";
import { positionFrag } from "../Boids/shaders/positionFrag";
import { BoidsSimple } from "../Boids/BoidsSimple";

const SIZE_LIMIT = 5
const WIDTH = 64;
const BOUNDS = 100, BOUNDS_HALF = BOUNDS / 2


const BoidsCtx = createContext<IBoidsCtx>({})

export const useBoids = () => useContext(BoidsCtx)

export function BoidsBird({ children }:PropsWithChildren<BoidsBirdProps>) {

  const { gl } = useThree()

  const { 
    computationRenderer, 
    velocityVariable,
    positionVariable,
    velocityUniform, 
    positionUniform 
  } = useMemo(() => {
    const gpu = new GPUComputationRenderer(WIDTH, WIDTH, gl)

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
  
    return { computationRenderer: gpu, velocityVariable, positionVariable, velocityUniform, positionUniform }
  }, [])

  let last = performance.now()

  useFrame(f => {
    if(!computationRenderer || !velocityUniform || !positionUniform) return
    let now = f.clock.oldTime
    let delta = ( now - last ) / 1000;

    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    last = now;

    velocityUniform[ 'time' ].value = now;
    velocityUniform[ 'delta' ].value = delta;
    positionUniform[ 'time' ].value = now;
    positionUniform[ 'delta' ].value = delta;

    computationRenderer.compute()

  })


  return (
    <BoidsCtx.Provider 
      value={{ 
        computationRenderer, 
        velocityVariable,
        positionVariable,
        velocityUniform,
        positionUniform 
      }}>
        {children}
      {/* // <BoidsBirdGeometry 
      //   size={0.2} 
      //   computationRenderer={gpuCompute}
      //   velocityVariable={velocityVariable}
      //   positionVariable={positionVariable}
      // /> */}
      {/* <BoidsSimple 
        computationRenderer={computationRenderer}
        velocityVariable={velocityVariable}
        positionVariable={positionVariable}/> */}
    </BoidsCtx.Provider>

  )
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


