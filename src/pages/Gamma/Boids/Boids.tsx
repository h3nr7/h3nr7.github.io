import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { BoidsProps, IBoidsCtx } from "./Boids.interface";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Texture, RepeatWrapping } from 'three'
import { velocityFrag } from "./shaders/velocityFrag";
import { positionFrag } from "./shaders/positionFrag";
import { fillPositionTexture, fillVelocityTexture } from "./helpers/initialisers";
import { BOUNDS, WIDTH } from ".";

/**
 * Boids Context
 */
const BoidsCtx = createContext<IBoidsCtx>({})

/**
 * Boids context hook
 * @returns 
 */
export const useBoids = () => useContext(BoidsCtx)


/**
 * Boids Wrapper
 * @param param0 
 * @returns 
 */
export function Boids({ children }:PropsWithChildren<BoidsProps>) {

  const { gl } = useThree()

  // memoised computation renderer, variables and uniforms
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
    velocityUniform['separationDistance'] = { value: 20.0 }
    velocityUniform['alignmentDistance'] = { value: 20.0 }
    velocityUniform['cohesionDistance'] = { value: 20.0 }
    velocityUniform['freedomFactor'] = { value: 0.75 }
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
  // use frame for rendered frames
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
      </BoidsCtx.Provider>
  )

}

