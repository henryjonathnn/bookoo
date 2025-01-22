import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useResource = (fetchFunction, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  
    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFunction(params);
        
        setData(response.data || []);
        setTotalItems(response.count || 0);
        setTotalPages(response.totalPages || Math.ceil((response.count || 0) / (params.limit || 10)));
        setCurrentPage(response.currentPage || params.page);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }, [fetchFunction, params]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    const updateParams = useCallback((newParams) => {
      setParams(prev => ({ ...prev, ...newParams }));
    }, []);
  
    return {
      data,
      loading,
      error,
      totalItems,
      totalPages,
      currentPage,
      params,
      updateParams,
      refresh: fetchData
    };
  };