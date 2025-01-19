import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, Clock, Heart, Grid } from 'react-feather';

const Sidebar = () => {
    const menuItems = [
        { icon: Home, label: 'Beranda', path: '/' },
        { icon: Book, label: 'Buku', path: '/buku' },
        { icon: Clock, label: 'Riwayat', path: '/riwayat' },
        { icon: Heart, label: 'Favorit', path: '/favorit' },
        { icon: Grid, label: 'Koleksi', path: '/koleksi' },
    ];

    return (
        <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-20 bg-[#1A1A2E] border-r border-purple-500/10 z-50">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300 group relative ${
                                isActive ? 'bg-purple-500/10 text-purple-400' : ''
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A2E] rounded-md text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;