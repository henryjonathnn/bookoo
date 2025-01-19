import React, { useState } from 'react';
import { Bell, Search, LogOut, Menu, X, Home, Book, Clock, Heart, Grid } from 'react-feather';
import { Link } from 'react-router-dom';
import AuthModal from '../../pages/auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleAuthAction = async () => {
        if (user) {
            try {
                await logout();
                toast.success('Berhasil logout!');
            } catch (error) {
                console.error('Logout failed:', error);
                toast.error('Gagal logout. Silakan coba lagi.');
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

                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        BooKoo
                    </h1>

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
                        <button className="relative p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full"></span>
                        </button>
                        <button 
                            onClick={handleAuthAction}
                            className={`px-6 py-2 ${
                                user 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90'
                            } rounded-xl font-medium transition-all duration-300 flex items-center space-x-2`}
                        >
                            {user ? (
                                <>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </>
                            ) : (
                                <span>Masuk</span>
                            )}
                        </button>
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