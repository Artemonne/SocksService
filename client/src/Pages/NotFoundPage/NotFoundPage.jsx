import React from 'react';
import { useNavigate } from 'react-router';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="error-container">
        <div className="error">404</div>
        <span className="info">Page not found
        <h2>Таня, Артём и Аза Легенды</h2></span>
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          На главную
        </button>
      </div>
      <img 
        src="http://images2.layoutsparks.com/1/160030/too-much-tv-static.gif" 
        className="static" 
        alt="TV static" 
      />
    </div>
  );
}