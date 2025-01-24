import api from './axios.instance';

export const authService = {
  async register(userData) {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/users/login", credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  async logout() {
    await api.delete("/users/logout");
    localStorage.removeItem('accessToken');
  },

  async refreshToken() {
    const response = await api.get("/users/token");
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