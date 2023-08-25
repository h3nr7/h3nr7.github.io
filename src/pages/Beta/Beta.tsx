import { folder, useControls } from "leva"
import { FiberWrapper } from "../../three/components/FiberWrapper"
import { Physics } from "@react-three/cannon"
// import { Mesh } from "three";
import { useMemo } from "react";
import { Cube } from "./components/Cube";
import { Ground } from "./components/Ground";
import { AccumulativeShadows, Lightformer, OrbitControls } from "@react-three/drei";
import { BoundingBox } from "./components/BoundingBox";
import { Vector3 } from "three";

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

  const lookAt = new Vector3(0, 0, 0);
  


  return (
    <FiberWrapper 
      camera={{
        fov: 8,
        position: [200, 200, 200],
        near: 10,
        far: 1000
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
      <Physics gravity={gravity}>
        {arr.map((d, i) => <Cube key={i} devMode={devMode} position={[0, d, 0]} />)}
        <BoundingBox devMode={devMode} />
        <Ground devMode={devMode}/>
      </Physics>
      <OrbitControls target={[0, 0, 0]}/>
    </FiberWrapper>
  )
}