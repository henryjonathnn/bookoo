import { useState, useEffect, useCallback } from 'react';
import { throttle, orderBy, memoize } from 'lodash';
import booksData from '../dump/books.json';
import { SORT_TYPES } from '../constant/index';

export const useBooks = (sortType = SORT_TYPES.TRENDING) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortBooks = useCallback(
    memoize((books, type) => {
      if (!Array.isArray(books)) return [];
      
      const sortConfig = type === SORT_TYPES.TRENDING 
        ? [book => Number(book.peminjam) || 0, 'desc']
        : [book => [Number(book.rating) || 0, book.title], ['desc', 'asc']];
      
      return orderBy(books, ...sortConfig);
    }),
    []
  );

  useEffect(() => {
    const loadBooks = throttle(async () => {
      try {
        setLoading(true);
        // Simulasi loading
        await new Promise(resolve => setTimeout(resolve, 500));
        const sortedBooks = sortBooks(booksData.books, sortType);
        setBooks(sortedBooks);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Failed to load books data');
      } finally {
        setLoading(false);
      }
    }, 1000);

    loadBooks();
    return () => loadBooks.cancel();
  }, [sortType, sortBooks]);

  return {
    books,
    loading,
    error
  };
};