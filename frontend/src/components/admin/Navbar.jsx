import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'react-feather';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../../config/api.config';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <header className="bg-[#1a1625]/50 backdrop-blur-sm border-b border-purple-500/10 fixed right-0 left-0 md:left-64 top-0 z-20">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#2a2435] rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl md:text-2xl font-bold">Admin Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1a1625] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div> */}
          <button className="relative p-2 hover:bg-[#2a2435] rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-[#2a2435] rounded-lg transition-colors duration-200"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-purple-500/10">
                {user?.profile_img ? (
                  <img
                    src={`${API_CONFIG.baseURL}${user.profile_img}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={20} className="text-purple-400" />
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1625] rounded-xl shadow-lg border border-purple-500/10 py-1 z-50">
                <div className="px-4 py-2 border-b border-purple-500/10">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <Link
                    to="/admin/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} className="text-purple-400" />
                    <span>Profil Saya</span>
                  </Link>
                  
                  <Link
                    to="/admin/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} className="text-purple-400" />
                    <span>Pengaturan</span>
                  </Link>
                </div>

                <div className="border-t border-purple-500/10 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;