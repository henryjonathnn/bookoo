import React from 'react'
import { Twitter, Facebook, Instagram, GitHub, Youtube, Book } from 'react-feather';


const Footer = () => {
    return (
        <>
            <footer className="mt-20 relative border-t border-purple-500/10 mx-3">
                <div className="relative bg-transparent">
                    <div className="container max-w-7xl px-16 py-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="h-8 w-8 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center purple-glow"
                                >
                                    <Book size={16} />
                                </div>
                                <span className="text-sm text-gray-400">© 2025 BooKoo Digital Library</span>
                            </div>

                            <nav className="flex items-center space-x-6">
                                <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">About</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Docs</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Contact</a>
                            </nav>

                            <div className="flex items-center space-x-4">
                                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                                    <GitHub size={16} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                                    <Instagram size={16} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                                    <Youtube size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer