import { Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Boids, BoidsSimple } from "./Boids";
import { BoidsGltf } from "./Boids/BoidsGltf";
import { BoidsGltfAnim } from "./Boids/BoidsGltfAnim";
import { Ground } from "../../three/components/Ground";


export function Gamma() {

  const lookAt = new Vector3(0, 0, 0);


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
    {/* <Boids /> */}
    <Boids 
      separationDistance={0.1}
      alignmentDistance={0.1}
      cohesionDistance={0.1}
      freedomFactor={0.1}>
      {/* <BoidsGltfAnim size={0.05}/> */}
      <BoidsGltf size={0.05}/>
      {/* <BoidsSimple /> */}
    </Boids>
    <Ground />

  </FiberWrapper>
  )
}