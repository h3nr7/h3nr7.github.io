import { folder, useControls } from "leva";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Spline } from "./components/Spline";
import { Box, OrbitControls } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";
import { Cube } from "../Beta/components/Cube";
import { TorusKnot } from "three/examples/jsm/curves/CurveExtras.js";


export function Ribbons() {

  const { wireframe } = useControls({
    animation: folder({
      wireframe: {
        title: 'show wireframes',
        value: false
      }
    })
  })

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

      <Spline visible={true} value={new TorusKnot().getPoints(60)}/>
      <Cube position={[0, 0, 0]} hasPhysics={false}/>
      <OrbitControls />
    </FiberWrapper>
  )
}