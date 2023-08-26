
import { IUniform } from "three";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";


export interface BoidsBirdProps {
  
}

export type IBoidsCtx = BoidsMeshProps

export interface BoidsMeshProps {
  computationRenderer?: GPUComputationRenderer
  velocityVariable?: Variable
  positionVariable?: Variable
  velocityUniform?: BoidsUniform
  positionUniform?: BoidsUniform
}

export type BoidsUniform = { [uniform: string]: IUniform }