import { CSSProperties, PropsWithChildren } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { device } from '../App.styles'

interface CardProps {
  link: string
  name: string
  descriptions?: string
  styles?: CSSProperties
}

export function Card({ children, name, descriptions, link, styles }: PropsWithChildren<CardProps>) {

  const navigate = useNavigate()

  return (
    <Container style={styles} onClick={() => navigate(link)}>
      {children}
      <Title>
        <a className='text'>{descriptions || name}</a>
      </Title>
    </Container>
  )
}

const Container = styled.div`
    position: relative;
    display: flex;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    /* flex: 3; */
    padding: 0 25px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    /* flex-basis: 33.33333%; */
    box-sizing: content-box;
    min-height: 200px;
    border-radius: 3px;
    cursor: default;

    &:hover {
      cursor: pointer;
    }
    /* flex: 3; */
    &:nth-child(3n) {
      margin: 0px;
    }
`

const Title = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0);
  transition: background-color 0.25s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  a.text {
    text-align: center;
    font-family: rift-soft, san-serif;
    font-weight: 500;
    font-size: 18px;
    text-decoration: none;
    color: black;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
    transition-delay: 0.2s;
  }

  &:hover {
    background: rgba(245, 250, 250, 0.75);

    a.text {
      opacity: 1;
    }
  }
`

