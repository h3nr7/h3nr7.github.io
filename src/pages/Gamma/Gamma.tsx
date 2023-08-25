import { Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Boids } from "./Boids";
import { BoidsBird } from './BoidsBird/BoidsBird'
import { Ground } from "./Ground";


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
    <ambientLight intensity={1}/>
    <spotLight 
        castShadow
        angle={Math.PI/2}
        lookAt={() => lookAt}
        position={[0, 100, 0]} 
        decay={0.01}
        intensity={1}/>
    {/* <Boids /> */}
    <BoidsBird />
    <Ground />

  </FiberWrapper>
  )
}