import api from './axios.instance';

export const notifikasiService = {
  getNotifikasi: async () => {
    const response = await api.get('/notifikasi');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifikasi/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifikasi/read-all');
    return response.data;
  }
}; 