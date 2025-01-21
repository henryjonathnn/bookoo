import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useUsers = (initialParams = { page: 1, limit: 10, search: '' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getUsers(params);
      setUsers(data.users);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [params, user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    users,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: params.page,
    params,
    updateParams,
    refresh: fetchUsers
  };
};