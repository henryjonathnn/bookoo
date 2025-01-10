import React, { memo } from 'react';
import { Bookmark } from 'react-feather';

const BookCard = memo(({ book, isBookmarked, onToggleBookmark, showRating, rightLabel}) => {
  const coverImg = `/assets/books/${book.cover}`;
  const authorImg = `/assets/author/${book.author.image}`;

  const getValue = () => {
    if(showRating) {
      return `${book.rating}/5`
    } 
    return book.peminjam
  }

  return (
    <div className="glass-effect rounded-2xl p-4 card-glow transition-all duration-300 hover:-translate-y-2 border border-purple-500/10">
      <div className="relative">
        <img src={coverImg} alt={book.title} className="w-full h-64 rounded-xl object-cover mb-4" loading="lazy" />
        <button
          onClick={() => onToggleBookmark(book.id)}
          className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <Bookmark
            size={20}
            className={`${isBookmarked ? 'fill-purple-500 text-purple-500' : 'text-white'}`}
          />
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-1 min-w-0">
          <img src={authorImg} alt={book.author.name} className="w-8 h-8 rounded-full border-2 border-purple-500 flex-shrink-0" loading="lazy" />
          <div className="ml-3 min-w-0">
            <h3 className="font-medium truncate">{book.title}</h3>
            <p className="text-gray-400 text-sm truncate">by {book.author.name}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm border-t border-purple-500/10 pt-4">
        <div>
          <p className="text-gray-400">Kategori</p>
          <p className="font-medium">{book.category}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">{rightLabel}</p>
          <p className="font-medium">{getValue()}</p>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;