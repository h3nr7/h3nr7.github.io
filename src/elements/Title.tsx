import { Center, FontData, Text3D } from "@react-three/drei";
import { Component, PropsWithChildren } from "react";

const DEFAULT_FONT_URL = `astor_place_bold_regular.json`

interface ITitle extends PropsWithChildren {
    text: string
    fonts?: string | FontData
}

export function Title({ text, fonts, children }: ITitle) {

    return (
        <Center>
        <Text3D font={fonts || DEFAULT_FONT_URL}>
            {text && text.toUpperCase()}
            <meshNormalMaterial />
            {children}
            </Text3D> 
        </Center>
    )
}