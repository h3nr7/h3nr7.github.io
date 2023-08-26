import { IUniform } from "three";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";

export interface BoidsProps {
  
}

export type BoidsUniform = { [uniform: string]: IUniform }

export interface IBoidsCtx {
  computationRenderer?: GPUComputationRenderer
  velocityVariable?: Variable
  positionVariable?: Variable
  velocityUniform?: BoidsUniform
  positionUniform?: BoidsUniform
}