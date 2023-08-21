import { PropsWithChildren, useRef } from "react";
import { BoidsProps } from "./Boids.interface";
import { Instance } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";


export function Boids({}:PropsWithChildren<BoidsProps>) {



  return (
    <group>

    </group>
  )
}

function Boid(){

  const ref = useRef<typeof Instance>(null);
  const pointerOver = (e:ThreeEvent<PointerEvent>) => {}
  const pointerUp = (e:ThreeEvent<PointerEvent>) => {}

  return <group>
    <Instance ref={ref} onPointerOver={pointerOver} onPointerUp={pointerUp} />
  </group>
}