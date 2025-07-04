import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const squareRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = -e.clientX / 90;
      const y = -e.clientY / 90;
      
      if (squareRef.current) {
        squareRef.current.style.right = `${x}px`;
        squareRef.current.style.bottom = `${y}px`;
      }
    };

    const handleDeviceOrientation = (e) => {
      if (squareRef.current) {
        squareRef.current.style.right = `${e.gamma / 3}px`;
        squareRef.current.style.bottom = `${e.beta / 3}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return (
    <div className="not-found-container">
      <div className="Square404" ref={squareRef}>
        <div className="Square">
          <h1>404</h1>
        </div>
      </div>

      <div className="error-content">
        <h4>Упс! Страница не найдена</h4>
        <p>Страница, которую вы ищете, не существует.</p>
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}