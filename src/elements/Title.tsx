<<<<<<< HEAD
import { FontData, Text3D } from "@react-three/drei";
import { PropsWithChildren, Ref, forwardRef, useImperativeHandle, useRef } from "react";
import { Group, Mesh, Quaternion, Vector3 } from "three";
=======
import { Center, FontData, Text3D } from "@react-three/drei";
import { Component, PropsWithChildren } from "react";
>>>>>>> 8310af26c6f8da00d888db71f4ea5082499810ec

const DEFAULT_FONT_URL = `astor_place_bold_regular.json`

interface ITitle extends PropsWithChildren {
<<<<<<< HEAD
    innerRef: Ref<Mesh>
    text: string
    size?: number
    curveSegments?: number
    bevelEnabled?: boolean
    fonts?: string | FontData
    quaternion?: Quaternion
}

export type ITitleHandler = {
    wrapper: Group | null
    inner: Mesh | null
}

export const Title = forwardRef<ITitleHandler, ITitle>(({
    text, fonts, 
    size = 2, 
    curveSegments = 12,
    bevelEnabled = false,
    children
}, ref) => {

    const groupRef = useRef<Group>(null)
    const textRef = useRef<Mesh>(null)

    useImperativeHandle(ref, () => ({
        get wrapper() {
            return groupRef.current
        },
        get inner() {
            return textRef.current
        }
    }))
        
    return (
        <group ref={groupRef}>
        <group 
            position={new Vector3(0, 7, 0)}
        >
        <Text3D 
            ref={textRef}
            curveSegments={curveSegments}
            bevelEnabled={bevelEnabled}
            font={fonts || DEFAULT_FONT_URL}
            size={size}>
=======
    text: string
    fonts?: string | FontData
}

export function Title({ text, fonts, children }: ITitle) {

    return (
        <Center>
        <Text3D font={fonts || DEFAULT_FONT_URL}>
>>>>>>> 8310af26c6f8da00d888db71f4ea5082499810ec
            {text && text.toUpperCase()}
            <meshNormalMaterial />
            {children}
            </Text3D> 
<<<<<<< HEAD
        </group>
        </group>
    )
})
=======
        </Center>
    )
}
>>>>>>> 8310af26c6f8da00d888db71f4ea5082499810ec
