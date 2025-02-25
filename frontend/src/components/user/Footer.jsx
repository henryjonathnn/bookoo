import React from 'react'
import { Twitter, Facebook, Instagram, GitHub, Youtube, Book } from 'react-feather';

const Footer = () => {
    return (
        <footer className="mt-10 md:mt-20 relative border-t border-purple-500/10 mx-3">
            <div className="relative bg-transparent">
                <div className="container max-w-7xl px-4 md:px-8 lg:px-16 py-6 md:py-8">
                    {/* Stack vertically on mobile, row on larger screens */}
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:justify-between">
                        {/* Logo and Copyright */}
                        <div className="flex items-center space-x-2 text-center md:text-left">
                            <div className="h-8 w-8 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center purple-glow">
                                <Book size={16} />
                            </div>
                            <span className="text-xs md:text-sm text-gray-400">
                                © 2025 Booktopia Digital Library by{' '}
                                <span className="inline-block bg-purple-700/20 text-purple-300 px-2 py-1 rounded-lg shadow-lg mt-1 md:mt-0">
                                    Hyura Dev
                                </span>
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
                            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition-colors">About</a>
                            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
                            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
                            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition-colors">Docs</a>
                            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition-colors">Contact</a>
                        </nav>

                        {/* Social Links */}
                        <div className="flex items-center space-x-6">
                            <a href="https://github.com/henryjonathnn" target='_blank' className="text-gray-400 hover:text-purple-400 transition-colors">
                                <GitHub size={16} />
                            </a>
                            <a href="https://instagram.com/henryjonathnn" target='_blank' className="text-gray-400 hover:text-purple-400 transition-colors">
                                <Instagram size={16} />
                            </a>
                            <a href="https://www.youtube.com/@henryjonathnn" target='_blank' className="text-gray-400 hover:text-purple-400 transition-colors">
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer