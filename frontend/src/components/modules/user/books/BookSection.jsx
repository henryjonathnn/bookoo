import React, { memo, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'react-feather';
import { useBooks } from '../../../../hooks/useBook';
import BookCard from './BookCard';
import Modal from '../../../ui/user/Modal';
import { BADGE_COLORS, SORT_TYPES } from '../../../../constant/index';
import BookDetailModal from './BookDetailModal';

const BookSection = memo(({
  title,
  subtitle,
  badgeText,
  badgeColor = 'purple',
  sortType = SORT_TYPES.NEWEST,
  showRating = false,
  rightLabel = 'Peminjam'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null)
  const {
    books,
    loading,
    error,
    currentPage,
    totalPages,
    updateParams
  } = useBooks({
    page: 1,
    limit: 10, // Fetch 10 books
    sortType: sortType
  });

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetailModal = () => {
    setSelectedBook(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      updateParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      updateParams({ page: currentPage + 1 });
    }
  };

  if (loading) {
    return (
      <section className="px-4 md:px-8 lg:px-16 mx-2 mb-8 md:mb-16">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-8 lg:px-16 mx-2 mb-8 md:mb-16">
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-16 mx-2 mb-8 md:mb-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full ${BADGE_COLORS[badgeColor]} text-sm`}>
              <span className={`h-2 w-2 ${badgeColor === 'purple' ? 'bg-purple-400' : 'bg-red-400'} rounded-full animate-pulse`}></span>
              <span>{badgeText}</span>
            </span>
          </div>
          <p className="text-gray-400 mt-2">{subtitle}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 md:p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 md:p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 md:p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 md:px-4 md:py-2 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 text-white text-sm md:text-base"
          >
            Lihat Semua
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onBookClick={handleBookClick}
            showRating={showRating}
            rightLabel={rightLabel}
          />
        ))}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </section>
  );
});

BookSection.displayName = 'BookSection';
export default BookSection;