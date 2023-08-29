import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";


const ALink = styled(Link)`
    text-decoration:none;
    color: inherit;
    /* :hover {
        text-decoration: underline
    } */

    &:before {
        content: " / ";
    }

    &:first-child {
        &:before {
            content: none;
        }
    }

`;

const H5 = styled.h5`
    margin: 0;
    padding: 0;
    font-family: "rift-soft";
    text-transform: uppercase;
    font-style: italic;
    font-weight: 400;
    font-size: 1.5rem;
`

const HeadContainer = styled.div`
    display: flex;
    flex-flow: row;
    height: auto;
    width: 100%;
    padding: 1rem 1rem 1rem 1.6rem;
`

interface OutPaths {
    name: string
    url: string
}

export function Head() {

    const location = useLocation();

    const pathVars = location.pathname.split('/')
    
    // there might be a better way of doing this...
    const reducePaths = pathVars.reduce((prev, next, index) => {
        const len = next.length
        if(index === 0) {
            prev.push({name: 'h3nr7.github.io', url: ''})
        } else if(len > 0) {
            console.log(index, prev, prev[index-1])
            const prevUrl = prev.length && index > 0 ? prev[index-1].url : '' 
            prev.push({name: next, url: `${prevUrl}/${next}`})
        } 
        
        return prev
    }, [] as OutPaths[])

    return (
        <HeadContainer>
            <H5>
                {reducePaths.map((o, i) => <ALink key={i} to={o.url}>{o.name}</ALink>)}
            </H5>
        </HeadContainer>
    )
}