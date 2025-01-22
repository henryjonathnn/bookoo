import { bookService } from '../services/bookService';
import { useResource } from './useResource';

export const useBooks = (initialParams = { page: 1, limit: 10, search: '' }) => {
  const {
    data: books,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    params,
    updateParams,
    refresh
  } = useResource(bookService.getBooks, initialParams);

  return {
    books,
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