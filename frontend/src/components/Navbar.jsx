import React from 'react'
import { Bell, Search } from 'react-feather'

const Navbar = () => {
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
                                placeholder="Search books, authors, or genres"
                                className="w-full bg-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="relative p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full"></span>
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-all duration-300 flex items-center space-x-2">
                            <span>Sign In</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar