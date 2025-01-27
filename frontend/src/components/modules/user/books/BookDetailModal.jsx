import React, { useState } from 'react';
import { X, Clock, Users, Star, Book, User, ShoppingCart } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import ImageLoader from '../../../user/ImageLoader';
import { API_CONFIG } from '../../../../config/api.config';

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setLoading(true);
    navigate(`/checkout?bookId=${book.id}`);
  };

  const coverImg = book.cover_img
    ? `${API_CONFIG.baseURL}${book.cover_img}`
    : '/default-book-cover.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-[#1a1a2e] via-[#16162b] to-[#1a1a2e] rounded-2xl shadow-2xl border border-purple-500/10 overflow-hidden flex flex-col">
        {/* Header with Close Button - Fixed */}
        <div className="absolute right-4 top-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-black/50 hover:bg-purple-500/10 transition-colors duration-300"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Book Cover */}
              <div className="relative max-w-sm mx-auto md:mx-0">
                <ImageLoader
                  src={coverImg}
                  alt={book.judul}
                  className="w-full aspect-[2/3] rounded-xl object-cover shadow-2xl"
                  width={300}
                  height={450}
                />
                {book.rating && (
                  <div className="absolute top-4 right-4 flex items-center bg-black/50 px-3 py-1.5 rounded-lg space-x-1.5 backdrop-blur-sm">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{book.rating}/5</span>
                  </div>
                )}
              </div>

              {/* Right Column - Book Details */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">{book.judul}</h2>
                <p className="text-purple-400 text-base md:text-lg mb-6">by {book.penulis}</p>

                {/* Book Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center space-x-2 text-purple-400 mb-1">
                      <Book size={14} />
                      <span className="text-sm">Genre</span>
                    </div>
                    <p className="font-medium text-sm">{book.kategori || 'Umum'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center space-x-2 text-purple-400 mb-1">
                      <Clock size={14} />
                      <span className="text-sm">Durasi</span>
                    </div>
                    <p className="font-medium text-sm">{book.durasi_peminjaman || 7} hari</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center space-x-2 text-purple-400 mb-1">
                      <Users size={14} />
                      <span className="text-sm">Peminjam</span>
                    </div>
                    <p className="font-medium text-sm">+{book.peminjam?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center space-x-2 text-purple-400 mb-1">
                      <User size={14} />
                      <span className="text-sm">Penerbit</span>
                    </div>
                    <p className="font-medium text-sm">{book.penerbit || '-'}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-2">Deskripsi</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {book.deskripsi || 'Tidak ada deskripsi tersedia.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Checkout Button - Fixed */}
        <div className="p-4 border-t border-purple-500/10 bg-[#1a1a2e]/80 backdrop-blur-sm">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Checkout Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;