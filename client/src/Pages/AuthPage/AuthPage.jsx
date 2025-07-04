import './AuthPage.css';
import { React, useState } from 'react';
import SignUpForm from '../../features/auth/ui/SignUpForm/SignUpForm';
import SignInForm from '../../features/auth/ui/SignInForm/SignInForm';
import PropTypes from 'prop-types';

export default function AuthPage({ setUser }) {
  const [authMode, setAuthMode] = useState('signIn');

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-tabs'>
          <button
            className={`auth-tab ${authMode === 'signUp' ? 'active' : ''}`}
            onClick={() => setAuthMode('signUp')}
          >
            Регистрация
          </button>
          <button
            className={`auth-tab ${authMode === 'signIn' ? 'active' : ''}`}
            onClick={() => setAuthMode('signIn')}
          >
            Вход
          </button>
        </div>

        <div className='auth-form'>
          {authMode === 'signUp' ? (
            <SignUpForm setUser={setUser} />
          ) : (
            <SignInForm setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  setUser: PropTypes.func.isRequired,
};
