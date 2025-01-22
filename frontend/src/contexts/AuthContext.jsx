import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';
import { useLocation, Navigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            setLoading(false);
            return;
          }
    
          // Try to get a new token using refresh token
          const response = await authService.refreshToken();
          const { accessToken, user } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          setUser(user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        checkAuth();
        
        // Set up timer untuk refresh token sebelum expired
        const refreshInterval = setInterval(async () => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            try {
              const response = await authService.refreshToken();
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
            } catch (error) {
              console.error('Token refresh failed:', error);
              // Handle failed refresh (optional)
            }
          }
        }, 14 * 60 * 1000); // Refresh every 14 minutes (before 15-minute expiration)
    
        return () => clearInterval(refreshInterval);
      }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            // Make sure you're storing both user data and token
            setUser(response.data.user);
            localStorage.setItem('accessToken', response.data.accessToken);
            toast.success('Login berhasil!');
            return response;
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Login gagal');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            toast.success('Register berhasil! Silakan login.');
            return response;
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Register gagal. Silakan coba lagi.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            localStorage.removeItem('accessToken');
            toast.success('Logout berhasil!');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout gagal');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    if (loading) {
        return <div>Loading...</div>;
    }
  
    // Redirect ke login jika tidak ada user
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    // Jika tidak ada allowedRoles, berarti route hanya butuh login
    if (!allowedRoles) {
        return children;
    }
  
    // Debug log untuk melihat nilai role
    console.log('Current user role:', user.role);
    console.log('Allowed roles:', allowedRoles);
  
    // Cek apakah role user termasuk dalam allowedRoles
    const hasPermission = allowedRoles.includes(user.role);
    console.log('Has permission:', hasPermission);
  
    // Redirect ke 403 jika tidak punya akses
    if (!hasPermission) {
        return <Navigate to="/403" replace />;
    }
  
    return children;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};