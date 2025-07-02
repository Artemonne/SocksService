import { axiosInstance } from '../../shared/lib/axiosInstance';

export class FavouriteApi {
  static async addFavourite(userId, sockId) {
    const payload = { userId };
    const { data } = await axiosInstance.post(`/favourite/${sockId}`, payload);
    return data;
  }

  static async removeFavourite(userId, sockId) {
    const payload = { userId };
    try {
      const response = await axiosInstance.delete(`/favourite/${sockId}`, { data: payload });
      return response.data;
    } catch (error) {
      return { error: error?.response?.data || error.message };
    }
  }

  static async getFavourites(userId) {
    try {
      const response = await axiosInstance.get(`/favourite/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      
      return [];
    }
  }
}
