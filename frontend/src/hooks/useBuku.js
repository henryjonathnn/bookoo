import { useCallback } from 'react';
import { bukuService } from '../services/bukuService';
import { useResource } from './useResource';

export const useBuku = (initialParams = { page: 1, limit: 10, search: '' }) => {
  const {
    data: buku,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    params,
    updateParams,
    refresh,
    setData
  } = useResource(bukuService.getBuku, initialParams);

  const handleCreate = useCallback(async (formData) => {
    try {
      const result = await bukuService.createBuku(formData);
      await refresh();
      return result;
    } catch (error) {
      throw error;
    }
  }, [refresh]);

  const handleUpdate = useCallback(async (id, formData) => {
    try {
      const result = await bukuService.updateBuku(id, formData);
      await refresh();
      return result;
    } catch (error) {
      throw error;
    }
  }, [refresh]);

  const handleDelete = useCallback(async (id) => {
    try {
      await bukuService.deleteBuku(id);
      await refresh();
    } catch (error) {
      throw error;
    }
  }, [refresh]);

  const handleSearch = useCallback((searchValue) => {
    updateParams({ search: searchValue, page: 1 });
  }, [updateParams]);

  const handlePageChange = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);


  return {
    buku,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    params,
    updateParams,
    refresh,
    setData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch,
    handlePageChange
  };
}; 