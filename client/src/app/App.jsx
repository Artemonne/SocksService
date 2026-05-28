import React from 'react';
import Router from './Routes/Router';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
