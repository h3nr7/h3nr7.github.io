import { Grid, OrbitControls, Plane } from "@react-three/drei";
import { PropsWithChildren, useRef } from "react";
import { Mesh } from "three";

interface GroundProps {
  devMode?: boolean
  fadeDistance?: number
}

export function Ground({ 
  devMode,
  fadeDistance = 500
}:PropsWithChildren<GroundProps>) {

  return (
    <group>
      <Grid 
        args={[200, 200]} 
        position={[0, 0, 0.1]} 
        fadeDistance={fadeDistance} 
        sectionColor={'blanchedalmond'}
        cellColor={'grey'}
        />
        <OrbitControls target={[0, 0, 0]}/>
    </group>
  )
}