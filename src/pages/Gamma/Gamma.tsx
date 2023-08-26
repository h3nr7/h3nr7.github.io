import { Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Ground } from "./Ground";
import { Boids, BoidsSimple } from "./Boids";
import { BoidsGltf } from "./Boids/BoidsGltf";


export function Gamma() {

  const lookAt = new Vector3(0, 0, 0);


  return (
    <FiberWrapper 
    camera={{
      fov: 75,
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
    <Boids>

      <BoidsGltf />
      {/* <BoidsSimple /> */}
    </Boids>
    <Ground/>

  </FiberWrapper>
  )
}