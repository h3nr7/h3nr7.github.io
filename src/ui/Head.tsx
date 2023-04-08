import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";


const ALink = styled(Link)`
    text-decoration:none;
    color: inherit;
    /* :hover {
        text-decoration: underline
    } */

    ::before {
        content: " . ";
    }

    :first-child {
        ::before {
            content: none;
        }
    }

`;

const H5 = styled.h5`
    margin: 0;
    padding: 0;
    font-family: "rift-soft";
    text-transform: uppercase;
    font-weight: 300;
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
    const reducePaths = pathVars.reduce((prev, next, index) => {
        const len = prev.length
        if(len === 0) {
            prev.push({name: next, url: next})
        } else {
            prev.push({name: next, url: `${prev[index-1].url}/${next}`})
        }

        return prev
    }, [] as OutPaths[])

    // remove the first element
    reducePaths.shift()

    return (
        <HeadContainer>
            <H5>
                <ALink to='/'>h3nr7</ALink>
                {reducePaths.map(o => <ALink to={o.url}>{o.name}</ALink>)}
            </H5>
        </HeadContainer>
    )
}