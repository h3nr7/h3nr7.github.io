import SimpleBirdGeometry from "./geometry/SimpleBirdGeometry"
import { DoubleSide, ShaderMaterial, Color, Texture } from 'three'
import { useMemo } from 'react'
import { vert } from "./shaders/vert";
import { frag } from "./shaders/frag";
import { useFrame } from "@react-three/fiber";
import { useBoids } from "./Boids";


/**
 * Simple bird mesh
 * @returns 
 */
export function BoidsSimple() {

  const { computationRenderer, positionVariable, velocityVariable } = useBoids()

  const birdUniforms = useMemo(() => {

    return  {
      color: { value: new Color( 0xff2200 ) },
      texturePosition: { value: new Texture() },
      textureVelocity: { value: new Texture() },
      time: { value: 1.0 },
      delta: { value: 0.0 }
    }
  }, [])

  useFrame(() => {

    if(!computationRenderer || !positionVariable || !velocityVariable) return

    birdUniforms[ 'texturePosition' ].value = computationRenderer.getCurrentRenderTarget( positionVariable ).texture;
    birdUniforms[ 'textureVelocity' ].value = computationRenderer.getCurrentRenderTarget( velocityVariable ).texture;

  })

  const material = new ShaderMaterial({
    uniforms: birdUniforms,
    vertexShader: vert,
    fragmentShader: frag,
    side: DoubleSide
  })

  const geometry = new SimpleBirdGeometry()

  return (
    <mesh material={material} geometry={geometry} rotation={[0, Math.PI/2, 0]}/>
  )
}