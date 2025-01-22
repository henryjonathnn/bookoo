import api from './axios.instance';
import { handleApiError } from '../utils/api.utils';

export const bookService = {
  async getBooks(params = {}) {
    try {
      const response = await api.get("/buku", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createBook(bookData) {
    try {
      const response = await api.post("/buku", bookData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateBook(id, bookData) {
    try {
      const response = await api.patch(`/buku/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteBook(id) {
    try {
      const response = await api.delete(`/buku/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};