import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bell } from 'react-feather';

const NotifikasiDropdown = ({ notifikasi, onRead, onClose }) => {
  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: id 
    });
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-[#1A1A2E] rounded-xl shadow-lg border border-purple-500/10 py-2 max-h-[480px] overflow-y-auto z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10">
        <h3 className="font-semibold">Notifikasi</h3>
        {notifikasi.length > 0 && (
          <button 
            onClick={onClose}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Tandai semua dibaca
          </button>
        )}
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
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(item.createdAt)}
                </span>
                {!item.isRead && (
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotifikasiDropdown; 