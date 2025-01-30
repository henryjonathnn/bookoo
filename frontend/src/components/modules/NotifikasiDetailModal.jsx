import React from 'react';
import { X, Eye } from 'react-feather';
import { formatDistanceToNow, format } from 'date-fns';
import { id } from 'date-fns/locale';

const NotifikasiDetailModal = ({ notifikasi, onClose, onMarkAsRead }) => {
  if (!notifikasi) return null;

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: id });
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: id 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1A1A2E] rounded-xl shadow-xl border border-purple-500/10 overflow-hidden mt-24 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-purple-500/10">
          <h3 className="text-base font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Detail Notifikasi
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-500/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Status & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notifikasi.isRead ? (
                <span className="text-xs bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded-full flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Telah dibaca
                </span>
              ) : (
                <button
                  onClick={() => onMarkAsRead(notifikasi)}
                  className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full hover:bg-purple-500/20 transition-colors flex items-center"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Tandai sudah dibaca
                </button>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {formatTimeAgo(notifikasi.createdAt)}
            </div>
          </div>

          {/* Message */}
          <div className="bg-purple-500/5 rounded-lg p-3">
            <p className="text-sm text-gray-200 leading-relaxed">
              {notifikasi.message}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Waktu</span>
              <span>{formatDate(notifikasi.createdAt)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tipe</span>
              <span className="text-purple-400">{notifikasi.tipe}</span>
            </div>
            {notifikasi.peminjaman && (
              <div className="flex justify-between text-gray-400">
                <span>ID Peminjaman</span>
                <span>#{notifikasi.peminjaman.id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/10 p-3">
          <button
            onClick={onClose}
            className="w-full px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotifikasiDetailModal; 