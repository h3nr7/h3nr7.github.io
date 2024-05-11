import { Line, Sphere, Tube } from "@react-three/drei";
import { useMemo } from "react"
import { CatmullRomCurve3, Curve, CurveType, Vector3 } from "three"
import { GrannyKnot } from "three/examples/jsm/curves/CurveExtras.js";


interface ISpline {
  visible?: boolean
  value: Vector3[] | CatmullRomCurve3
}

export function Spline({ visible, value }:ISpline) {

  const divisions = 120
  const isClosed = false
  const curveType: CurveType = 'catmullrom'
  const tension: number = 0.1;
  const sphereRadius: number = 0.1

  const [curve, points, tangents] = useMemo(() => {
    let curve: CatmullRomCurve3, points: Vector3[], tangents: Vector3[];

    if (value instanceof CatmullRomCurve3) {
      curve = value;
    } else {
      // warn if array is not correct
      if(!Array.isArray(value))console.warn(`Supplied points error with value: `, value);
      curve = new CatmullRomCurve3(value || [], isClosed, curveType, tension);
    }

    points = curve.getPoints(divisions)
    tangents = points.map((p, i) => curve.getTangent(i/divisions));
    

    console.log(points[3], tangents[3], points[3])

    return [curve, points, tangents];
  }, [value]);



  return (
    <group visible={visible}>
      <Line color={'cyan'} points={curve.getPoints(divisions)} />
      {
        points && points.map(p => (
          <Sphere position={p} args={[sphereRadius]}>
            <meshStandardMaterial color="hotpink" />
          </Sphere>
        ))
      }
      {
        tangents && tangents.map((t, i) => <Line color={i === 0 ? 'blue' : 'magenta'} points={[points[i], t.lerp(points[i], 0.9)]}/>)
      }
    </group>
  )
}