import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { useTextureLoader } from "../../../three/loaders/useTextureLoader"
import { frag } from "./shaders/frag"
import { vert } from "./shaders/vert"

interface Island {
  islandColorRatio: number
  islandScale: number
}

export function Island({
  islandColorRatio,
  islandScale
}: Island) {

  const [bgTex, bgProgress, bgErr] = useTextureLoader('/bg.png')
  const [disTex, disProgress, disErr] = useTextureLoader('/displacement_map.jpg')

  const defaultMaterial = new THREE.MeshLambertMaterial()

  const material = useMemo(() => {
    if(bgTex && disTex) {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          fragColorRatio: { value: islandColorRatio },
          colorMap: { value: bgTex },
          displacementMap: { value: disTex},
          displacementScale: { value: islandScale },
          color1: { value: new THREE.Color('blue')},
          color2: { value: new THREE.Color('green') }
        },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true
      })

      return m
    }
  }, [bgTex, disTex, bgErr, disErr])

  useEffect(() => {
    if(!material) return;
    material.uniforms.fragColorRatio.value = islandColorRatio
    material.uniforms.displacementScale.value = islandScale
  }, [islandColorRatio, islandScale])

  return (
    <mesh
        material={material}
        receiveShadow={true} 
        castShadow={true}>
        {/* <meshLambertMaterial 
            side={FrontSide}
            transparent={true}
            map={bgTex}
            displacementScale={0.1}
            displacementMap={disTex}
        /> */}
        {/* <colorShiftMaterial 
            alphaMap={bgTex}
            displacementMap={disTex} /> */}
        {/* <shaderMaterial 
            vertexShader={vert}
            fragmentShader={frag}
            uniforms={{
                displacementMap: { value: disTex },
                color1: { value: new Color('blue') },
                color2: { value: new Color('green') }

            }}
        /> */}
        <sphereGeometry args={[5.01, 512, 512]}/>
        {/* <planeGeometry args={[5, 5, 500, 500]} /> */}
    </mesh>
  )
}