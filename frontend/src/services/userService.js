import api from "./api"

export const userService = {
    async getUsers(params) {
      try {
        const response = await api.get('/', { 
          params: {
            page: params.page,
            limit: params.limit,
            search: params.search
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  
    async getUserById(id) {
      try {
        const response = await api.get(`/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    }
  };