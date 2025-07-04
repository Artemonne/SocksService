import React from 'react';
import { useNavigate } from 'react-router';
import { UserApi } from '../entities/user/UserApi';

export default function MainPage() {
  const navigate = useNavigate();

  const handlerGenerate = async () => {
    try {
      const response = await UserApi.getMe();
      
      if (response.data && response.data.data) {
        navigate('/generateSocks');
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      navigate('/auth');
    }
  };

  return (
    <>
      <div className="main-description-frame">
        <h3>
          Добро пожаловать в мир ярких носков! Создайте свою уникальную пару — выберите
          цвет, узор и добавьте весёлые наклейки. Вдохновляйтесь, экспериментируйте и носите
          то, что отражает ваш стиль!
        </h3>
      </div>
      <button className="main-generate-btn" onClick={handlerGenerate}>
        Связать свои носки
      </button>
    </>
  );
}