import api from './axios.instance';
import { handleApiError } from '../utils/api.utils';

export const validationService = {
  async checkEmailAvailability(email) {
    try {
      const response = await api.get(`/users/validate/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      return { available: false, error: handleApiError(error) };
    }
  },

  async checkUsernameAvailability(username) {
    try {
      const response = await api.get(`/users/validate/username/${encodeURIComponent(username)}`);
      return response.data;
    } catch (error) {
      return { available: false, error: handleApiError(error) };
    }
  }
};