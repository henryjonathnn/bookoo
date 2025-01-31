import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            
            // Redirect berdasarkan role
            if (response.user.role === 'ADMIN' || response.user.role === 'STAFF') {
                navigate('/admin');
            } else {
                navigate('/');
            }
            
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
            // Redirect ke home setelah logout
            navigate('/');
            toast.success('Logout berhasil!');
        } catch (error) {
            console.error('Logout gagal:', error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
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
    const navigate = useNavigate();

    if (loading) return <LoadingSpinner />;
    
    if (!user) {
        // Redirect ke login dengan menyimpan intended location
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
        const adminAllowedRoles = ['ADMIN', 'STAFF'];
        const hasPermission = adminAllowedRoles.includes(user.role);
        
        if (!hasPermission) {
            // Redirect user biasa yang mencoba akses admin route
            navigate('/');
            return null;
        }
    }
    
    if (allowedRoles) {
        const hasPermission = allowedRoles.includes(user.role);
        if (!hasPermission) {
            // Redirect jika role tidak sesuai
            navigate('/404');
            return null;
        }
    }
    
    return children;
};