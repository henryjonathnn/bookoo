import api from "./axios.instance";

export const peminjamanService = {
  async createPeminjaman(peminjamanData) {
    const response = await api.post("/peminjaman", peminjamanData);
    return response.data;
  },

  async getPeminjaman(id) {
    const response = await api.get(`/peminjaman/${id}`);
    return response.data;
  },

  async getUserPeminjaman() {
    const response = await api.get("/peminjaman/history");
    return response.data;
  },

  async updatePeminjaman(id, updateData) {
    const response = await api.put(`/peminjaman/${id}`, updateData);
    return response.data;
  },

  getAllPeminjaman: async (params = {}) => {
    const { page = 1, limit = 10, status, search } = params;
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
      ...(search && { search }),
    });
    const response = await api.get(`/peminjaman?${queryParams}`);
    return response.data;
  },

  async updateStatus(id, status, alasanPenolakan = null) {
    const data = { status };
    if (alasanPenolakan) {
      data.alasan_penolakan = alasanPenolakan;
    }
    if (status === 'DIKIRIM') {
      data.tgl_pinjam_aktual = new Date().toISOString();
    }
    const response = await api.put(`/peminjaman/${id}/status`, data);
    return response.data;
  },
};
