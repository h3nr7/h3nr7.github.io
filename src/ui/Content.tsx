import styled from "styled-components"
import { PropsWithChildren } from 'react'
import { device } from "../App.styles"

interface ContentProps {}

export function Content({ children }: PropsWithChildren<ContentProps>) {

  return (
    <Container>
      {children}
    </Container>
  )
}

const Container = styled.div`
    display: inline-grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    align-items: flex-start;
    padding: 0 25px;
    flex-wrap: wrap; 
    overflow: auto;

    @media ${device.sm} {
      grid-template-columns: repeat(1, 1fr);

    }
`