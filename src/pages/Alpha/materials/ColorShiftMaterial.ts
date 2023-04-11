import { shaderMaterial } from '@react-three/drei'
import { extend, Object3DNode, } from '@react-three/fiber'
import { vert } from '../Island/shaders/vert';
import { frag } from '../Island/shaders/frag';
import * as THREE from 'three'

interface IColorShiftMaterial {
  alphaMap: THREE.Texture,
  displacementMap: THREE.Texture
  color1: THREE.Color
  color2: THREE.Color
}

export const ColorShiftMaterial = shaderMaterial(
  {
    alphaMap: new THREE.Texture(),
    displacementMap: new THREE.Texture(),
    displacementScale: 100,
    color1: new THREE.Color('blue'),
    color2: new THREE.Color('green')
  },
  // { time: 0, color: new Color(0.2, 0.0, 0.1) },
  // vertex shader
  /*glsl*/vert,
  // fragment shader
  /*glsl*/frag

)

declare global {
  namespace JSX {
      interface IntrinsicElements {
          colorShiftMaterial: Object3DNode<IColorShiftMaterial, typeof ColorShiftMaterial>
      }
  }
}

extend({ ColorShiftMaterial })
