import React from 'react'
import gambarHero from '../../assets/hero8.png';
const Hero = () => {
    return (
        <>
            <section className="pt-24 px-2 mb-16">
                <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full">
                        <div className="absolute inset-0 via-transparent to-transparent z-10"></div>
                        <img src={gambarHero} alt="Books" className="w-full h-full object-contain object-right" />
                    </div>
                    <div className="relative z-20 p-16 max-w-2xl">
                        <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-6 inline-block">
                            💡 Trending Collection
                        </span>
                        <div className="text-6xl font-bold mb-6 leading-tight">
                            Jelajahi<br />
                            <span id="dynamic-text" className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                buku favoritmu
                            </span><br />
                            dimana aja!
                        </div>
                        <p className="text-gray-400 text-xl mb-8 leading-relaxed">
                            Akses ribuan buku-buku menarik dari penulis terkenal dan penerbit di seluruh dunia.
                        </p>
                        <div className="flex items-center space-x-6">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-all duration-300">
                                Lihat Buku Trending
                            </button>
                            <button className="px-8 py-4 bg-purple-500/10 rounded-xl font-medium hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/20">
                                Lihat Semua Buku
                            </button>
                        </div>
                        <div className="flex items-center space-x-12 mt-12">
                            <div>
                                <p className="text-3xl font-bold mb-1">100k+</p>
                                <p className="text-gray-400">Koleksi Buku</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">50k+</p>
                                <p className="text-gray-400">Penulis</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">75k+</p>
                                <p className="text-gray-400">Peminjam</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero