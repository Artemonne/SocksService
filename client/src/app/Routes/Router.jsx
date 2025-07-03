import { Routes, Route } from 'react-router';
import { useEffect, useState, React } from 'react';
import { UserApi } from '../../entities/user/UserApi.js';
import { setAccessToken } from '../../shared/lib/axiosInstance.js';
import Layout from '../Layout/Layout.jsx';
import BasketPage from '../../Pages/BasketPage';
import FavouritePage from '../../Pages/FavouritePage.jsx';
import AuthPage from '../../Pages/AuthPage/AuthPage.jsx';
import GenerateSocksPage from '../../Pages/GenerateSocksPage/GenerateSocksPage.jsx';
import MainPage from '../../Pages/MainPage.jsx';
import NotFoundPage from '../../Pages/NotFoundPage/NotFoundPage.jsx';

export default function Router() {
  const [user, setUser] = useState(null);
  // const [userMe, setUserMe] = useState(null)

  useEffect(() => {
    UserApi.refreshTokens().then((serverResponse) => {
      if (serverResponse.error) return;
      setUser(serverResponse.data.user);
      setAccessToken(serverResponse.data.accessToken);

      // const userM = UserApi.getMe();
      // setUserMe(userM)
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} setUser={setUser} />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />
        <Route
          path="/generateSocks"
          element={<GenerateSocksPage  />}
          
        />
      </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
