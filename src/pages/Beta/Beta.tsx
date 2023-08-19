import { usePlane } from "@react-three/cannon";
import { folder, useControls } from "leva"
import { FiberWrapper } from "../../three/components/FiberWrapper"
import { Physics } from "@react-three/cannon"
import { Mesh } from "three";
import { useMemo, useRef } from "react";
import { Cube } from "./components/Cube";
import { Ground } from "./components/Ground";
import { AccumulativeShadows, Environment, OrbitControls, PerspectiveCamera, RandomizedLight, Shadow, Stage } from "@react-three/drei";
import { BoundingBox } from "./components/BoundingBox";


export function Beta() {

  const { gravity, boxes, devMode } = useControls({
    gravity: {
      value: [0, -9.81, 0],
      step: 0.1,
      min: -9.81,
      max: 9.81
    },
    boxes: {
      value: 100,
      min: 1,
      max: 500
    },
    cannon: folder({
      devMode: {
        label: 'Dev mode',
        value: false
      }
    })
  });

  const arr = useMemo(() => {
    let tot = [], len = boxes;
    while(len > 0) {
      tot.push(Math.random() * 200);
      len--;
    }

    return tot;
  }, [boxes])

  

  return (
    <FiberWrapper 
      camera={{
        fov: 8,
        position: [100, 100, 100],
        near: 10,
        far: 1000
      }}
    >
      <ambientLight />
      <pointLight position={[-10, 10, -10]} castShadow />
      <Physics gravity={gravity}>
        {arr.map(d => <Cube devMode={devMode} position={[0, d, 0]} />)}
        <BoundingBox devMode={devMode} />
        <Ground devMode={devMode}/>
      </Physics>
      <AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight amount={8} position={[5, 5, -10]} />
      </AccumulativeShadows>
      <OrbitControls target={[0, 0, 0]}/>
    </FiberWrapper>
  )
}