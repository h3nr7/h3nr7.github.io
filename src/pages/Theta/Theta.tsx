import { BufferAttribute, BufferGeometry, ClampToEdgeWrapping, CubeUVReflectionMapping, EquirectangularReflectionMapping, FrontSide, Group, LinearSRGBColorSpace, Material, Mesh, MeshStandardMaterial, MirroredRepeatWrapping, Object3D, RepeatWrapping, SRGBColorSpace, Texture, UVMapping, Vector3 } from "three";
import { FiberWrapper } from "../../three/components/FiberWrapper";
import { PropsWithChildren, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Center, Clone, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { DropGltf, useDropGltf } from "../../ui/DropGltf";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { button, useControls } from "leva";
import { findObjWithGeoMat } from "../../three/helpers/gltf";


export function Theta() {

  const [{ pause, status, isReset, custom }, set] = useControls(() => ({
    pause: {
      value: false
    },
    status: {
      label: 'GLTF loaded',
      value: false,
      disabled: true
    },
    isReset: {
      value: true,
      render: () => false
    },
    reset: button(
      (get) => { if(!get('reset')) {
        // a bit hacky but fuck it
        set({isReset: true }) }
        set({status: false})
      }
    ),
    custom: {
      label: 'Use baked texture',
      value: false
    }
  }))

  return (
    <DropGltf onLoaded={status => {
      set({ status })
      set({ isReset: false })
    }}>
      <Inner reset={!!isReset} custom={custom} />
    </DropGltf>
  )
}

function Inner({ reset, custom }: PropsWithChildren<{ reset: boolean, custom: boolean }>) {

  const { gltf, validGeoMat, reset: gltfReset } = useDropGltf()
  useEffect(() => { if(reset) gltfReset() }, [reset])
  // log gltf in console
  useEffect(() => console.log('Loaded GLTF and found GeoMat: ', gltf, validGeoMat), [gltf])
  

  return (
    <FiberWrapper 
      camera={{
        fov: 8,
        position: [200, 200, 350],
        near: 10,
        far: 3000
      }}
    >
      <Stage>
          <Suspense>
            <Center>
              {gltf && <Model gltf={gltf} isDefault={!custom || !validGeoMat}/>}
            </Center>
          </Suspense>
          <OrbitControls />
      </Stage>

      </FiberWrapper>
  )
}


/**
 * Model component, use default Clone or custom
 * @param param0 
 * @returns 
 */
function Model({
  gltf, 
  isDefault = false, 
  scale = 0.2
}: PropsWithChildren<{gltf: GLTF, isDefault?: boolean, scale?:number}>) {

  return gltf.scene && (
    isDefault ? <Clone object={gltf.scene} scale={scale}/> : <Custom object={gltf.scene.children} scale={scale}/>
  )
}


/**
 * custom component
 * @param param0 
 * @returns 
 */
function Custom({ object, scale }:PropsWithChildren<{object: Object3D[], scale?:number}>) {

  // clone geometry and material from gltf scenes
  const {g, m} = useMemo(()=> {

    const mesh = findObjWithGeoMat(object)
    const birdGeo = mesh.geometry, indices = [];

    const birdMat = mesh.material
    const birdMaterialMap = (birdMat as MeshStandardMaterial).map
    let bMap:Texture = new Texture()

    if (birdMaterialMap) {
      bMap = birdMaterialMap.clone()
      bMap.channel = 0
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

    return {m, g}
  }, [object])

  return (
    <mesh geometry={g} material={m} scale={scale}/>
  )

}

/**
 * get deeply embedded mesh
 * @param mesh 
 * @returns 
 */
function getMeshWithMaterial(mesh:Object3D) {
  if(
    mesh instanceof Mesh && 
    mesh.isMesh && 
    mesh.geometry instanceof BufferGeometry && 
    mesh.geometry.isBufferGeometry &&
    mesh.material instanceof Material &&
    mesh.material.isMaterial
  ) {
    return mesh
  } else if(mesh.children.length > 0) {
    return getMeshWithMaterial(mesh.children[0])
  } else {
    throw new Error('no valid mesh with geometry ');
  }
}