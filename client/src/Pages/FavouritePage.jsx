import React, { useEffect, useState } from 'react';
import { FavouriteApi } from '../entities/favourite/FavouriteApi';
import { UserApi } from '../entities/user/UserApi';

export default function FavouritePage({ user }) {
  const userId = user?.id;
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const response = await FavouriteApi.getFavourites(userId);
        setFavourites(response.data || response);
      } catch (error) {
        console.error('Ошибка при загрузке избранного', error);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchFavourites();
    }
  }, [userId]);

  const handleRemoveFavourite = async (sockId) => {
    try {
      await FavouriteApi.removeFavourite(userId, sockId);
      const updated = await FavouriteApi.getFavourites(userId);
      setFavourites(updated.data || updated);
    } catch (error) {
      console.error('Ошибка при удалении из избранного', error);
    }
  };

  if (loading) return <div>Загрузка избранного...</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Избранное</h2>
      {!favourites || favourites.length === 0 ? (
        <p>Список избранного пуст</p>
      ) : (
        <>
          {favourites.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>
                  {item.Sock
                    ? `${item.Sock.color} / ${item.Sock.pattern} / ${item.Sock.image}`
                    : <img src={item.genImage}/> || `Товар #${item.id}`}
                </div>
                {item.Sock?.genImage && (
                  <img
                    src={item.Sock.genImage}
                    alt="sock"
                    style={{ width: 80, height: 100, margin: '8px 0' }}
                  />
                )}
                <div>Цена: {item.price} ₽</div>
              </div>
              <div>
                <button onClick={() => handleRemoveFavourite(item.id)}>
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
