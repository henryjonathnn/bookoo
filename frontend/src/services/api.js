// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/users'; // ini port backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important untuk cookie
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tambah interceptor untuk token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.get('/token');
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
    try {
      const response = await api.post('/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.delete('/logout');
      return response;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await api.get('/token');
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api;