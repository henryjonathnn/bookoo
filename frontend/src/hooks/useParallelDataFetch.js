import { useState, useEffect } from 'react';
import { peminjamanService } from "../services/peminjamanService";
import { bookService } from "../services/bookService";
import { userService } from "../services/userService";

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

const useCache = (key, data) => {
  if (!cache.has(key) || Date.now() - cache.get(key).timestamp > CACHE_DURATION) {
    cache.set(key, { data, timestamp: Date.now() });
  }
  return cache.get(key).data;
};

export const useParallelDataFetch = () => {
  const [data, setData] = useState({
    books: [],
    users: [],
    totalCategories: 0,
    peminjamanData: [],
    totalPeminjaman: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const booksResponse = await bookService.getBuku({ limit: 1000 });
      const usersResponse = await userService.getUsers({ limit: 1000 });
      const categoriesResponse = await bookService.getKategori();
      const peminjamanResponse = await peminjamanService.getAllPeminjaman({ limit: 1000 });

      const newData = {
        books: booksResponse.data || [],
        users: usersResponse.users || [],
        totalCategories: categoriesResponse.totalCategories || 0,
        peminjamanData: peminjamanResponse.peminjaman || [],
        totalPeminjaman: peminjamanResponse.totalItems || 0
      };
      
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...data,
    isLoading,
    error,
    refresh: fetchData
  };
};