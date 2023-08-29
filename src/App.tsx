import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Gamma } from './pages/Gamma/Gamma';
import { Alpha } from './pages/Alpha/Alpha';
import { Beta } from './pages/Beta/Beta';
import { AppContainer } from './App.styles';
import { Head } from './ui/Head';
import { Home } from './pages/Home/Home';
import { Theta } from './pages/Theta/Theta';

export interface LinkArr {
  name: string
  link?: string
  element: JSX.Element
}

function App() {

  const links:LinkArr[] = [
    { name:'Alpha', link: 'alpha', element: <Alpha />},
    { name:'Beta', link: 'beta', element: <Beta />},
    { name:'Gamma', link: 'gamma', element: <Gamma />},
    { name:'Theta', link: 'theta', element: <Theta />},
  ]

  return (
    <AppContainer>
      <HashRouter>
        <Head />
        <Routes>
          <Route index element={<Home getLinks={() => links}/>} />
          {links.map(({ link, element }, i) => <Route key={i} index={!link} path={link} element={element}/>)}
        </Routes>
        {/* <Foot /> */}
      </HashRouter>
    </AppContainer>
  );
}

export default App;
