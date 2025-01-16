// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // ini port backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Tambah interceptor untuk token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get('/users/token');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.delete('/users/logout');
    return response.data;
  },

  async refreshToken() {
    const response = await api.get('/users/token');
    return response.data;
  }
};

export default api;