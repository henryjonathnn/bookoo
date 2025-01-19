
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Bookmark, Settings, TrendingUp } from 'react-feather';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1625] transition-all duration-300 p-4 fixed h-full`}>
      <div className="flex items-center mb-8">
        <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent ${!isSidebarOpen && 'hidden'}`}>
          BooKoo
        </h1>
      </div>

      <nav className="space-y-2">
        <NavItem to="/admin" icon={<BookOpen />} label="Dashboard" end />
        <NavItem to="/admin/users" icon={<Users />} label="Users" />
        <NavItem to="/admin/books" icon={<Bookmark />} label="Books" />
        <NavItem to="/admin/analytics" icon={<TrendingUp />} label="Analytics" />
        <NavItem to="/admin/settings" icon={<Settings />} label="Settings" />
      </nav>
    </aside>
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
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;