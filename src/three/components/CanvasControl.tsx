import { useThree } from "@react-three/fiber"
import { useLayoutEffect } from "react"


export function CanvasControl() {

  const gl = useThree(state => state.gl)

  useLayoutEffect(() => {
    gl.shadowMap.enabled = true
  }, [gl])

  return null
}