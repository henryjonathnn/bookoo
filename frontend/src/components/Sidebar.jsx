import React from "react";
import { Book, Bookmark, Clock, Grid, Heart, Home } from "react-feather";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: "/", icon: Home, label: "Beranda" },
        { path: "/buku", icon: Grid, label: "Daftar Buku" },
        { path: "/riwayat", icon: Clock, label: "Riwayat" },
        { path: "/bookmark", icon: Bookmark, label: "Bookmark" },
        { path: "#", icon: Heart, label: "Favorit" }
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-20 glass-effect flex flex-col items-center py-8 z-50 border-r border-purple-500/10">
            <div className="mb-12">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center purple-glow">
                    <Book size={32} />
                </div>
            </div>
            <nav className="flex flex-col items-center space-y-8">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`relative p-3 rounded-xl transition-all duration-300 group ${
                            currentPath === path
                                ? "bg-purple-500/20 text-purple-400"
                                : "hover:bg-purple-500/10 text-gray-400 hover:text-purple-400"
                        }`}
                    >
                        <Icon />
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            {label}
                            {/* Tooltip arrow */}
                            <div className="absolute top-1/2 right-full -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;