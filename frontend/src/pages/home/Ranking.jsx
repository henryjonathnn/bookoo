import React from 'react'
import Cover from '../../assets/cover.jpg'

const Ranking = () => {
    return (
        <>
            <section className="px-16 mx-2 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold">Rankings</h2>
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">24h</span>
                        </div>
                        <p className="text-gray-400 mt-2">List top buku paling laku</p>
                    </div>
                </div>
                <div className="glass-effect rounded-2xl border border-purple-500/10 overflow-hidden">
                    <div className="grid grid-cols-7 gap-4 p-4 border-b border-purple-500/10 text-sm text-gray-400">
                        <div className="col-span-3">Buku</div>
                        <div className="text-right">Genre</div>
                        <div className="text-right">Penulis</div>
                        <div className="text-right">Rating</div>
                        <div className="text-right">Suka</div>
                    </div>
                    <div className="divide-y divide-purple-500/10">
                        <div className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-purple-500/5 transition-colors">
                            <div className="col-span-3 flex items-center space-x-4">
                                <span className="text-lg font-medium text-purple-400">#1</span>
                                <img src={Cover} alt="Collection" className="w-12 h-12 rounded-xl" />
                                <div>
                                    <h3 className="font-medium">Dilan 1991</h3>
                                    <p className="text-gray-400 text-sm">2014</p>
                                </div>
                            </div>
                            <p className="text-right">Romance</p>
                            <div className="text-right">Pidi Baiq</div>
                            <div className="text-right">4.8</div>
                            <div className="text-right">10K</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Ranking