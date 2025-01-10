// Modified useBooks.js
import { useState, useEffect, useCallback } from 'react';

export const SORT_TYPES = {
  TRENDING: 'trending',
  FAVORITE: 'favorite'
};

export const useBooks = (sortType = SORT_TYPES.TRENDING) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortBooks = useCallback((books, type) => {
    if (!Array.isArray(books)) return [];
    
    return [...books].sort((a, b) => {
      // Ensure properties exist and are numbers
      const aPeminjam = Number(a.peminjam) || 0;
      const bPeminjam = Number(b.peminjam) || 0;
      const aRating = Number(a.rating) || 0;
      const bRating = Number(b.rating) || 0;

      if (type === SORT_TYPES.TRENDING) {
        // Primary sort by peminjam (descending)
        if (bPeminjam !== aPeminjam) {
          return bPeminjam - aPeminjam;
        }
        // Secondary sort by rating (descending)
        return bRating - aRating;
      } else if (type === SORT_TYPES.FAVORITE) {
        // Primary sort by rating (descending)
        if (bRating !== aRating) {
          return bRating - aRating;
        }
        // Secondary sort by peminjam (descending)
        return bPeminjam - aPeminjam;
      }
      return 0;
    });
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/books.json'); // Make sure path is correct
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        const sortedBooks = sortBooks(data.books || [], sortType);
        setBooks(sortedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [sortType, sortBooks]);

  return { 
    books, 
    loading, 
    error,
    sortBooks: useCallback((books) => sortBooks(books, sortType), [sortBooks, sortType])
  };
};