import { CSSProperties, PropsWithChildren } from "react";
import { Content } from "../../ui/Content";
import { Card } from "../../ui/Card";
import { LinkArr } from "../../App";

interface HomeProps {
  getLinks: () => LinkArr[]
}

export function Home({ getLinks }:PropsWithChildren<HomeProps>) {

  const links = getLinks()

  const styles:CSSProperties = {
    background: ''
  }

  return (
    <Content>
      {links.map(({ name, descriptions, link, src }, i) => (
        <Card key={i} name={name} descriptions={descriptions} link={link || '/'} styles={{ backgroundImage: `url(${src})` }} />
      ))}
    </Content>
  )
}