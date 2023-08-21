import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Gamma } from './pages/Gamma';
import { Alpha } from './pages/Alpha/Alpha';
import { Beta } from './pages/Beta/Beta';
import { AppContainer } from './App.styles';
import { Head } from './ui/Head';

function App() {
  return (
    <AppContainer>
      <HashRouter>
        <Head />
        <Routes>
          <Route path="alpha" element={<Alpha />} />
          <Route path="beta" element={<Beta />} />
          <Route path='gamma' element={<Gamma />} />
        </Routes>
        {/* <Foot /> */}
      </HashRouter>
    </AppContainer>
  );
}

export default App;
