import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { useLocation, Navigate } from 'react-router-dom';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await authService.refreshToken();
            const { accessToken, user } = response;
            localStorage.setItem('token', accessToken);
            setUser(user);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
        const refreshInterval = setInterval(async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { accessToken } = await authService.refreshToken();
                    localStorage.setItem('token', accessToken);
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            }
        }, 14 * 60 * 1000); // Refresh every 14 minutes

        return () => clearInterval(refreshInterval);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            toast.success('Login berhasil!');
            return response;
        } catch (error) {
            toast.error(error.message || 'Login gagal');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            toast.success('Register berhasil! Silakan login.');
            return response;
        } catch (error) {
            toast.error(error.message || 'Register gagal. Silakan coba lagi.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('Logout berhasil!');
        } catch (error) {
            console.error('Logout gagal:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected Route component
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;
    
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (!user) return <Navigate to="/" state={{ from: location }} replace />;
    
    if (isAdminRoute) {
        const adminAllowedRoles = ['ADMIN', 'STAFF'];
        const hasPermission = adminAllowedRoles.includes(user.role);
        
        if (!hasPermission) {
            return <Navigate to="/404" replace />;
        }
    }
    
    if (allowedRoles) {
        const hasPermission = allowedRoles.includes(user.role);
        if (!hasPermission) {
            return <Navigate to="/404" replace />;
        }
    }
    
    return children;
};