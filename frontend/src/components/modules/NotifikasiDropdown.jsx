import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bell, Package, Clock, CheckCircle, XCircle, RefreshCw, BookOpen, AlertTriangle, Eye } from 'react-feather';
import NotifikasiDetailModal from './NotifikasiDetailModal';

const NotifikasiDropdown = ({ notifikasi, onRead, onClose }) => {
  const [selectedNotifikasi, setSelectedNotifikasi] = useState(null);

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: id 
    });
  };

  const getNotificationConfig = (tipe) => {
    switch (tipe) {
      case 'PEMINJAMAN_CREATED':
        return {
          icon: <Package className="w-5 h-5" />,
          color: 'bg-blue-500/10 text-blue-500',
          badge: 'Permintaan Baru'
        };
      case 'PEMINJAMAN_DIPROSES':
        return {
          icon: <RefreshCw className="w-5 h-5" />,
          color: 'bg-purple-500/10 text-purple-500',
          badge: 'Diproses'
        };
      case 'PEMINJAMAN_DIKIRIM':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'bg-green-500/10 text-green-500',
          badge: 'Dikirim'
        };
      case 'PEMINJAMAN_DITOLAK':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'bg-red-500/10 text-red-500',
          badge: 'Ditolak'
        };
      case 'PEMINJAMAN_DIKEMBALIKAN':
        return {
          icon: <BookOpen className="w-5 h-5" />,
          color: 'bg-teal-500/10 text-teal-500',
          badge: 'Dikembalikan'
        };
      case 'DUE_REMINDER':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'bg-yellow-500/10 text-yellow-500',
          badge: 'Pengingat'
        };
      case 'OVERDUE_NOTICE':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'bg-orange-500/10 text-orange-500',
          badge: 'Terlambat'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5" />,
          color: 'bg-gray-500/10 text-gray-500',
          badge: 'Notifikasi'
        };
    }
  };

  const handleNotifikasiClick = (notif) => {
    setSelectedNotifikasi(notif);
  };

  const handleCloseModal = () => {
    setSelectedNotifikasi(null);
  };

  const handleMarkAsRead = (notif) => {
    onRead(notif);
    setSelectedNotifikasi(null);
  };

  return (
    <>
      <div 
        className="absolute right-0 mt-2 w-96 bg-[#1A1A2E]/95 rounded-xl shadow-lg shadow-purple-500/10 border border-purple-500/10 backdrop-blur-xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1A1A2E] border-b border-purple-500/10 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold">Notifikasi</h3>
              <div className="flex items-center space-x-2">
                {notifikasi.length > 0 && (
                  <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">
                    {notifikasi.length}
                  </span>
                )}
                {notifikasi.filter(n => !n.isRead).length > 0 && (
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span>{notifikasi.filter(n => !n.isRead).length}</span>
                    <span>Baru</span>
                  </span>
                )}
              </div>
            </div>
            {notifikasi.some(n => !n.isRead) && (
              <button 
                onClick={onClose}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
          {notifikasi.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-400">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-500/10">
              {notifikasi.map((item) => {
                const config = getNotificationConfig(item.tipe);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotifikasiClick(item)}
                    className="relative p-4 hover:bg-purple-500/5 cursor-pointer transition-all duration-200 group"
                  >
                    {/* Unread Indicator */}
                    {!item.isRead && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}

                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-xl ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                            {config.badge}
                          </span>
                          {item.isRead ? (
                            <span className="text-xs bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>Telah dibaca</span>
                            </span>
                          ) : (
                            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                              Belum dibaca
                            </span>
                          )}
                          <span className="text-xs text-gray-400 ml-auto">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                          {item.message}
                        </p>
                        {!item.isRead && (
                          <div className="flex items-center mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>Klik untuk menandai sudah dibaca</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add View Detail button */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifikasi.length > 0 && (
          <div className="sticky bottom-0 border-t border-purple-500/10 bg-[#1A1A2E] backdrop-blur-xl">
            <div className="px-4 py-2 text-xs text-gray-400 text-center">
              {notifikasi.filter(n => !n.isRead).length > 0 ? (
                <span>
                  {notifikasi.filter(n => !n.isRead).length} belum dibaca dari {notifikasi.length} notifikasi
                </span>
              ) : (
                <span>Semua notifikasi telah dibaca</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <NotifikasiDetailModal
        notifikasi={selectedNotifikasi}
        onClose={handleCloseModal}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
};

export default NotifikasiDropdown; 