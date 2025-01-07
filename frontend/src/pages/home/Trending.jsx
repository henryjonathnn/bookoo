import React from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import Cover from '../../assets/cover.jpg'
import Author from '../../assets/author.jpg'

const Trending = () => {

    return (
        <>
            <section className="px-16 mx-2 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold">Trending Collections</h2>
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">New</span>
                        </div>
                        <p className="text-gray-400 mt-2">Popular book collections curated for you</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Trending Grids */}
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                            <img src={Cover} alt="Book Cover" className="w-full h-64 rounded-xl object-cover mb-4" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img src={Author} alt="Publisher" className="w-8 h-8 rounded-full border-2 border-purple-500" />
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

export default Trending