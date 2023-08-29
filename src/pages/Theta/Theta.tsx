import { BufferAttribute, BufferGeometry, ClampToEdgeWrapping, CubeUVReflectionMapping, EquirectangularReflectionMapping, FrontSide, LinearSRGBColorSpace, Material, Mesh, MeshStandardMaterial, MirroredRepeatWrapping, RepeatWrapping, SRGBColorSpace, Texture, UVMapping, Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { Ground } from "../Gamma/Ground";
import { PropsWithChildren, Suspense, useMemo, useState } from "react";
import { Clone, useGLTF } from "@react-three/drei";


export function Theta() {

  const lookAt = new Vector3(0, 0, 0);
  const [url, setUrl] = useState('/bird_skin.glb');


  return (
    <FiberWrapper 
    camera={{
      fov: 8,
      position: [200, 200, 350],
      near: 10,
      far: 3000
    }}
  >
      <hemisphereLight position={[0, 50, 0]} />
      <directionalLight position={[-30, 57, 30]} />
      <ambientLight intensity={1}/>
      <spotLight 
          castShadow
          angle={Math.PI/2}
          lookAt={() => lookAt}
          position={[0, 100, 0]} 
          decay={0.01}
          intensity={1}/>
          <Suspense>
            <Model url={url}/>
          </Suspense>
        <Ground/>
    </FiberWrapper>

  )
}

function Model({url}: PropsWithChildren<{url: string}>) {

  const { scene } = useGLTF(url)

  const {g, m} = useMemo(()=> {

    const mesh = scene.children[0] as Mesh
    const birdGeo = mesh.geometry, indices = [];

    const birdMat = mesh.material
    const birdMaterialMap = (birdMat as MeshStandardMaterial).map
    let bMap:Texture = new Texture()
    if (birdMaterialMap) {
      bMap = birdMaterialMap.clone()
      bMap.colorSpace = LinearSRGBColorSpace
      bMap.flipY = false
      bMap.channel = 0
      // bMap.mapping = UVMapping
      // bMap.wrapS = RepeatWrapping
      // bMap.wrapT = RepeatWrapping

    }

    const g = new BufferGeometry()
    const m = new MeshStandardMaterial({
      vertexColors: false,
      flatShading: true,
      color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: FrontSide,
      map: bMap
    })

    const totalVertices = birdGeo.getAttribute( 'position' ).count * 3
    const vertices = [], uv = []
    for ( let i = 0; i < totalVertices; i ++ ) {

      vertices.push( birdGeo.getAttribute( 'position' ).array[ i ] );
    }

    const totalUv = birdGeo.getAttribute( 'position' ).count * 2
    for ( let i = 0; i < totalUv; i ++ ) {
      uv.push( birdGeo.getAttribute( 'uv' ).array[ i ] );
    }

    g.setAttribute( 'uv', new BufferAttribute( new Float32Array( uv ), 2 ) );
    g.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
    g.setIndex( birdGeo.index );

    console.log(m, birdMat, mesh)

    return {m, g}
  }, [scene])



  return g && m && (
    // <Clone object={scene} scale={0.2}/>
    <mesh geometry={g} material={m}/>
  )
}