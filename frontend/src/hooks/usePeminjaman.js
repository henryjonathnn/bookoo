// hooks/usePeminjaman.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { peminjamanService } from '../services/peminjamanService';
import { useAuth } from '../contexts/AuthContext';

export const usePeminjaman = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();  // Get user from auth context

  const createPeminjaman = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add user ID to the peminjaman data
      const peminjamanWithUser = {
        ...data,
        id_user: user.id  
      };
      
      const response = await peminjamanService.createPeminjaman(peminjamanWithUser);
      toast.success('Peminjaman berhasil dibuat!');
      return response;
    } catch (error) {
      setError(error);
      toast.error(error.response?.data?.msg || 'Gagal membuat peminjaman');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserPeminjaman = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await peminjamanService.getUserPeminjaman();
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil data peminjaman';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPeminjaman,
    getUserPeminjaman,
    loading,
    error
  };
};