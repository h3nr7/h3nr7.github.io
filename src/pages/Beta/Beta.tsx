import { usePlane } from "@react-three/cannon";
import { folder, useControls } from "leva"
import { FiberWrapper } from "../../three/components/FiberWrapper"
import { Physics } from "@react-three/cannon"
import { Mesh } from "three";
import { useRef } from "react";
import { Cube } from "./components/Cube";
import { Ground } from "./components/Ground";
import { AccumulativeShadows, Environment, OrbitControls, PerspectiveCamera, RandomizedLight, Shadow, Stage } from "@react-three/drei";
import { BoundingBox } from "./components/BoundingBox";


export function Beta() {

  const { gravity, devMode } = useControls({
    gravity: {
      value: [0, -9.81, 0],
      step: 0.1,
      min: -9.81,
      max: 9.81
    },
    cannon: folder({
      devMode: {
        label: 'Dev mode',
        value: false
      }
    })
  });

  // const [ref] = usePlane(() => ({ position:[0, 0, 0.1], rotation:[-Math.PI / 2, 0, 0] }), useRef<Mesh>(null))

  return (
    <FiberWrapper 
      camera={{
        fov: 8,
        position: [100, 100, 100],
        near: 20,
        far: 500
      }}
    >
      <ambientLight />
      <pointLight position={[-10, 10, -10]} castShadow />
      <Physics gravity={gravity}>
        {/* <mesh ref={ref} visible={false}>
          <planeGeometry args={[200, 200]} />
        </mesh> */}
        <BoundingBox devMode={devMode}/>
        <Cube devMode={devMode}/>
        <Ground devMode={devMode}/>
      </Physics>
      <AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight amount={8} position={[5, 5, -10]} />
      </AccumulativeShadows>
      <OrbitControls target={[0, 0, 0]}/>
    </FiberWrapper>
  )
}