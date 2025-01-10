import React, { memo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useBooks } from '../../../hooks/useBook';
import BookCard from './BookCard';
import Modal from '../../ui/Modal'
import { BADGE_COLORS } from '../../../constant/index';

const BookSection = memo(({ 
  title, 
  subtitle, 
  badgeText, 
  badgeColor = 'purple',
  sortType,
  showRating,
  rightLabel
}) => {
  const [showModal, setShowModal] = useState(false);
  const { books, loading, error } = useBooks(sortType);

  if (loading) {
    return (
      <section className="px-16 mx-2 mb-16">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-16 mx-2 mb-16">
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="px-16 mx-2 mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold">{title}</h2>
            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full ${BADGE_COLORS[badgeColor]} text-sm`}>
              <span className={`h-2 w-2 ${badgeColor === 'purple' ? 'bg-purple-400' : 'bg-red-400'} rounded-full animate-pulse`}></span>
              <span>{badgeText}</span>
            </span>
          </div>
          <p className="text-gray-400 mt-2">{subtitle}</p>
        </div>
        <div className="flex space-x-3">
          <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
            <ChevronLeft size={20} />
          </button>
          <button className="p-3 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10">
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1A1A2E] hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 text-white"
          >
            Lihat Semua
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {books.slice(0, 4).map((book) => (
          <BookCard
            key={book.id}
            book={book}
            showRating={showRating}
            rightLabel={rightLabel}
          />
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={title}
          subtitle={subtitle}
        >
          <div className="grid grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showRating={showRating}
                rightLabel={rightLabel}
              />
            ))}
          </div>
        </Modal>
      )}
    </section>
  );
});

BookSection.displayName = 'BookSection';
export default BookSection;