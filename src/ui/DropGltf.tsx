import { PropsWithChildren, Ref, createContext, useCallback, useContext, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { styled } from 'styled-components'
import { Group, Scene } from 'three'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GeoMatObj, findObjWithGeoMat } from '../three/helpers/gltf'



export interface DropGltfProps {
  onLoaded: (status:boolean) => void
}

export interface DropGltfStates {
  gltf?: GLTF
  validGeoMat?: GeoMatObj
  reset: () => void
  hasTexture?: boolean
}

const Ctx = createContext<DropGltfStates>({
  reset: () => {}
})

export const useDropGltf = () => useContext(Ctx)

export function DropGltf({ children, onLoaded }:PropsWithChildren<DropGltfProps>) {

  const [error, setError] = useState<Error>()
  const [gltf, setGltf] = useState<GLTF>()
  const [validGeoMat, setValidGeoMat] = useState<GeoMatObj>()
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/' )
  loader.setDRACOLoader( dracoLoader )

  const dropHandler = useCallback(async (files: any[]) => {
    if(files && files.length > 0) {
      const url = URL.createObjectURL(files[0])
      loader.load(url, gltf => {
        setGltf(gltf)
        try {
          const one = findObjWithGeoMat(gltf.scene.children)
          setValidGeoMat(one)
        } catch(e) {
          setValidGeoMat(undefined)
        }
        if(onLoaded) onLoaded(!!gltf)
      })
    } else {
      setError(new Error('No file is passed into drop zone'))
    }
  }, [])

  const reset = () => {
    setGltf(undefined)
    setValidGeoMat(undefined)
  }

  return (
    <Ctx.Provider value={{ gltf, validGeoMat, reset }}>
      {gltf ? children : (
        <Dropzone onDrop={dropHandler}>
          {({getRootProps, getInputProps}) => (
            <Section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop a GLTF file here, or click to select.</p>
              </div>
            </Section>
          )}
        </Dropzone>
      )}
    </Ctx.Provider>
  )

}

const Section = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  p {
    font-size: 11px;
    padding: 20px;
    border: 1px dashed rgba(0, 0, 0, 0.25);
    background: none;
    color: black;
    cursor: default;
    transition: background-color 0.2s ease-in, color 0.15s ease-out; 
    
    &:hover {
      color: white;
      background: rgba(0, 0, 0, 1);
      cursor: pointer;
    }
  }
`

const Cross = styled.div`
  background: black;
  color: white;
  font-family: rift-soft, sans-serif;
  position: absolute;
  display: block;
  right: 0;
  top: 0;
  width: 100px;
  height: auto;
  padding: 10px 20px;
  cursor: default;

  &:hover {
    cursor: pointer;
  }
`

const asyncReadFile = async (file:any) => {
  return new Promise<Blob>((resolve, reject) => {

    const reader = new FileReader();

      reader.onload = e => {
        if(!e.target?.result || !(e.target?.result instanceof ArrayBuffer)) return
          const blob = new Blob([new Uint8Array(e.target.result)], {type: file.type });
          resolve(blob)
      };

      reader.onerror = e => {
        if(e.target?.error) {
          reject(e.target.error)
        }
      }

      reader.readAsArrayBuffer(file)
   })
}