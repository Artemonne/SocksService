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
      return { items: [], total: 0, error: error?.response?.data || error.message };
    }
  }
}
