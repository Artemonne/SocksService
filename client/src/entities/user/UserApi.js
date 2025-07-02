import { axiosInstance } from '../../shared/lib/axiosInstance';

export class UserApi {
  static async refreshTokens() {
    const { data } = await axiosInstance.get('/auth/refreshTokens');
    return data;
  }

  static async signUp(userData) {
    const { data } = await axiosInstance.post('/auth/signUp', userData);
    return data;
  }

  static async signIn(userData) {
    const { data } = await axiosInstance.post('/auth/signIn', userData);
    return data;
  }

  static async signOut() {
    const { data } = await axiosInstance.get('/auth/signOut');
    return data;
  }
}
