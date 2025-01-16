import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authService.refreshToken();
            if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.data);
            toast.success('Login berhasil!');
            return response;
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Login gagal. Silakan coba lagi.');
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
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};