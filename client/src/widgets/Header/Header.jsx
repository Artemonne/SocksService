import { UserApi } from '../../entities/user/UserApi';
import { setAccessToken } from '../../shared/lib/axiosInstance';
import './Header.css';
import { NavLink } from 'react-router';
import { React } from 'react';
import logo from '../../../public/assets/Yuliana.jpg'
import thread from '../../../public/assets/Noto_Emoji_v2.034_1f9f6.svg.png'

export default function Header({ user, setUser }) {
  const signOutHandler = async () => {
    try {
      const { statusCode, error, message } = await UserApi.signOut();

      if (error || statusCode !== 200) {
        alert(message);
        return;
      }
      setUser(null);
      setAccessToken('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="header">
      <div className="header-left">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `header_link ${isActive ? 'header_link--active' : ''}`
          }
        >
          Главная
        </NavLink>
      </div>
      <img src={logo} className='logo' alt='Наикрасивейший логотип'></img>
      <div className="header-right">
        {!user ? (
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `header_link ${isActive ? 'header_link--active' : ''}`
            }
          >
            Аутентификация
          </NavLink>
        ) : (
          <div className='emoji'>
          <NavLink
              to="/generateSocks"
              className={({ isActive }) =>
                `header_link ${isActive ? 'header_link--active' : ''}`
              }
            >
              <img src={thread} className='thread' alt='a ball of thread'></img>
            </NavLink>
           <NavLink
              to="/favourites"
              className={({ isActive }) =>
                `header_link ${isActive ? 'header_link--active' : ''}`
              }
            >
              <span>❤️</span>
            </NavLink>
            <NavLink
              to="/basket"
              className={({ isActive }) =>
                `header_link ${isActive ? 'header_link--active' : ''}`
              }
            >
              <span>🛒</span>
            </NavLink>
            <button onClick={signOutHandler} className="logout-button">
              Выход
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
