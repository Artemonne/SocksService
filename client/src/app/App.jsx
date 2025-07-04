import React from 'react';
import Router from './Routes/Router';
import { BrowserRouter } from 'react-router';
import AnimatedCursor from '../components/AnimatedCursor/AnimatedCursor';

function App() {
  return (
    <BrowserRouter>
    <AnimatedCursor /> {/* Добавляем курсор */}
      <Router />
    </BrowserRouter>
  );
}

export default App;
