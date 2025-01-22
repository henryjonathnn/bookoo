import { userService } from '../services/userService';
import { useResource } from './useResource';

export const useUsers = (initialParams = { page: 1, limit: 10, search: '' }) => {
  const {
    data: users,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    params,
    updateParams,
    refresh
  } = useResource(userService.getUsers, initialParams);

  return {
    users,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    params,
    updateParams,
    refresh
  };
};