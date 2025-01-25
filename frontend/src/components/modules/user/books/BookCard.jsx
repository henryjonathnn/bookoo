import React, { memo } from 'react';
import { Bookmark, Star } from 'react-feather';
import ImageLoader from '../../../user/ImageLoader';
import { API_CONFIG } from '../../../../config/api.config';

const BookCard = memo(({
  book,
  isBookmarked = false,
  onToggleBookmark = () => { },
  showRating = false,
  rightLabel = 'Peminjam'
}) => {
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
    <div className="glass-effect rounded-2xl p-3 md:p-4 card-glow border border-purple-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col">
      <div className="relative mb-3 md:mb-4">
        <ImageLoader
          src={coverImg}
          alt={book.judul || 'Book Title'}
          className="w-full aspect-[2/3] rounded-xl object-cover"
          width={400}
          height={600}
          priority={true}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => onToggleBookmark(book.id)}
            className="p-1.5 md:p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-all duration-300"
          >
            <Bookmark
              size={18}
              className={isBookmarked ? 'fill-purple-500 text-purple-500' : 'text-white'}
            />
          </button>
          {showRating && (
            <div className="flex items-center bg-black/50 px-2 py-1 rounded-lg space-x-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs">{book.rating || 0}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div className="mb-3 md:mb-4">
          <h3 className="font-semibold text-sm md:text-base line-clamp-2">{book.judul}</h3>
          <p className="text-gray-400 text-xs md:text-sm truncate">by {book.penulis}</p>
        </div>

        <div className="flex items-center justify-between text-xs md:text-sm border-t border-purple-500/10 pt-3 md:pt-4">
          <div>
            <p className="text-gray-400">Kategori</p>
            <p className="font-medium">{book.kategori || 'Umum'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">{rightLabel}</p>
            <div className="flex items-center justify-end space-x-1">
              {!showRating && <span className="text-purple-400">+</span>}
              <p className="font-medium">{getValue()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';
export default BookCard;