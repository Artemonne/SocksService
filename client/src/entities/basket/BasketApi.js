import { axiosInstance } from '../../shared/lib/axiosInstance';

export class BasketApi {
  static async addToBasket(userId, sockId) {
    const payload = { userId, sockId };
    const { data } = await axiosInstance.post('/basket/', payload);
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
}
