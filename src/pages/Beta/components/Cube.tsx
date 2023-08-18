import { useBox } from '@react-three/cannon';
import { PropsWithChildren, useRef } from 'react';
import { Mesh } from 'three';

interface CubeProps {
  devMode?:boolean
}

export function Cube({ devMode }:PropsWithChildren<CubeProps>) {
  
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 10], rotation:[Math.PI/5, Math.PI/7, 0] }), useRef<Mesh>(null))

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry />
      <meshPhongMaterial color={'red'}/>
    </mesh>
  )
}