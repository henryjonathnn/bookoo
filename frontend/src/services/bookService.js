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
  createBuku: async (bookData) => {
    try {
      const formData = new FormData();
      
      // Pastikan semua field yang wajib terisi
      const requiredFields = ['judul', 'penulis', 'kategori'];
      requiredFields.forEach(field => {
        if (!bookData[field]) {
          throw new Error(`${field} wajib diisi`);
        }
      });

      // Append semua field ke FormData
      Object.keys(bookData).forEach(key => {
        if (key === 'cover_img') {
          if (bookData[key] instanceof File) {
            formData.append('cover_img', bookData[key]);
          }
        } else if (bookData[key] !== null && bookData[key] !== undefined) {
          // Convert numbers to string untuk FormData
          formData.append(key, bookData[key].toString());
        }
      });

      const response = await api.post("/buku", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.msg);
      }

      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw new Error(handleApiError(error));
    }
  },
  updateBuku: async (id, bookData) => {
    try {
      const formData = new FormData();
      
      // Pastikan semua field yang wajib terisi
      const requiredFields = ['judul', 'penulis', 'kategori'];
      requiredFields.forEach(field => {
        if (!bookData[field]) {
          throw new Error(`${field} wajib diisi`);
        }
      });

      // Append semua field ke FormData
      Object.keys(bookData).forEach(key => {
        if (key === 'cover_img') {
          if (bookData[key] instanceof File) {
            formData.append('cover_img', bookData[key]);
          }
        } else if (bookData[key] !== null && bookData[key] !== undefined) {
          // Convert numbers to string untuk FormData
          formData.append(key, bookData[key].toString());
        }
      });

      const response = await api.patch(`/buku/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.msg);
      }

      return response.data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error(handleApiError(error));
    }
  },
  deleteBuku: createApiMethod((id) => api.delete(`/buku/${id}`)),
  getKategori: createApiMethod(() => api.get("/buku/kategori")),
};
