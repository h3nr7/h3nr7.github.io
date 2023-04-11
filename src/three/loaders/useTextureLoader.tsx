import { useEffect, useState } from "react";
import { Texture, TextureLoader } from "three";


export function useTextureLoader(url: string): [Texture, number, Error | undefined] {

  const loader = new TextureLoader()
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<Error>()
  const [texture, setTexture] = useState<Texture>(new Texture())

  useEffect(() => {
    loader.load(url, tex => {
      setTexture(tex)
    },
    event => setProgress(event.loaded/event.total),
    err => {
      console.error('Texture load error: ', err)
      setError(new Error(err.message))
    })
  }, [url])

  return [texture, progress, error]
}