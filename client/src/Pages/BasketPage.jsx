import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BasketApi } from '../entities/basket/BasketApi';
import { axiosInstance } from '../shared/lib/axiosInstance';

export default function BasketPage({ user }) {
  const userId = user?.id;
  const userName = user?.name;
  const userEmail = user?.email;

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

  // const handleAddToBasket = async (sockId) => {
  //   try {
  //     await BasketApi.addToBasket(userId, sockId);
  //     // Обновить корзину
  //     const updated = await BasketApi.getBasket(userId);
  //     setBasketItems(updated.data || updated);
  //   } catch (error) {
  //     console.error('Ошибка при добавлении в корзину', error);
  //   }
  // };

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
        user: { id: userId, name: userName, email: userEmail }, // заполните актуальными данными
        items: basketItems.items,
        total: basketItems.total,
      };
      console.log(orderData, '***************')
     
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
            <div
              key={item.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,

                alignItems: 'center',
                justifyContent: 'space-between',
                width: '500px',
              }}
            >
              <div style={{ fontWeight: 500 }}>
                {(item.Sock && <img src={item.genImage} />) || `Товар #${item.id}`}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  {item.Sock?.genImage && (
                    <img
                      src={item.Sock.genImage}
                      alt="sock"
                      style={{
                        width: 80,
                        height: 80,
                        margin: '8px 0',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    margin: '8px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  Цена: {item.price} ₽
                </div>
                <div
                  style={{
                    height: '30px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
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
                </div>
              </div>
            </div>
          ))}
          <div
            style={{
              height: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <p>Сумма: {basketItems.total}</p>
            <button onClick={handleOrder}>Оформить заказ</button>
          </div>
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
