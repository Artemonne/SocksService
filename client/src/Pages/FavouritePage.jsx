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
    <>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2>Избранное</h2>
      </div>

      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: 24,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'space-around',
        }}
      >
        {!favourites || favourites.length === 0 ? (
          <p>Список избранного пуст</p>
        ) : (
          <>
            {favourites.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid',
                  borderRadius: 8,
                  background: '#ffffff70',
                  padding: 16,
                  marginBottom: 14,
                  display: 'flex',
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {item.Sock
                      ? `${item.Sock.color} / ${item.Sock.pattern} / ${item.Sock.image}`
                      : <img src={item.genImage} /> || `Товар #${item.id}`}
                  </div>
                  {item.Sock?.genImage && (
                    <img
                      src={item.Sock.genImage}
                      alt="sock"
                      style={{ width: 80, height: 100, margin: '8px 0' }}
                    />
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      fontFamily: "'Comic Sans MS', cursive",
                      fontSize: '18px',
                      position: 'absolute',
                      left: '120px',
                      bottom: '20px'
                    }}
                  >
                    Цена: {item.price} ₽
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveFavourite(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.5em',
                      padding: 0,
                      transition: 'filter 0.2s',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.filter = 'brightness(1000%) saturate(0%)')
                    }
                    onMouseOut={(e) => (e.currentTarget.style.filter = '')}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
