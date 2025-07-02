import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BasketApi } from '../entities/basket/BasketApi';

export default function BasketPage({ userId }) {
  const [basketItems, setBasketItems] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      {!basketItems.items || basketItems.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          {basketItems.items.map((item) => (
            <div key={item.id}>
              <p>{item.name || item.code}</p>
              <p>Количество: {item.quantity}</p>
              <button
                onClick={() => handleUpdateQuantity(item.sockId, item.quantity + 1)}
              >
                +
              </button>
              <button
                onClick={() => handleUpdateQuantity(item.sockId, item.quantity - 1)}
                disabled={item.quantity <= 0}
              >
                -
              </button>
            </div>
          ))}
          <p>Сумма: {basketItems.total}</p>
        </>
      )}
    </div>
  );
}
