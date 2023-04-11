import { Canvas, extend, Object3DNode, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment, Sky, Shadow, shaderMaterial } from '@react-three/drei'
import { FiberWrapper } from '../../three/components/FiberWrapper'
import { usePotreeLoader } from '../../three/loaders/usePotreeLoader'
import { BackSide, Color, DirectionalLight, Euler, FrontSide, Material, PlaneGeometry, Quaternion, Texture, Vector3 } from 'three'
import { useTextureLoader } from '../../three/loaders/useTextureLoader'
import { useLayoutEffect, useMemo } from 'react'
import { degToRad } from 'three/src/math/MathUtils'
import { CanvasControl } from '../../three/components/CanvasControl'
import './materials/ColorShiftMaterial';
import { Island } from './Island/Island'
import { useControls, folder } from 'leva'
import { Sea } from './Sea/Sea'
    
    
    export function Alpha() {
        const {
            islandColorRatio,
            islandScale,
            seaHeight,
            seaFrequency,
            seaSpeed,
            seaTroughColor,
            seaCrestColor,
            seaWaveColorOffset,
            seaWaveFactor,
            seaNoiseDamper
        } = useControls({
            island: folder({
                islandColorRatio: {
                    label: "colorRatio",
                    value: 0.5,
                    min: 0,
                    max: 1
                },
                islandScale: {
                    label: "scale",
                    value: 0.2,
                    min: 0.1,
                    max: 1
                }
            }),
            sea: folder({
                seaHeight: {
                    label: "height",
                    value: 0.02,
                    min: 0.01,
                    max: 1
                },
                seaFrequency: {
                    label: "frequency",
                    value: {x: 2, y: 2},
                    min: 0,
                    max: 4
                },
                seaSpeed: {
                    label: "speed",
                    value: 1,
                    min: 0.1,
                    max: 10
                },
                seaTroughColor: {
                    label: "wave trough",
                    value: '#061b5c'
                },
                seaCrestColor: {
                    label: "wave crest",
                    value: '#81d4de'
                },
                seaWaveColorOffset: {
                    label: "color offset",
                    value: 1,
                    min: -2,
                    max: 10
                },
                seaWaveFactor: {
                    label: "color factor",
                    value: 10,
                    min: 1,
                    max: 50
                },
                seaNoiseDamper: {
                    label: "noise damper",
                    value: 0.1,
                    min: 0.01,
                    max: 1
                }
            })
        })

        usePotreeLoader('https://assets.h3nr7.com/downsampled_test_23-03-2023.las_converted')    
      
      // const rotation = new Euler()
      // const quad = new Quaternion()
      // quad.setFromAxisAngle(new Vector3(1, 0, 0), degToRad(-90))
      // const r = rotation.setFromQuaternion(quad)
      

    return (
        <FiberWrapper>
            {/* <color attach='background' args={['#eeeeee']} /> */}
            <ambientLight intensity={0.35}/>
            <directionalLight 
                intensity={1.2}
                color={'#ffcc33'}
                position={[100, -30, -10]}
                castShadow={true} />
            {/* <directionalLightHelper /> */}
            <Sky />
            <Environment 
                background={false}
                preset='sunset'/>
            <PerspectiveCamera 
                makeDefault
                position={[20, 10, 10]} />
            {/* <mesh>
                <sphereGeometry args={[4.999, 512, 512]}/>
                <meshLambertMaterial color={'#0066cc'} />
            </mesh> */}
            <Sea 
                height={seaHeight}
                frequency={seaFrequency}
                speed={seaSpeed}
                troughColor={seaTroughColor as THREE.HexColorString}
                crestColor={seaCrestColor as THREE.HexColorString}
                waveColorOffset={seaWaveColorOffset}
                waveFactor={seaWaveFactor}
                noiseDamper={seaNoiseDamper}
                />
            <Island 
                islandScale={islandScale}
                islandColorRatio={islandColorRatio} />
            <CanvasControl />
            <OrbitControls />
        </FiberWrapper>
    )
}