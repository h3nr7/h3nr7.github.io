import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, HashRouter, Link } from 'react-router-dom';
import { Gamma } from './pages/Gamma';
import { Alpha } from './pages/Alpha/Alpha';
import { Beta } from './pages/Beta';
import { AppContainer } from './App.styles';
import { Head } from './ui/Head';
import { Foot } from './ui/Foot';

function App() {
  return (
    <AppContainer>
      <HashRouter>
        <Link to='alpha'>afaf</Link>
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
