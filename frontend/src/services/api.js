import axios from 'axios';

const API_URL = 'http://localhost:5000/users'; // ini port backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important untuk cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// error handling
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Logika retry for network errors
    if (!error.response && !originalRequest._retry && originalRequest._retryCount < RETRY_COUNT) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      await sleep(RETRY_DELAY * originalRequest._retryCount);
      return api(originalRequest);
    }
    
    // Logika token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get('/token');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// List API 
export const authService = {
  async register(userData) {
    return api.post('/register', userData);
  },

  async login(credentials) {
    return api.post('/login', credentials);
  },

  async logout() {
    return api.delete('/logout');
  },

  async refreshToken() {
    return api.get('/token');
  },

  async getProfile() {
    return api.get('/profile');
  }
};

export default api;