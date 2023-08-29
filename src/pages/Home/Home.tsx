import { PropsWithChildren } from "react";
import { Content } from "../../ui/Content";
import { Card } from "../../ui/Card";
import { LinkArr } from "../../App";

interface HomeProps {
  getLinks: () => LinkArr[]
}

export function Home({ getLinks }:PropsWithChildren<HomeProps>) {

  const links = getLinks()

  return (
    <Content>
      {links.map(({ name, link }, i) => (
        <Card key={i} name={name} link={link || '/'}>
          hello
        </Card>
      ))}
    </Content>
  )
}

