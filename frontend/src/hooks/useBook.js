import { bookService } from '../services/bookService';
import { useResource } from './useResource';

export const useBooks = (initialParams = { page: 1, limit: 10, search: '' }) => {
  return useResource(bookService.getBooks, initialParams);
};