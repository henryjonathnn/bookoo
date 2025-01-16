import React, { useState } from 'react';
import { Bell, Search, LogOut } from 'react-feather';
import AuthModal from '../pages/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

    console.log('Current user:', user); // For debugging

    return (
        <>
            <nav className="fixed top-0 right-0 left-20 glass-effect z-40 border-b border-purple-500/10">
                <div className="flex items-center justify-between px-8 py-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        BooKoo
                    </h1>
                    <div className="flex-1 max-w-2xl mx-12">
                        <div className="relative">
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
            </nav>

            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default Navbar;