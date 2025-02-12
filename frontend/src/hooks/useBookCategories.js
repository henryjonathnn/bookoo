import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBookCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await bookService.getKategori();
        setCategories(response.categories);
        setTotalCategories(response.totalCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, totalCategories, loading, error };
};