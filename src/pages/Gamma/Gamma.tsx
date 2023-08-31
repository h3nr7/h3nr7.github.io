import { Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Boids, BoidsSimple } from "./Boids";
import { BoidsGltf } from "./Boids/BoidsGltf";
import { Ground } from "../../three/components/Ground";
import { folder, useControls } from "leva";
import { OrbitControls } from "@react-three/drei";


export function Gamma() {

  const lookAt = new Vector3(0, 0, 0);


  // test birds
  const testLinks = [
    '/Parrot.glb',
    '/Flamingo.glb',
    '/bird_skin.glb',
    '/bird-new.glb',
    '/bird.glb',
    '/toucan_bird.glb'
  ]

  const { pauseBoids } = useControls({
    animation: folder({
      pauseBoids: {
        title: 'pause boids',
        value: false
      }
    })
  })


  return (
    <FiberWrapper 
    camera={{
      fov: 8,
      position: [200, 200, 350],
      near: 10,
      far: 3000
    }}
  >
    <hemisphereLight position={[0, 50, 0]}/>
    <directionalLight position={[-30, 57, 30]} />
    <ambientLight intensity={1}/>
    <spotLight 
        castShadow
        angle={Math.PI/2}
        lookAt={() => lookAt}
        position={[0, 100, 0]} 
        decay={0.01}
        intensity={1}/>
    <Boids 
      countSquare={8}
      pause={pauseBoids}
      separationDistance={0.1}
      alignmentDistance={0.1}
      cohesionDistance={0.1}
      freedomFactor={0.1}>
      <BoidsGltf size={0.05} url={testLinks[0]}/>
    </Boids>
    <Boids 
      countSquare={16}
      pause={pauseBoids}
      separationDistance={0.5}
      alignmentDistance={0.5}
      cohesionDistance={0.5}
      freedomFactor={0.75}
      preyRadius={50.0}>
      <BoidsGltf size={0.05} url={testLinks[1]}/>
    </Boids>
    <OrbitControls target={[0, 0, 0]}/>
  </FiberWrapper>
  )
}