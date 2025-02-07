import { useState, useCallback, useEffect } from "react";
import { userService } from "../services/userService";
import { useDebounce } from "./useDebounce";


export const useUsers = (initialParams = {}) => {
  const [data, setData] = useState({
    users: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    active: '',
    ...initialParams
  });

  const debouncedSearch = useDebounce(params.search, 500);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...params,
        search: debouncedSearch,
        role: params.role === "ALL" ? "" : params.role,
      }
      const result = await userService.getUsers(queryParams)
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return {
    ...data,
    loading,
    error,
    params,
    updateParams,
    refresh: fetchUsers,
  };
};