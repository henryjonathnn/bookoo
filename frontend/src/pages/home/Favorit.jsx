import React from 'react'
import { Bookmark } from 'react-feather'
import Cover from '../../assets/cover.jpg'
import Author from '../../assets/author.jpg'

const Favorit = () => {
    return (
        <>
            <section className="px-16 mx-2 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold">Paling Favorit</h2>
                            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                                <span className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></span>
                                <span>Favorit</span>
                            </span>
                        </div>
                        <p className="text-gray-400 mt-2">Most read books this week</p>
                    </div>
                    <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">View All Books</a>
                </div>

                {/* Favorit Grids */}
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                            <div className="relative">
                                <img src={Cover} alt="Book Cover" className="w-full h-64 rounded-xl object-cover mb-4" />
                                <div className="absolute inset-0 flex justify-between items-start p-3">
                                    <div className="glass-effect rounded-full px-4 py-2 text-sm border border-purple-500/10">
                                        Bestseller
                                    </div>
                                    <button className="p-2 glass-effect rounded-full hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/10">
                                        <Bookmark size={20} className='text-purple-400'/>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img src={Author} alt="Author" className="w-8 h-8 rounded-full border-2 border-purple-500" />
                                    <div className="ml-3">
                                        <h3 className="font-medium">Dilan 1991</h3>
                                        <p className="text-gray-400 text-sm">by Pidi Baiq</p>
                                    </div>
                                </div>
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm">New</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-purple-500/10 pt-4">
                                <div>
                                    <p className="text-gray-400">Books</p>
                                    <p className="font-medium">50</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400">Rating</p>
                                    <p className="font-medium">4.8/5</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Favorit