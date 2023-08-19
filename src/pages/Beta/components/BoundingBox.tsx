import { usePlane } from '@react-three/cannon';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { Mesh } from 'three';

interface CubeProps {
  devMode?:boolean
  distance?: number
  altitude?: number
}

export function BoundingBox({ devMode, distance = 10, altitude = 100 }:PropsWithChildren<CubeProps>) {

  const [refLeft] = usePlane(() => ({ position:[0, altitude/2, -distance] }), useRef<Mesh>(null))
  const [refRight] = usePlane(() => ({ position:[0, altitude/2, distance], rotation:[0, -Math.PI, 0] }), useRef<Mesh>(null))
  const [refFront] = usePlane(() => ({ position:[distance, altitude/2, 0], rotation:[0, -Math.PI/2, 0] }), useRef<Mesh>(null))
  const [refBack] = usePlane(() => ({ position:[-distance, altitude/2, 0], rotation:[0, Math.PI/2, 0] }), useRef<Mesh>(null))

  useEffect(() => {
    refLeft.current?.position.setZ(-distance);
  }, [distance])

  return (
    <group>
      <mesh ref={refLeft} visible={devMode}>
        <planeGeometry args={[altitude, altitude]} />
        <meshBasicMaterial color={'green'} />
      </mesh>
      <mesh ref={refRight} visible={devMode}>
        <planeGeometry args={[altitude, altitude]} />
        <meshBasicMaterial color={'pink'} />
      </mesh>
      <mesh ref={refFront} visible={devMode}>
        <planeGeometry args={[altitude, altitude]} />
        <meshBasicMaterial color={'blue'} />
      </mesh>
      <mesh ref={refBack} visible={devMode}>
        <planeGeometry args={[altitude, altitude]} />
        <meshBasicMaterial color={'yellow'} />
      </mesh>
    </group>
  )
}