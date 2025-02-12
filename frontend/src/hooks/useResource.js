import { useState, useEffect, useCallback } from 'react';

export const useResource = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  // Pagination and metadata states
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        ...params,
        page: currentPage
      };

      // Fetch data using the provided service method
      const result = await fetchFunction(queryParams);

      
      setData(result.data || []);
      setTotalItems(result.count || 0);
      setTotalPages(result.totalPages || 0);
      setCurrentPage(result.currentPage || 1);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  // Initial fetch and refetch when params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Method to update parameters
  const updateParams = useCallback((newParams) => {
    if (typeof newParams === 'function') {
      setParams(prev => ({
        ...prev,
        ...newParams(prev)
      }));
    } else {
      setParams(prev => ({
        ...prev,
        ...newParams
      }));
    }
  }, []);

  // Refresh method to re-fetch current data
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
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