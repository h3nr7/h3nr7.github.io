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
  descriptions?: string
  link?: string
  element: JSX.Element
  src?: string
}

function App() {

  const links:LinkArr[] = [
    { 
      name:'Miniworld Mallorca', 
      descriptions: 'A journey to the mini world of Mallorca',
      link: 'miniworld-mallorca', 
      src: '/alpha.jpg', 
      element: <Alpha />
    },
    { 
      name:'Play with physics - Basic', 
      link: 'physics-basic', 
      element: <Beta />
    },
    { 
      name:'R3F Boids', 
      link: 'r3f-boids', 
      element: <Gamma />
    },
    { 
      name:'GLTF Viewer', 
      link: 'gltf-viewer', 
      element: <Theta />
    },
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
