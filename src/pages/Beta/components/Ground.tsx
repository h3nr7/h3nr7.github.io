import { usePlane } from "@react-three/cannon";
import { Grid, Plane } from "@react-three/drei";
import { PropsWithChildren, useRef } from "react";
import { Mesh } from "three";

interface GroundProps {
  devMode?: boolean
}

export function Ground({ devMode }:PropsWithChildren<GroundProps>) {

  const [ref] = usePlane(() => ({ position:[0, 0, 0.1], rotation:[-Math.PI / 2, 0, 0] }), useRef<Mesh>(null))

  return (
    <group>
      <mesh ref={ref}>
        <planeGeometry args={[200, 200]} />
      </mesh>
      <Grid 
        args={[200, 200]} 
        position={[0, 0, 0.1]} 
        fadeDistance={300} 
        sectionColor={'blanchedalmond'}
        cellColor={'grey'}
        receiveShadow />
    </group>
  )
}