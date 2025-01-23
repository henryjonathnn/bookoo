import React, { memo } from 'react';
import { Bookmark } from 'react-feather';
import ImageLoader from '../../../user/ImageLoader';
import { API_CONFIG } from '../../../../config/api.config';

const BookCard = memo(({
  book,
  isBookmarked = false,
  onToggleBookmark = () => { },
  showRating = false,
  rightLabel
}) => {
  // Adjust these paths based on your actual backend image serving
  const coverImg = book.cover_img
    ? `${API_CONFIG.baseURL}${book.cover_img}`
    : '/default-book-cover.jpg';

  const getValue = () => {
    if (showRating) {
      return `${book.rating || 0}/5`;
    }
    return book.peminjam?.toLocaleString() || '0';
  };

  return (
    <div className="glass-effect rounded-2xl p-3 md:p-4 card-glow border border-purple-500/10 transition-all duration-300 hover:-translate-y-2">
      <div className="relative">
        <ImageLoader
          src={coverImg}
          alt={book.judul || 'Book Title'}
          className="w-full h-48 md:h-64 rounded-xl object-cover mb-3 md:mb-4"
          width={400}
          height={300}
          priority={true}
        />
        <button
          onClick={() => onToggleBookmark(book.id)}
          className="absolute top-2 right-2 p-1.5 md:p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <Bookmark
            size={18}
            className={isBookmarked ? 'fill-purple-500 text-purple-500' : 'text-white'}
          />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center flex-1 min-w-0">
          <div className="ml-2 md:ml-3 min-w-0">
            <h3 className="font-medium text-sm md:text-base truncate">{book.judul}</h3>
            <p className="text-gray-400 text-xs md:text-sm truncate">by {book.penulis}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm border-t border-purple-500/10 pt-3 md:pt-4">
        <div>
          <p className="text-gray-400">Kategori</p>
          <p className="font-medium">{book.kategori || 'Umum'}</p>
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