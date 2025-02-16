import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useDebounce } from './useDebounce';

export const useUsers = (params = {}) => {
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(params.search, 300);

  const queryKey = ['users', { ...params, search: debouncedSearch }];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => userService.getUsers({ ...params, search: debouncedSearch }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error
  };
};