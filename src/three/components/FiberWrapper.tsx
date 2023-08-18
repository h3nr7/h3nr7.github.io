import THREE from 'three';
import { Camera, Canvas, Object3DNode } from "@react-three/fiber";
import { PropsWithChildren } from "react";
import styled from "styled-components";

interface FiberWrapperProps {
    shadow?: boolean
    camera?: (Camera | Partial<Object3DNode<THREE.Camera, typeof THREE.Camera> & Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> & Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>>) & {
        manual?: boolean;
    }
}

export function FiberWrapper({
    children,
    shadow,
    camera
}: PropsWithChildren<FiberWrapperProps>) {

    return(
        <Container>
            <Canvas 
                camera={camera}
                shadows={shadow}>
                {children}
            </Canvas>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex: 1;
`