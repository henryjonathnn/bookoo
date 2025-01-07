import React from 'react'
import { Book, Bookmark, Clock, Grid, Heart, Home } from 'react-feather'

const Sidebar = () => {
    return (
        <>
            <aside className="fixed left-0 top-0 h-full w-20 glass-effect flex flex-col items-center py-8 z-50 border-r border-purple-500/10">
                <div className="mb-12">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center purple-glow">
                        <Book size={32} />
                    </div>
                </div>
                <nav className="flex flex-col items-center space-y-8">
                    <a href="#" className="p-3 rounded-xl bg-purple-500/20 text-purple-400 transition-all duration-300">
                        <Home />
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <Grid />
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <Clock />
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <Bookmark />
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <Heart />
                    </a>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar