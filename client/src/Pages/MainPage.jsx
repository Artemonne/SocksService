import React from 'react';
import { useNavigate } from 'react-router';

export default function MainPage() {
  const navigate = useNavigate();

  const handlerGenerate = () => {
    navigate('/generateSocks')
  }
  return (
    <>
      <h3>
        Добро пожаловать в мир ярких носков! Создайте свою уникальную пару — выберите
        цвет, узор и добавьте весёлые наклейки. Вдохновляйтесь, экспериментируйте и носите
        то, что отражает ваш стиль!
      </h3>
      <button onClick={handlerGenerate}>Связать свои носки</button>
    </>
  );
}
