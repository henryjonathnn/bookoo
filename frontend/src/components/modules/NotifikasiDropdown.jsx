import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const NotifikasiDropdown = ({ notifikasi, onRead, onClose }) => {
  const formatTimeAgo = (date) => {
    const distance = formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: id 
    });
    return distance;
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-[#1A1A2E] rounded-xl shadow-lg border border-purple-500/10 py-2 max-h-[480px] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10">
        <h3 className="font-semibold">Notifikasi</h3>
        <button 
          onClick={onClose}
          className="text-xs text-purple-400 hover:text-purple-300"
        >
          Tandai semua dibaca
        </button>
      </div>
      
      {notifikasi.length === 0 ? (
        <div className="p-4 text-center text-gray-400 text-sm">
          Tidak ada notifikasi
        </div>
      ) : (
        <div className="divide-y divide-purple-500/10">
          {notifikasi.map((item) => (
            <div
              key={item.id}
              onClick={() => onRead(item)}
              className={`p-4 hover:bg-purple-500/5 cursor-pointer transition-colors ${
                !item.isRead ? 'bg-purple-500/10' : ''
              }`}
            >
              <p className="text-sm mb-1">{item.message}</p>
              <span className="text-xs text-gray-400">
                {formatTimeAgo(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotifikasiDropdown; 