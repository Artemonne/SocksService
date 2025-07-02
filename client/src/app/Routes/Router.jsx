import { Routes, Route } from 'react-router';
import Layout from '../Layout/Layout.jsx';
import BasketPage from '../../Pages/BasketPage';
import FavouritePage from '../../Pages/FavouritePage.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/favourites" element={<FavouritePage />} />
      </Route>
    </Routes>
  );
}
