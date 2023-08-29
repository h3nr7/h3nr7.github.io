import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Gamma } from './pages/Gamma/Gamma';
import { Alpha } from './pages/Alpha/Alpha';
import { Beta } from './pages/Beta/Beta';
import { AppContainer } from './App.styles';
import { Head } from './ui/Head';
import { Home } from './pages/Home/Home';
import { Theta } from './pages/Theta/Theta';

function App() {
  return (
    <AppContainer>
      <HashRouter>
        <Head />
        <Routes>
          <Route index element={<Home />} />
          <Route path="alpha" element={<Alpha />} />
          <Route path="beta" element={<Beta />} />
          <Route path='gamma' element={<Gamma />} />
          <Route path='theta' element={<Theta />} />
        </Routes>
        {/* <Foot /> */}
      </HashRouter>
    </AppContainer>
  );
}

export default App;
