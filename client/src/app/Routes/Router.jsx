import { Routes, Route } from 'react-router';
import Layout from '../Layout/Layout.jsx';
import BasketPage from '../../Pages/BasketPage';
import FavouritePage from '../../Pages/FavouritePage.jsx';
import GenerateSocksPage from '../../Pages/GenerateSocksPage/GenerateSocksPage.jsx';
import React from 'react';
import MainPage from '../../Pages/MainPage.jsx';


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/generateSocks" element={<GenerateSocksPage/>} />

      </Route>
    </Routes>
  );
}
