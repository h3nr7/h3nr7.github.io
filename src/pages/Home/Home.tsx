import { PropsWithChildren } from "react";
import { Content } from "../../ui/Content";
import { Card } from "../../ui/Card";

interface HomeProps {

}

export function Home({}:PropsWithChildren<HomeProps>) {

  return (
    <Content>
      <Card name='Alpha'  link='alpha'>
        hello
      </Card>
      <Card name='Beta' link='beta'>
        hello
      </Card>
      <Card name='Theta' link='theta'>
        hello
      </Card>
      <Card name='Gamma' link='gamma'>
        hello
      </Card>
      <Card name='Zeta' link='zeta'>
        hello
      </Card>
    </Content>
  )
}

