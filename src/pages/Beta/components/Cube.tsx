import { useBox } from '@react-three/cannon';
import { PropsWithChildren, useRef } from 'react';
import { Mesh } from 'three';

interface CubeProps {
  devMode?:boolean
  position: [number, number, number]
}

export function Cube({ devMode, position }:PropsWithChildren<CubeProps>) {
  
  const [ref] = useBox(() => ({ mass: 1, position: position, rotation:[Math.PI/5, Math.PI/7, 0] }), useRef<Mesh>(null))

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry />
      <meshLambertMaterial color={'red'}/>
    </mesh>
  )
}