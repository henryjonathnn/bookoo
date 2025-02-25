import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, LogOut, Menu, X, Home, Book, Clock, Heart, Grid, User, ChevronDown, ShoppingCart, Settings, Star, FileText } from 'react-feather';
import { Link } from 'react-router-dom';
import AuthModal from '../../pages/auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '../../config/api.config';
import { notifikasiService } from '../../services/notifikasiService';
import NotifikasiDropdown from '../modules/NotifikasiDropdown';

const Navbar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotifikasiOpen, setIsNotifikasiOpen] = useState(false);
    const { user, logout } = useAuth();
    const [notifikasi, setNotifikasi] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const profileDropdownRef = useRef(null);
    const notifikasiDropdownRef = useRef(null);

    useEffect(() => {
        setIsProfileDropdownOpen(false);
        setIsNotifikasiOpen(false);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle Profile Dropdown
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            // Handle Notifikasi Dropdown
            if (notifikasiDropdownRef.current && !notifikasiDropdownRef.current.contains(event.target)) {
                setIsNotifikasiOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifikasi();
        } else {
            setNotifikasi([]);
            setUnreadCount(0);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const interval = setInterval(fetchNotifikasi, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifikasi = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const data = await notifikasiService.getNotifikasi();
            if (Array.isArray(data)) {
                setNotifikasi(data);
                setUnreadCount(data.filter(item => !item.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotifikasiRead = async (notif) => {
        try {
            await notifikasiService.markAsRead(notif.id);
            fetchNotifikasi();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notifikasiService.markAllAsRead();
            fetchNotifikasi();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleAuthAction = async () => {
        if (user) {
            try {
                await logout();
            } catch (error) {
                console.error('Logout gagal:', error);
                toast.error('Gagal logout');
            }
        } else {
            setIsAuthModalOpen(true);
        }
    };

    const mobileMenuItems = [
        { icon: Home, label: 'Beranda', path: '/' },
        { icon: Book, label: 'Buku', path: '/buku' },
        { icon: Clock, label: 'Riwayat', path: '/riwayat' },
        { icon: Heart, label: 'Favorit', path: '/favorit' },
        { icon: Grid, label: 'Koleksi', path: '/koleksi' },
    ];

    return (
        <>
            <nav className="fixed top-0 right-0 left-0 md:left-20 glass-effect z-40 border-b border-purple-500/10">
                <div className="flex items-center justify-between px-4 md:px-8 py-4">
                    {/* Hamburger Menu - Mobile Only */}
                    <button
                        className="p-2 md:hidden rounded-xl hover:bg-purple-500/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Booktopia
                    </a>

                    <div className="hidden md:flex flex-1 max-w-2xl mx-12">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari buku, penulis, atau genre.."
                                className="w-full bg-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Notification Bell */}
                        <div ref={notifikasiDropdownRef} className="relative">
                            <button
                                onClick={() => setIsNotifikasiOpen(!isNotifikasiOpen)}
                                className="relative p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full"></span>
                                )}
                            </button>
                            {isNotifikasiOpen && (
                                <NotifikasiDropdown
                                    notifikasi={notifikasi}
                                    onRead={handleNotifikasiRead}
                                    onClose={handleMarkAllRead}
                                />
                            )}
                        </div>

                        {/* Order/Cart Icon */}
                        <Link
                            to="/pesanan"
                            className="relative p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400"
                        >
                            <ShoppingCart size={20} />
                            {/* Optional: Add order count badge */}
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Link>

                        {user ? (
                            <div ref={profileDropdownRef} className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-purple-500/10"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                                        {user.profile_img ? (
                                            <img
                                                src={`${API_CONFIG.baseURL}${user.profile_img}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                                                <User size={20} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#1A1A2E] rounded-xl shadow-lg border border-purple-500/10 py-2">
                                        {/* User Info Header */}
                                        <div className="flex items-center space-x-3 px-4 py-3 border-b border-purple-500/10">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                                                {user.profile_img ? (
                                                    <img
                                                        src={`${API_CONFIG.baseURL}${user.profile_img}`}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                                                        <User size={20} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{user.username}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Dropdown Menu Items with Icons */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-500/10 text-sm"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <User size={16} className="text-gray-400" />
                                            <span>Profil & Riwayat</span>
                                        </Link>
                                        <Link
                                            to="/favorit"
                                            className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-500/10 text-sm"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <Star size={16} className="text-gray-400" />
                                            <span>Favorit</span>
                                        </Link>
                                        <Link
                                            to="/pengaturan"
                                            className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-500/10 text-sm"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <Settings size={16} className="text-gray-400" />
                                            <span>Pengaturan</span>
                                        </Link>
                                        <button
                                            onClick={handleAuthAction}
                                            className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-purple-500/10 text-red-500 text-sm"
                                        >
                                            <LogOut size={16} className="text-red-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleAuthAction}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl font-medium transition-all duration-300 px-6 py-2"
                            >
                                Masuk
                            </button>
                        )}
                    </div>
                </div>
                {/* Mobile Search - Shown below navbar when menu is open */}
                {isMobileMenuOpen && (
                    <div className="p-4 md:hidden border-t border-purple-500/10">
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari buku, penulis, atau genre.."
                                className="w-full bg-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10"
                            />
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/95 z-30 md:hidden pt-40">
                    <div className="flex flex-col p-4 space-y-4">
                        {mobileMenuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-500/10 text-gray-300 hover:text-purple-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default Navbar;