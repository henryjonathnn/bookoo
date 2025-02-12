import api from "./axios.instance";
import { handleApiError } from "../utils/api.utils";

const createApiMethod =
  (apiCall) =>
  async (...args) => {
    try {
      const response = await apiCall(...args);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

export const bookService = {
  getBuku: async (params = {}) => {
    try {
      const response = await api.get("/buku", { params: {
        ...params,
        kategori: params.kategori || undefined, 
      } 
    });
      return {
        data: response.data.books,
        count: response.data.totalItems,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getBukuById: createApiMethod(async (id) => api.get(`/buku/${id}`)),
  createBuku: createApiMethod((bookData) => api.post("/buku", bookData)),
  updateBuku: createApiMethod((id, bookData) =>
    api.patch(`/buku/${id}`, bookData)
  ),
  deleteBuku: createApiMethod((id) => api.delete(`/buku/${id}`)),
  getKategori: createApiMethod(() => api.get("/buku/kategori")),
};
