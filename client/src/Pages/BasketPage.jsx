import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BasketApi } from '../entities/basket/BasketApi';
import { axiosInstance } from '../shared/lib/axiosInstance';

export default function BasketPage({ userId }) {
  const [basketItems, setBasketItems] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, message: '', success: false });

  useEffect(() => {
    async function fetchBasket() {
      setLoading(true);
      try {
        const response = await BasketApi.getBasket(userId);
        setBasketItems(response.data || response); // теперь basketItems — объект { items, total }
      } catch (error) {
        console.error('Ошибка при загрузке корзины', error);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchBasket();
    }
  }, [userId]);

  const handleAddToBasket = async (sockId) => {
    try {
      await BasketApi.addToBasket(userId, sockId);
      // Обновить корзину
      const updated = await BasketApi.getBasket(userId);
      setBasketItems(updated.data || updated);
    } catch (error) {
      console.error('Ошибка при добавлении в корзину', error);
    }
  };

  const handleUpdateQuantity = async (sockId, quantity) => {
    try {
      await BasketApi.updateQuantity(userId, sockId, quantity);
      const updated = await BasketApi.getBasket(userId);
      setBasketItems(updated.data || updated);
    } catch (error) {
      console.error('Ошибка при обновлении количества', error);
    }
  };

  if (loading) return <div>Загрузка корзины...</div>;

  //? продолжить
  const handleOrder = async () => {
    try {
      const orderData = {
        user: { id: userId, name: 'Имя', email: 'email' }, // заполните актуальными данными
        items: basketItems.items,
        total: basketItems.total,
      };
      await axiosInstance.post('/order', orderData);
      setModal({ open: true, message: 'Заказ успешно отправлен!', success: true });
    } catch (error) {
      console.log(error);

      setModal({ open: true, message: 'Ошибка при отправке заказа', success: false });
    }
  };

  return (
    <div>
      {!basketItems.items || basketItems.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          {basketItems.items.map((item) => (
            <div key={item.id}>
              <p>{item.name || item.code}</p>

              <button
                onClick={() => handleUpdateQuantity(item.sockId, item.quantity + 1)}
              >
                +
              </button>
              <p>{item.quantity}</p>
              <button
                onClick={() => handleUpdateQuantity(item.sockId, item.quantity - 1)}
                disabled={item.quantity <= 0}
              >
                -
              </button>
              <p>Сумма: {basketItems.total}</p>
            </div>
          ))}
          <p>Сумма: {basketItems.total}</p>
          <button onClick={handleOrder}>Оформить заказ</button>
          {modal.open && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: 32,
                  borderRadius: 8,
                  minWidth: 300,
                  textAlign: 'center',
                }}
              >
                <h3>{modal.success ? 'Успех' : 'Ошибка'}</h3>
                <p>{modal.message}</p>
                <button onClick={() => setModal({ ...modal, open: false })}>
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
