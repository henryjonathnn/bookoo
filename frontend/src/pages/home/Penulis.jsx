import React from 'react'
import { Check } from 'react-feather'
import Author from '/assets/author/author.jpg'

const Penulis = () => {
    return (
        <>
            <section className="px-16 mx-2 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold">Penulis Top</h2>
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">Popular</span>
                        </div>
                        <p className="text-gray-400 mt-2">List top penulis saat ini</p>
                    </div>
                </div>

                {/* Penulis Grid */}
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="glass-effect rounded-2xl p-6 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                            <div className="relative w-20 h-20 mx-auto mb-4">
                                <img src={Author} alt="Author" className="w-full h-full rounded-full object-cover border-2 border-purple-500" />
                                <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                                    <Check size={16} />
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <h3 className="font-medium text-lg">Pidi Baiq</h3>
                                <p className="text-gray-400 text-sm">@pidi_baiq</p>
                            </div>
                            <div className="flex justify-between text-sm border-t border-purple-500/10 pt-4">
                                <div>
                                    <p className="text-gray-400">Buku</p>
                                    <p className="font-medium">12</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Suka</p>
                                    <p className="font-medium">10K</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Pembaca</p>
                                    <p className="font-medium">90K</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Penulis