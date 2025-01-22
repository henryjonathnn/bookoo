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
    if (!user) {
      setError('Unauthorized access');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear errors
      const data = await userService.getUsers(params);
      
      if (data && data.users) {
        setUsers(data.users);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Gagal fetch users');
      toast.error('Gagal fetch users');
      setUsers([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [params, user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

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