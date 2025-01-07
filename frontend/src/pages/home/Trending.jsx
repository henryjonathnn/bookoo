import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'

const categories = ['Romance', 'Komedi', 'Pendidikan', 'Horror', 'Action']

const Trending = () => {
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetch('books.json').then(res => res.json()).then((data) => setBooks(data.books))
    }, [])

    console.log(books)
    return (
        <>
            <section className="px-16 mx-2 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold">Sedang Trending</h2>
                            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                                <span className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></span>
                                <span>Favorit</span>
                            </span>
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
                    <div>
                        <select
                            name="category"
                            id="category"
                            className="px-4 py-2 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 outline-none cursor-pointer text-gray-400 min-w-[150px]"
                        >
                            {categories.map((category, index) => (
                                <option
                                    key={index}
                                    value={category}
                                    className="bg-[#1A1A2E] text-gray-400 py-2"
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Trending Grids */}
                <div className="grid grid-cols-4 gap-6">
                    {books.filter(book => book.isTrending).map((book) => {
                        const coverImg = `/assets/books/${book.cover}`
                        const authorImg = `/assets/author/${book.author.image}`
                        return (
                            <div key={book.id} className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
                                <img src={coverImg} alt={book.title} className="w-full h-64 rounded-xl object-cover mb-4" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img src={authorImg} alt={book.author.name} className="w-8 h-8 rounded-full border-2 border-purple-500" />
                                        <div className="ml-3">
                                            <h3 className="font-medium">{book.title}</h3>
                                            <p className="text-gray-400 text-sm">by {book.author.name}</p>
                                        </div>
                                    </div>
                                    {book.isTrending && (
                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-sm">Trending</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm border-t border-purple-500/10 pt-4">
                                    <div>
                                        <p className="text-gray-400">Books</p>
                                        <p className="font-medium">{book.totalBooks}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400">Rating</p>
                                        <p className="font-medium">{book.rating}/5</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default Trending