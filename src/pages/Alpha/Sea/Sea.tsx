import { useEffect, useMemo, useState } from "react"
import * as THREE from 'three'
import { vert } from './shaders/vert'
import { frag } from './shaders/frag'
import { Vector2 } from "three"
import { useFrame } from "@react-three/fiber"

interface Sea {
  noiseLevel?: number
  noiseDamper?: number
  height?: number
  frequency?: {x: number, y: number}
  speed?: number
  troughColor?: THREE.HexColorString
  crestColor?: THREE.HexColorString
  waveColorOffset?: number
  waveFactor?: number
}

export function Sea({
  noiseLevel = 1,
  noiseDamper = 0.1,
  height = 0.1,
  frequency = {x: 2, y: 2},
  speed = 1,
  troughColor = '#061b5c',
  crestColor = '#81d4de',
  waveColorOffset = 0,
  waveFactor = 1
}:Sea) {


  useFrame(state => {
    if(!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  const material = useMemo(() => {
    if(noiseLevel) {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          seaHeight: { value: height },
          seaFrequency: { value: new Vector2(frequency.x, frequency.y) },
          seaTroughColor: { value: new THREE.Color(troughColor) },
          seaCrestColor: { value: new THREE.Color(crestColor) },
          seaSpeed: { value: crestColor },
          seaWaveColorOffset: { value: waveColorOffset },
          seaWaveFactor: { value: waveFactor },
          seaNoiseDamper: { value: noiseDamper },
          uTime: { value: 0.0 }
        },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true
      })

      return m
    }
  }, [noiseLevel])

  useEffect(() => {
    if(!material) return;
    material.uniforms.seaHeight.value = height
    material.uniforms.seaFrequency.value.x = frequency.x
    material.uniforms.seaFrequency.value.y = frequency.y
    material.uniforms.seaSpeed.value = speed
    material.uniforms.seaTroughColor.value = new THREE.Color(troughColor)
    material.uniforms.seaCrestColor.value = new THREE.Color(crestColor)
    material.uniforms.seaWaveColorOffset.value = waveColorOffset
    material.uniforms.seaWaveFactor.value = waveFactor
    material.uniforms.seaNoiseDamper.value = noiseDamper
  }, [
    height, frequency.x, frequency.y, 
    speed, troughColor, crestColor,
    waveColorOffset, waveFactor, noiseDamper
  ])

  return (
    <mesh material={material}>
      <sphereGeometry args={[5, 512, 512]}/>
    </mesh>
  )
}