import { PerspectiveCamera, OrbitControls, Environment, Sky, Shadow, shaderMaterial } from '@react-three/drei'
import { FiberWrapper } from '../../three/components/FiberWrapper'
import { CanvasControl } from '../../three/components/CanvasControl'
<<<<<<< HEAD
// import './materials/ColorShiftMaterial';
=======
>>>>>>> c606849 (working version)
import { Island } from './Island/Island'
import { useControls, folder } from 'leva'
import { Sea } from './Sea/Sea'
import { Title } from '../../elements/Title'
    
    
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
        seaNoiseFactor,
        seaWaveAmplitude
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
                value: 0.28,
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
                value: '#8997c3'
            },
            seaCrestColor: {
                label: "wave crest",
                value: '#81d4de'
            },
            seaWaveColorOffset: {
                label: "color offset",
                value: 1.9,
                min: -2,
                max: 10
            },
            seaWaveFactor: {
                label: "color factor",
                value: 10,
                min: 1,
                max: 50
            },
            seaWaveAmplitude: {
                label: "noise amplitude",
                value: 0.7,
                min: 0.1,
                max: 10
            },
            seaNoiseFactor: {
                label: "noise factor",
                value: 0.6,
                min: 0.1,
                max: 10
            }
        })
    })

    // usePotreeLoader('https://assets.h3nr7.com/downsampled_test_23-03-2023.las_converted')    
      

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
            <Sea 
                height={seaHeight}
                frequency={seaFrequency}
                speed={seaSpeed}
                troughColor={seaTroughColor as THREE.HexColorString}
                crestColor={seaCrestColor as THREE.HexColorString}
                waveColorOffset={seaWaveColorOffset}
                waveFactor={seaWaveFactor}
                waveAmplitude={seaWaveAmplitude}
                noiseFactor={seaNoiseFactor}
                />
            <Island 
                islandScale={islandScale}
                islandColorRatio={islandColorRatio} /> */}
            <Title text='Marllorca 1.0'></Title>
            <CanvasControl />
            <OrbitControls />
        </FiberWrapper>
    )
}