import { axiosInstance } from '../shared/lib/axiosInstance';

export class GenerateSocksApi {
  static async getOptions() {
    const { data } = await axiosInstance.get('/socks/options');
    return data;
  }

  static async saveDesign({ color, pattern, image, genImage }) {
    const { data } = await axiosInstance.post('/socks/', {
      color,
      pattern,
      image,
      genImage
    });
    return data;
  }
}