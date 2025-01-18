import axios from "axios";

const API_URL = "http://localhost:5000/users"; // Ini URL API backend

// State untuk tracking status auth
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
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

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors dengan retry
    if (
      !error.response &&
      !originalRequest._retry &&
      originalRequest._retryCount < RETRY_COUNT
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      await sleep(RETRY_DELAY * originalRequest._retryCount);
      return api(originalRequest);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Jika request bukan ke endpoint /token dan belum pernah di-retry
      if (!originalRequest._retry && !originalRequest.url.includes("/token")) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            await api.get("/token");
            isRefreshing = false;
            processQueue(null);
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);
            // Redirect ke halaman login atau dispatch logout action
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          // Jika sedang refresh token, queue request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    return api.post("/register", userData);
  },

  async login(credentials) {
    return api.post("/login", credentials);
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
