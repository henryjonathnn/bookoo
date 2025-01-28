import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Settings, TrendingUp, Book, Package, X } from 'react-feather';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-40 
          bg-[#1a1625] w-64 p-4
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            BooKoo
          </h1>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#2a2435] rounded-lg md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          <NavItem to="/admin" icon={<BookOpen />} label="Dashboard" end />
          <NavItem to="/admin/users" icon={<Users />} label="Data User" />
          <NavItem to="/admin/buku" icon={<Book />} label="Data Buku" />
          <NavItem to="/admin/peminjaman" icon={<Package />} label="Data Peminjaman" />
          <NavItem to="/admin/analytics" icon={<TrendingUp />} label="Analytics" />
          <NavItem to="/admin/settings" icon={<Settings />} label="Settings" />
        </nav>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, to, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => 
      `flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-[#2a2435]'
      }`
    }
    onClick={(e) => {
      // Close sidebar on mobile when clicking a link
      if (window.innerWidth < 768) {
        const event = new CustomEvent('closeSidebar');
        window.dispatchEvent(event);
      }
    }}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;