import api from "./axios.instance";
import { handleApiError } from "../utils/api.utils";

const createApiMethod = (apiCall) => async (...args) => {
  try {
    const response = await apiCall(...args);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const userService = {
  getUsers: async (params = {}) => {
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

  getUserById: createApiMethod(async (id) => api.get(`/users/${id}`)),
  createUser: createApiMethod((userData) => api.post("/users", userData)),
  updateUser: createApiMethod((id, userData) => api.patch(`/users/${id}`, userData)),
  deleteUser: createApiMethod((id) => api.delete(`/users/${id}`)),
};