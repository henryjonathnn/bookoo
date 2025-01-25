import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const axiosInstance = axios.create(API_CONFIG);

let refreshTokenPromise = null;

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = axiosInstance.get("/users/token")
          .then(({ data }) => {
            const { accessToken } = data;
            localStorage.setItem('accessToken', accessToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return accessToken;
          })
          .catch(() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return null;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      try {
        const token = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;