import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Settings, Book, Package, X } from 'react-feather';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-40 
          bg-[#1a1625] w-64
          transform transition-all duration-300 ease-in-out
          md:translate-x-0 md:z-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-purple-500/20 rounded flex items-center justify-center">
                <BookOpen size={16} className="text-purple-400" />
              </div>
              <a className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent" href='/'>
                BooKoo
              </a>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-[#2a2435] rounded-lg transition-colors md:hidden"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <div className="px-3 text-xs font-medium text-gray-400 uppercase mb-4">Menu</div>
          <nav className="px-3 space-y-0.5">
            <NavItem to="/admin" icon={<BookOpen size={18} />} label="Dashboard" end />
            <NavItem to="/admin/users" icon={<Users size={18} />} label="Data User" />
            <NavItem to="/admin/buku" icon={<Book size={18} />} label="Data Buku" />
            <NavItem to="/admin/peminjaman" icon={<Package size={18} />} label="Data Peminjaman" />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3">
          <NavItem 
            to="/admin/settings" 
            icon={<Settings size={18} />} 
            label="Settings" 
            className="bg-[#2a2435]/50 hover:bg-[#2a2435]"
          />
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, to, end = false, className = '' }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
      transition-all duration-200
      ${isActive 
        ? 'bg-purple-500/20 text-purple-400 font-medium' 
        : 'text-gray-400 hover:bg-[#2a2435] hover:text-gray-200'
      }
      ${className}
    `}
    onClick={(e) => {
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