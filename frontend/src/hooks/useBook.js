import { useState, useEffect, useCallback } from 'react';

// Sample data import
import booksData from '../dump/books.json';

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
      if (type === SORT_TYPES.TRENDING) {
        const aPeminjam = Number(a.peminjam) || 0;
        const bPeminjam = Number(b.peminjam) || 0;
        return bPeminjam - aPeminjam;
      } else {
        const aRating = Number(a.rating) || 0;
        const bRating = Number(b.rating) || 0;
        
        if (bRating !== aRating) {
          return bRating - aRating;
        }
        // If ratings are equal, sort by title
        return a.title.localeCompare(b.title);
      }
    });
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const sortedBooks = sortBooks(booksData.books, sortType);
        setBooks(sortedBooks);
        setLoading(false);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Failed to load books data');
        setLoading(false);
      }
    };

    loadBooks();
  }, [sortType, sortBooks]);

  return {
    books,
    loading,
    error,
    sortBooks: useCallback((books) => sortBooks(books, sortType), [sortBooks, sortType])
  };
};