import axios from "axios";

const API_URL = "http://localhost:5000/users"; // Ini URL API backend

// State untuk tracking status auth
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika refresh dalam proses, tambahkan req ke antrian
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.get("/token");
        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth state
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export const authService = {
  async register(userData) {
    return api.post("/register", userData);
  },

// Di authService.login di api.js
async login(credentials) {
  try {
    const response = await api.post("/login", credentials);
    // Simpan token ke localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response;
  } catch (error) {
    throw error;
  }
},

  async logout() {
    return api.delete("/logout");
  },

  async refreshToken() {
    return api.get("/token");
  },

  async getProfile() {
    return api.get("/profile");
  },
};

export const validationService = {
  async checkEmailAvailability(email) {
    try {
      const response = await api.get(
        `/validate/email/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      return { available: false, error: error.response?.data?.msg };
    }
  },

  async checkUsernameAvailability(username) {
    try {
      const response = await api.get(
        `/validate/username/${encodeURIComponent(username)}`
      );
      return response.data;
    } catch (error) {
      return { available: false, error: error.response?.data?.msg };
    }
  },
};

export default api;
