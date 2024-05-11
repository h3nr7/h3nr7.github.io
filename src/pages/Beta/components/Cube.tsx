import { useBox } from '@react-three/cannon';
import { PropsWithChildren, useRef } from 'react';
import { Mesh } from 'three';

interface CubeProps {
  devMode?:boolean
  position: [number, number, number]
  hasPhysics?: boolean
}

export function Cube({ devMode, position, hasPhysics = true }:PropsWithChildren<CubeProps>) {
  
  const [ref] = hasPhysics ? 
    useBox(() => ({ mass: 1, position: position, rotation:[Math.PI/5, Math.PI/7, 0] }), useRef<Mesh>(null)) :
    [useRef<Mesh>(null)];

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry />
      <meshLambertMaterial color={'red'}/>
    </mesh>
  )
}