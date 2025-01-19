import React from 'react';
import { Bookmark } from 'react-feather';

const TrendingModal = ({ books, bookmarks, onToggleBookmark }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex space-x-4 p-4 rounded-xl bg-black/20 border border-purple-500/10"
        >
          <img
            src={`/assets/books/${book.cover}`}
            alt={book.title}
            className="w-32 h-44 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg truncate">{book.title}</h3>
              <button
                onClick={() => onToggleBookmark(book.id)}
                className="p-2 rounded-lg hover:bg-purple-500/10 transition-all duration-300"
              >
                <Bookmark
                  size={20}
                  className={`${bookmarks[book.id] ? 'fill-purple-500 text-purple-500' : 'text-white'}`}
                />
              </button>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <img
                src={`/assets/author/${book.author.image}`}
                alt={book.author.name}
                className="w-6 h-6 rounded-full border border-purple-500"
              />
              <p className="text-gray-400 text-sm truncate">
                by {book.author.name}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
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
        </div>
      ))}
    </div>
  );
};

export default TrendingModal;