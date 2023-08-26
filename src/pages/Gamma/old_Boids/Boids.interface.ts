import { Vector3 } from 'three'

export interface BoidsProps {
  devMode?: boolean
  hasPhysics?: boolean
  total?: number
}

export interface BoidProps {
  position: Vector3 | [number, number, number]
}