import api from './axios.instance';

export const notifikasiService = {
  getNotifikasi: async () => {
    try {
      const response = await api.get('/notifikasi');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifikasi/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifikasi/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 