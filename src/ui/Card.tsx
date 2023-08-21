import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface CardProps {
  link: string
  name: string
}

export function Card({ children, name, link }: PropsWithChildren<CardProps>) {

  

  return (
    <Container>
      {children}
      <Link to={link}>{name}</Link>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex: 3;
    padding: 0 25px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    flex-basis: 33.33333%;
    box-sizing: content-box;
    min-height: 200px;
    border-radius: 3px;
    /* flex: 3; */
    &:nth-child(3n) {
      margin: 0px;
    }

`