import { PropsWithChildren, useRef } from "react";
import { BoidProps } from "./Boids.interface";
import { Instance } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

export function Boid({ position }:PropsWithChildren<BoidProps>){

  const ref = useRef<typeof Instance>(null);
  const pointerOver = (e:ThreeEvent<PointerEvent>) => {}
  const pointerUp = (e:ThreeEvent<PointerEvent>) => {}


  return <group>
    <Instance 
      ref={ref} 
      position={position}
      onPointerOver={pointerOver} 
      onPointerUp={pointerUp} />
  </group>
}