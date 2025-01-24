import api from "./axios.instance";
import { handleApiError } from "../utils/api.utils";

export const userService = {
  async getUsers(params = {}) {
    try {
      const response = await api.get("/users", { params });
      return {
        data: response.data.users,
        count: response.data.totalItems,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error(handleApiError(error));
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
