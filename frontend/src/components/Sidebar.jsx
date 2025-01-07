import React from 'react'

const Sidebar = () => {
    return (
        <>
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-20 glass-effect flex flex-col items-center py-8 z-50 border-r border-purple-500/10">
                <div className="mb-12">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center purple-glow">
                        <i data-feather="book" className="h-6 w-6 text-white"></i>
                    </div>
                </div>
                <nav className="flex flex-col items-center space-y-8">
                    <a href="#" className="p-3 rounded-xl bg-purple-500/20 text-purple-400 transition-all duration-300">
                        <i data-feather="grid"></i>
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <i data-feather="compass"></i>
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <i data-feather="heart"></i>
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <i data-feather="trending-up"></i>
                    </a>
                    <a href="#" className="p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300">
                        <i data-feather="users"></i>
                    </a>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar