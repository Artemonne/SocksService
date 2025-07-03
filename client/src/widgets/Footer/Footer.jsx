import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left"></div>
      <div className="footer-center">Подвал</div>
      <div className="footer-right">
        <div className="footer-support">
          Почта службы поддержки<div>dubai@gmail.com</div>
        </div>
        <div className="footer-address">Адрес магазина: Dubai</div>
      </div>
    </footer>
  );
}
