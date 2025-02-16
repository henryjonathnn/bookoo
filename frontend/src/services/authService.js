import api from './axios.instance';
import { handleApiError } from '../utils/api.utils';

export const authService = {
  async register(userData) {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  async login(credentials) {
    try {
      const response = await api.post("/users/login", credentials);
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout() {
    try {
      await api.delete("/users/logout");
    } finally {
      localStorage.removeItem('token');
    }
  },

  async refreshToken() {
    const response = await api.get("/users/token");
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async checkEmailAvailability(email) {
    try {
      const response = await api.get(
        `/users/validate/email/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      return { available: false, error: error.response?.data?.msg };
    }
  },

  async checkUsernameAvailability(username) {
    try {
      const response = await api.get(
        `/users/validate/username/${encodeURIComponent(username)}`
      );
      return response.data;
    } catch (error) {
      return { available: false, error: error.response?.data?.msg };
    }
  },
};