import api from "./api";

export const userService = {
  async getUsers(params) {
    try {
      const response = await api.get("/users", {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search || "", 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error gagal fetch users:", error);
      if (error.response) {
        throw new Error(error.response.data.message || "Terjadi kesalahan server");
      } else if (error.request) {
        throw new Error("Tidak ada respon dari server");
      } else {
        throw new Error("Terjadi kesalahan saat menyiapkan request");
      }
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(error.response?.data?.message || "Error fetching user");
    }
  },
};
