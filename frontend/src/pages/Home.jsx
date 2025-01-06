import React, { useEffect } from 'react';
import Typewriter from 'typewriter-effect/dist/core';
import '../App.css'
import gambarHero from '../assets/hero.png';

export default function Home() {
    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Initialize typewriter effect
        const target = document.getElementById("dynamic-text");
        if (target) {
            const typewriter = new Typewriter(target, {
                loop: true,
                delay: 85,
                deleteSpeed: 35,
                cursor: "|",
                cursorClassName: "Typewriter__cursor",
                wrapperClassName: "Typewriter__wrapper",
                autoStart: true,
                strings: ["buku favoritmu", "genre favoritmu", "penulis idolamu"],
                pauseFor: 2000,
            });

            typewriter
                .pauseFor(1000)
                .typeString("buku favoritmu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(300)
                .typeString("genre favoritmu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(300)
                .typeString("penulis idolamu")
                .pauseFor(2000)
                .deleteAll(35)
                .pauseFor(500)
                .start();
        }
    }, []);

    return (
        <div className="bg-[#0D0D1A] text-white min-h-screen bg-pattern">
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

            {/* Main Content */}
            <main className="ml-20">
                {/* Top Navigation */}
                <nav className="fixed top-0 right-0 left-20 glass-effect z-40 border-b border-purple-500/10">
                    <div className="flex items-center justify-between px-8 py-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            BooKoo
                        </h1>
                        <div className="flex-1 max-w-2xl mx-12">
                            <div className="relative">
                                <i data-feather="search" className="absolute left-4 top-3.5 h-5 w-5 text-gray-500"></i>
                                <input
                                    type="text"
                                    placeholder="Search books, authors, or genres"
                                    className="w-full bg-[#1A1A2E] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <button className="relative p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-purple-400">
                                <i data-feather="bell" className="h-5 w-5"></i>
                                <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full"></span>
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-all duration-300 flex items-center space-x-2">
                                <span>Sign In</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
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

                {/* Top Collections Section */}
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
                                <i data-feather="chevron-left" className="h-5 w-5"></i>
                            </button>
                            <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
                                <i data-feather="chevron-right" className="h-5 w-5"></i>
                            </button>
                        </div>
                    </div>
                    {/* Collection Cards */}
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                                <img src="/api/placeholder/400/300" alt="Book Cover" className="w-full h-64 rounded-xl object-cover mb-4" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img src="/api/placeholder/32/32" alt="Publisher" className="w-8 h-8 rounded-full border-2 border-purple-500" />
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

                {/* Popular Now Section */}
                <section className="px-16 mx-2 mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h2 className="text-3xl font-bold">Popular Now</h2>
                                <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                                    <span className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></span>
                                    <span>Trending</span>
                                </span>
                            </div>
                            <p className="text-gray-400 mt-2">Most read books this week</p>
                        </div>
                        <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">View All Books</a>
                    </div>
                    {/* Popular Books Grid */}
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                                <div className="relative">
                                    <img src="/api/placeholder/400/300" alt="Book Cover" className="w-full h-64 rounded-xl object-cover mb-4" />
                                    <div className="absolute inset-0 flex justify-between items-start p-6">
                                        <div className="glass-effect rounded-full px-4 py-2 text-sm border border-purple-500/10">
                                            Bestseller
                                        </div>
                                        <button className="p-2 glass-effect rounded-full hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/10">
                                            <i data-feather="bookmark" className="h-5 w-5 text-purple-400"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img src="/api/placeholder/32/32" alt="Author" className="w-8 h-8 rounded-full border-2 border-purple-500" />
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

                {/* Featured Authors Section (lanjutan) */}
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
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="glass-effect rounded-2xl p-6 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <img src="/api/placeholder/80/80" alt="Author" className="w-full h-full rounded-full object-cover border-2 border-purple-500" />
                                    <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                                        <i data-feather="check" className="h-4 w-4"></i>
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

                {/* Rankings Section */}
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
                                    <img src="/api/placeholder/48/48" alt="Collection" className="w-12 h-12 rounded-xl" />
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
            </main>
        </div>
    );
}