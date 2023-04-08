import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Gamma } from './pages/Gamma';
import { Alpha } from './pages/Alpha/Alpha';
import { Beta } from './pages/Beta';
import { AppContainer } from './App.styles';
import { Head } from './ui/Head';
import { Foot } from './ui/Foot';

function App() {
  return (
    <AppContainer>
      <Head />
      <BrowserRouter>
        <Routes>
          <Route path="alpha" element={<Alpha />} />
          <Route path="beta" element={<Beta />} />
          <Route path='gamma' element={<Gamma />} />
        </Routes>
      </BrowserRouter>
      {/* <Foot /> */}
    </AppContainer>
  );
}

export default App;
