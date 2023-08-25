import { usePlane } from "@react-three/cannon";
import { Grid, Plane } from "@react-three/drei";
import { PropsWithChildren, useRef } from "react";
import { Mesh } from "three";

interface GroundProps {
  devMode?: boolean
  hasPhysics?: boolean
}

export function Ground({ devMode, hasPhysics }:PropsWithChildren<GroundProps>) {

  const [ref] = usePlane(() => ({ position:[0, 0, 0.1], rotation:[-Math.PI / 2, 0, 0] }), useRef<Mesh>(null))

  return (
    <group>
      {hasPhysics ? (
        <mesh ref={ref} visible={false}>
          <planeGeometry args={[200, 200]} />
        </mesh>
      ) : null}
      <Grid 
        args={[200, 200]} 
        position={[0, 0, 0.1]} 
        fadeDistance={500} 
        sectionColor={'blanchedalmond'}
        cellColor={'grey'}
        />
    </group>
  )
}