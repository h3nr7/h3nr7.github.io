import { useFrame } from "@react-three/fiber";
import { ITitleHandler, Title } from "../../../elements/Title";
import { useEffect, useRef, useState } from "react";
import { Box3, Euler, Group, Mesh } from "three";
import { useSpring, animated, config } from '@react-spring/three'

interface IBanner {
    tiltFactor?: number
}

export function Banner({
    tiltFactor = 0.1
}: IBanner) {

    const ref = useRef<ITitleHandler>(null)
    const innerRef = useRef<Mesh>(null)
    const [loaded, setLoaded] = useState(false)
    const euler = new Euler(0, 0, 0)

    useEffect(() => setLoaded(true), [])

    useFrame(({ mouse, viewport, camera }) => {
        // camera.quaternion
        const x = mouse.x * viewport.width * tiltFactor
        const y = mouse.y * viewport.height * tiltFactor
        ref.current?.inner?.geometry.center()
        ref.current?.inner?.setRotationFromEuler(euler.set(y, -x, 0, 'XYZ'))
        ref.current?.wrapper?.quaternion.copy(camera.quaternion)

    })

    const { scale } = useSpring({ 
        scale: loaded ? 1 : 0.5,
        config: config.wobbly,
        delay: 2000
    })


    return (
        <animated.mesh
            scale={scale} >    
            <Title
                ref={ref}
                innerRef={innerRef}
                text='MALLORCA'
                size={1}
            ></Title>
        </animated.mesh>
    )
}