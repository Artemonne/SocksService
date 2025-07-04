import {
  WhatsappShareButton,
  TelegramShareButton,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
//для получения и использования cartId из cookie (или localStorage)
// для анонимных пользователей.
import Cookies from 'js-cookie';
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
  const [shareableLink, setShareableLink] = useState('');

  // Получаем cartId из cookie (для анонимных)
  const cartId = Cookies.get('cartId');

  useEffect(() => {
    async function fetchBasket() {
      setLoading(true);
      try {
        let response;
        if (userId) {
          response = await BasketApi.getBasket(userId);
        } else {
          response = await BasketApi.getCart(); // корзина по cartId из cookie
        }
        setBasketItems({
        items: response.data?.items || response.data || [],
        total: response.data?.total || 0,
      });
      } catch (error) {
        console.error('Ошибка при загрузке корзины', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBasket();
  }, [userId]);

  const createShareableLink = async () => {
    try {
      const response = await axiosInstance.post('/basket/share', {
        items: basketItems.items,
      });
      console.log('Ответ сервера при создании ссылки:', response);

      if (!response || !response.data) {
        console.error('Некорректный ответ сервера');
        return;
      }

      const cartIds = response.data.cartIds; // теперь массив

      if (cartIds && cartIds.length > 0) {
        // Сериализуем массив cartIds в строку, например через encodeURIComponent и JSON.stringify
        const serializedIds = encodeURIComponent(JSON.stringify(cartIds));
        setShareableLink(`${window.location.origin}/cart-share?ids=${serializedIds}`);
      } else {
        console.error('cartIds отсутствуют в ответе');
      }
    } catch (error) {
      console.error('Ошибка при создании ссылки для шаринга', error);
    }
  };

  useEffect(() => {
    if (basketItems.items.length > 0) {
      createShareableLink();
    }
  }, [basketItems]);

  const handleUpdateQuantity = async (sockId, quantity) => {
  try {
    await BasketApi.updateQuantity(userId, sockId, quantity);
    const updated = userId ? await BasketApi.getBasket(userId) : await BasketApi.getCart();
    setBasketItems({
      items: updated.data?.items || updated.data || [],
      total: updated.data?.total || 0,
    });
  } catch (error) {
    console.error('Ошибка при обновлении количества', error);
  }
};

  const handleOrder = async () => {
    try {
      const orderData = {
        user: { id: userId, name: userName, email: userEmail }, // заполните актуальными данными
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

  if (loading) return <div>Загрузка корзины...</div>;

  console.log('shareableLink:', shareableLink);

  return (
    <div>
      {!basketItems.items || basketItems.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          {basketItems.items.map((item) => (
            <div
              key={item.id || item.sockId}
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '500px',
              }}
            >
              <div style={{ fontWeight: 500 }}>
                {(item.Sock && (
                  <img
                    src={item.Sock.genImage}
                    alt="sock"
                    style={{ width: 80, height: 80 }}
                  />
                )) ||
                  `Товар #${item.id}`}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginLeft: 16,
                }}
              >
                <div style={{ width: 100, display: 'flex', alignItems: 'center' }}>
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
                    width: 100,
                  }}
                >
                  <button
                    onClick={() => handleUpdateQuantity(item.sockId, item.quantity - 1)}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </button>
                  <p style={{ margin: 0 }}>{item.quantity}</p>
                  <button
                    onClick={() => handleUpdateQuantity(item.sockId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <p>Сумма: {basketItems.total}</p>

          {shareableLink && (
            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 20,
                border: '1px solid red',
                padding: 10,
                justifyContent: 'center',
              }}
            >
              <WhatsappShareButton url={shareableLink} title="Посмотри мою корзину!">
                <WhatsappIcon size={40} round alt="Поделиться в WhatsApp" />
              </WhatsappShareButton>
              <TelegramShareButton url={shareableLink} title="Посмотри мою корзину!">
                <TelegramIcon size={40} round alt="Поделиться в Telegram" />
              </TelegramShareButton>
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <p>Сумма: {basketItems.total} ₽</p>
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
