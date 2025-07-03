import { Routes, Route, useLocation } from 'react-router';
import { useEffect, useState, React } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UserApi } from '../../entities/user/UserApi.js';
import { setAccessToken } from '../../shared/lib/axiosInstance.js';
import Layout from '../Layout/Layout.jsx';
import BasketPage from '../../Pages/BasketPage';
import FavouritePage from '../../Pages/FavouritePage.jsx';
import AuthPage from '../../Pages/AuthPage/AuthPage.jsx';
import GenerateSocksPage from '../../Pages/GenerateSocksPage/GenerateSocksPage.jsx';
import MainPage from '../../Pages/MainPage.jsx';
import NotFoundPage from '../../Pages/NotFoundPage/NotFoundPage.jsx';
import  {PageTransition}  from '../../widgets/PageTransition.jsx';

export default function Router() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    UserApi.refreshTokens().then((serverResponse) => {
      if (serverResponse.error) return;
      setUser(serverResponse.data.user);
      setAccessToken(serverResponse.data.accessToken);
    });
  }, []);

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route 
            path="/" 
            element={
              <PageTransition>
                <MainPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/basket" 
            element={
              <PageTransition>
                <BasketPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/favourites" 
            element={
              <PageTransition>
                <FavouritePage />
              </PageTransition>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PageTransition>
                <AuthPage setUser={setUser} />
              </PageTransition>
            } 
          />
          <Route
            path="/generateSocks"
            element={
              <PageTransition>
                <GenerateSocksPage />
              </PageTransition>
            }
          />
        </Route>
        <Route 
          path="*" 
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}