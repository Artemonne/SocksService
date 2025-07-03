import React, { useEffect, useState } from 'react';
import { FavouriteApi } from '../entities/favourite/FavouriteApi';
import { UserApi } from '../entities/user/UserApi';

export default function FavouritePage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFavourites() {
      const userM = await UserApi.getMe();
      setLoading(true);
      try {
        const response = await FavouriteApi.getFavourites(userM?.data.id);
        setFavourites(response.data || response);
      } catch (error) {
        console.error('Ошибка при загрузке избранного', error);
      } finally {
        setLoading(false);
      }
    }
    if (userM?.data.id) {
      fetchFavourites();
    }
  }, [userM.data.id]);

  const handleRemoveFavourite = async (sockId) => {
    try {
      await FavouriteApi.removeFavourite(userM.data.id, sockId);
      const updated = await FavouriteApi.getFavourites(userM.data.id);
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
                  {item.name || item.code || `Товар #${item.id}`}
                </div>
                <div>Цена: {item.price} ₽</div>
              </div>
              <div>
                <button onClick={() => handleRemoveFavourite(item.id)}>
                  Удалить из избранного
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
