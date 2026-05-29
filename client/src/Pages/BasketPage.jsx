import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BasketApi } from '../entities/basket/BasketApi';
import { axiosInstance } from '../shared/lib/axiosInstance';
import './BasketPage.css';

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
        setBasketItems(response.data || response);
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

  const handleUpdateQuantity = async (sockId, quantity) => {
    try {
      await BasketApi.updateQuantity(userId, sockId, quantity);
      const updated = await BasketApi.getBasket(userId);
      setBasketItems(updated.data || updated);
    } catch (error) {
      console.error('Ошибка при обновлении количества', error);
    }
  };

  if (loading) return <div className="comic-text">Загрузка корзины...</div>;


  const handleOrder = async () => {
    try {
      const orderData = {
        user: { id: userId, name: userName, email: userEmail },
        items: basketItems.items,
        total: basketItems.total,
      };
      console.log(orderData, '***************');

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
        <p className="comic-text">Корзина пуста</p>
      ) : (
        <>
          {basketItems.items.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid black',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '500px',
              }}
            >
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
                        width: 200,
                        height: 200,
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    marginRight: '25px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    fontSize: '18px',
                  }}
                  className="comic-text"
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
                    gap: '5px',
                    padding: '8px 8px',
                    margin: '15px',
                    background: 'white',
                    border: '1px solid black',
                    borderRadius: 8,
                  }}
                >
                  <button
                    onClick={() => handleUpdateQuantity(item.sockId, item.quantity + 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.scale = '1.2')}
                    onMouseOut={(e) => (e.currentTarget.style.scale = '1')}
                  >
                    ➕
                  </button>
                  <p
                    className="comic-text"
                  >
                    {item.quantity}
                  </p>
                  <button
                    onClick={() => handleUpdateQuantity(item.sockId, item.quantity - 1)}
                    disabled={item.quantity <= 0}
                    style={{
                      background: 'none',
                      border: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.scale = '1.2')}
                    onMouseOut={(e) => (e.currentTarget.style.scale = '1')}
                  >
                    ➖
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
              marginBottom: '70px',
            }}
          >
            <p className="comic-text">Сумма: {basketItems.total}</p>
            <button className="checkout-button" onClick={handleOrder}>Оформить заказ</button>
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
                <button
                  className="checkout-button checkout-button--modal"
                  onClick={() => setModal({ ...modal, open: false })}
                >
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
