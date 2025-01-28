import api from './axios.instance';
import { handleApiError } from '../utils/api.utils';

export const bukuService = {
    getBuku: async (params = {}) => {
        try {
            const response = await api.get("/buku", { params });
            return {
                data: response.data.books,
                totalItems: response.data.totalItems,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages
            };
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getBukuById: async (id) => {
        try {
            const response = await api.get(`/buku/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createBuku: async (formData) => {
        try {
            const response = await api.post("/buku", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateBuku: async (id, formData) => {
        try {
            const response = await api.patch(`/buku/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteBuku: async (id) => {
        try {
            const response = await api.delete(`/buku/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};