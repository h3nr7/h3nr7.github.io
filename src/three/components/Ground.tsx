import { Grid, OrbitControls, Plane } from "@react-three/drei";
import { PropsWithChildren, useRef } from "react";
import { Mesh } from "three";
import { usePlane } from "@react-three/cannon";


interface GroundProps {
  devMode?: boolean
  hasPhysics?: boolean
  fadeDistance?: number
}

export function Ground({ 
  devMode,
  hasPhysics,
  fadeDistance = 500
}:PropsWithChildren<GroundProps>) {

  const [ref] = hasPhysics ? usePlane(() => ({ position:[0, 0, 0.1], rotation:[-Math.PI / 2, 0, 0] }), useRef<Mesh>(null)) : []

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
        fadeDistance={fadeDistance} 
        sectionColor={'blanchedalmond'}
        cellColor={'grey'}
        />
    </group>
  )
}