import styled from "styled-components";
import * as contentful from 'contentful';
import { Link, Location, useLocation, useNavigate } from "react-router-dom";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import Logo from "../assets/h3nr7_logo_simple.svg?react";
import Prev from "../assets/noun-back-6654847.svg?react";
import Next from "../assets/noun-next-6654845.svg?react";
import { useContentStore } from "../stores/ContentStore";

const CONTENTFUL_SPACE = 'wjpxigc6xst0';
const CONTENTFUL_TOKEN = '5Ou1FusTuLU69nIP5r9I2judAKB0VASfO9plFWZhFBE';
const CONTENTFUL_ARTICLE_DEMO_ID = '1nacNkzMjM8qx78J1GYdb1';
const LOCALHOST_ORIGIN = 'http://localhost:3000'

interface INaviLink {
  isSameDomain: boolean
  url: Partial<Location>
  isCurrent: boolean
  title: string | null
  description: string | null
  order: number
  showInHome: boolean
}


/**
 * client
 */
const client = contentful.createClient({
  space: CONTENTFUL_SPACE,
  accessToken: CONTENTFUL_TOKEN
});

const H5 = styled.h5`
    min-width: 200px;
    margin: 0;
    padding: 0.35rem 2rem 0.35rem 1rem;
    flex: 1;
    font-family: "rift-soft";
    text-transform: uppercase;
    font-style: italic;
    font-weight: 400;
    font-size: 1.2rem;
`

const HeadContainer = styled.div`
    position: fixed;
    display: flex;
    align-items: stretch;
    min-width: 200px;
    height: 40px;
    width: auto;
    left: 20px;
    padding: 0;
    z-index: 999;
    background: black;
    color: white;
`

interface IHeadLink { disabled?: boolean };
const HeadLink = styled.a<IHeadLink>`
    border: none;
    margin: 0;
    padding: 0;
    display: flex;
    width: 41px;
    height: 40px;
    border-left: 1px solid white;
    cursor: pointer;
    background: black;
    transition: background-color .25s;
    

    svg {
        padding: 1rem;
        fill: white; 
        transition: fill .25s delay 0.1s;
    }

    &:hover {
        background: white;

        svg {
            fill: black;
        }
    }
`

export function Head() {

    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState<INaviLink[]>([]);
    const [cur, setCur] = useState<INaviLink>();
    const [next, setNext] = useState<INaviLink>();
    const [prev, setPrev] = useState<INaviLink>();  
    const location = useLocation();
    const navi = useNavigate();

    const content = useContentStore();

    useEffect(() => {
      (async () => {
        setLoading(true);
        try {
          
          setLinks(content.map(e => {

            const lUrl = new URL(e.fields.linkUrl as string);

            return {
              isSameDomain: lUrl.origin === window.location.origin,
              url: {
                pathname: lUrl.hash.replace('#/', '')
              },
              isCurrent: lUrl.hash === window.location.hash,
              title: String(e.fields.title),
              description: String(e.fields.description),
              order: Number(e.fields.rankOrder),
              showInHome: Boolean(e.fields.showInHome)  
            }
          }));
          setLoading(false);
        } catch(e) {
          setLoading(false);
        }
        })();
    }, [location.key, content]);

    useEffect(() => {
      const found = links.findIndex(l => l.isCurrent);
      const tot = links.length;

      if(found < 0) {
        setCur({
          isSameDomain: false,
          url: location,
          isCurrent: false,
          title: '',
          description: '',
          order: 0,
          showInHome: false
        });

        setPrev(undefined);
        setNext(undefined);
        return;
      } else if (tot === 1) {
        setCur(links[found]);
        setPrev(undefined);
        setNext(undefined);
        return;
      }

      setCur(links[found]);
      setNext(found < tot - 1 ? links[found + 1] : links[0]);
      setPrev(found > 0 ? links[found - 1] : links[tot - 1]);
      
    }, [links, location]);


    useEffect(() => {
      console.log(location, cur, prev, next);
    }, [cur, prev, next, location]);

    const handlePrev = useCallback(() => {
      next?.url?.pathname && navi(next?.url.pathname);
    }, [location, cur, prev, next]);

    const handleNext = useCallback(() => {
      prev?.url?.pathname && navi(prev?.url.pathname);
    }, [location, cur, prev, next]);


    return !loading && (
        <HeadContainer>
            <Logo />
            <H5>
                h3NR7 / {cur?.title}
                {/* {reducePaths.map((o, i) => <ALink key={i} to={o.url}>{o.name}</ALink>)} */}
            </H5>
            <HeadLink onClick={handlePrev}><Prev /></HeadLink>
            <HeadLink onClick={handleNext}><Next /></HeadLink>
        </HeadContainer>
    )
}