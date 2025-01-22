import api from './axios.instance';
import { handleApiError } from '../../utils/api.utils';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async login(credentials) {
    try {
      const response = await api.post("/users/login", credentials);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout() {
    try {
      await api.delete("/users/logout");
      localStorage.removeItem('accessToken');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async refreshToken() {
    try {
      const response = await api.get("/users/token");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};