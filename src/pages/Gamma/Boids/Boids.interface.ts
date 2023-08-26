import { IUniform } from "three";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";

export interface BoidsProps {
  separationDistance?: number
  alignmentDistance?: number
  cohesionDistance?: number
  freedomFactor?: number
  predator?: [number, number, number]
}

export type BoidsUniform = { [uniform: string]: IUniform }

export interface IBoidsCtx {
  computationRenderer?: GPUComputationRenderer
  velocityVariable?: Variable
  positionVariable?: Variable
  velocityUniform?: BoidsUniform
  positionUniform?: BoidsUniform
}