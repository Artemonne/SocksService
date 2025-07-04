import { axiosInstance } from '../../shared/lib/axiosInstance';

export class BasketApi {
  static async addToBasket(dataMe) {
    const { data } = await axiosInstance.post('/basket', dataMe);
    return data;
  }

  static async updateQuantity(userId, sockId, quantity) {
    const payload = { userId, sockId, quantity };
    const { data } = await axiosInstance.put('/basket/quantity', payload);
    return data;
  }

  static async getBasket(userId) {
    try {
      const response = await axiosInstance.get(`/basket/${userId}`);
      return response.data;
    } catch (error) {
      // Можно пробросить ошибку выше или вернуть дефолтное значение
      // throw error;
      return { items: [], total: 0, error: error?.response?.data || error.message };
    }
  }

  // --- Новые методы для работы с cartId (анонимные пользователи) ---

  // Добавить или обновить товар в корзине (авторизованный или анонимный)
  static async addOrUpdateCartItem(data) {
    // data: { sockId, quantity, price }
    const { data: res } = await axiosInstance.post('/basket/cart/item', data);
    return res;
  }

  // Получить корзину текущего пользователя или по cartId из cookie
  static async getCart() {
    try {
      const response = await axiosInstance.get('/basket/cart');
      return response.data;
    } catch (error) {
      return { items: [], total: 0, error: error?.response?.data || error.message };
    }
  }

  // Получить или создать cartId (устанавливается в cookie)
  static async initCartId() {
    try {
      const response = await axiosInstance.get('/basket/cart/init');
      return response.data.cartId;
    } catch (error) {
      console.error('Ошибка при инициализации cartId', error);
      return null;
    }
  }

  // --- Методы для шаринга корзины ---

  // Создать шаренную корзину, получить shareableCartId
  static async shareBasket(items) {
    // Отправляем только items, без userId
    const payload = { items };
    const { data } = await axiosInstance.post('/basket/share', payload);
    // data: { cartIds: [uuid1, uuid2, ...] }
    return data;
  }

  // Получить шаренную корзину по shareableCartId
  static async getSharedBasket(cartIds) {
    try {
      const { data } = await axiosInstance.post('/basket/share/get', { cartIds });
      return data; // { items: [...], total: number }
    } catch (error) {
      return { items: [], total: 0, error: error?.response?.data || error.message };
    }
  }
}
