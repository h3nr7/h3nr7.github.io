import { useBox } from '@react-three/cannon';
import { PropsWithChildren, useRef } from 'react';
import { Mesh } from 'three';

interface CubeProps {
  devMode?:boolean
}

export function BoundingBox({ devMode }:PropsWithChildren<CubeProps>) {
  
  const [ref] = useBox(() => ({ mass: 0, position: [0, 10, 0], }), useRef<Mesh>(null))

  return (
    <mesh ref={ref} visible={devMode}>
      <boxGeometry args={[20, 20, 20]}/>
      <meshPhongMaterial wireframe={true} />
    </mesh>
  )
}