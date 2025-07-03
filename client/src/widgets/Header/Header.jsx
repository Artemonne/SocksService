import { UserApi } from '../../entities/user/UserApi';
import { setAccessToken } from '../../shared/lib/axiosInstance';
import './Header.css';
import { NavLink } from 'react-router';
import { React } from 'react';

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
      <NavLink
        to="/"
        className={({ isActive }) =>
          `header_link ${isActive ? 'header_link--active' : ''}`
        }
      >
        Главная
      </NavLink>

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
        <button
          onClick={signOutHandler}
          className='logout-button'
        >
          Выход
        </button>
      )}
    </header>
  );
}
