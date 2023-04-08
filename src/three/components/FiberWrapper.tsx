import { Canvas } from "@react-three/fiber";
import { PropsWithChildren } from "react";
import styled from "styled-components";


export function FiberWrapper({
    children
}: PropsWithChildren) {

    return(
        <Container>
            <Canvas>
                {children}
            </Canvas>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex: 1;
`