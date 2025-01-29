import React from 'react';
import { Book } from 'react-feather';
import { API_CONFIG } from '../../../config/api.config';
import StatusBadge from './StatusBadge';

const PeminjamanDetailModal = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0a19] bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-[#0f0a19] rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header dengan gradien */}
        <div className="bg-gradient-to-r from-violet-900 to-indigo-900 p-6 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-20 h-28 bg-[#1a1225] rounded-lg overflow-hidden flex-shrink-0">
              {data.buku?.cover_img ? (
                <img
                  src={`${API_CONFIG.baseURL}${data.buku.cover_img}`}
                  alt={data.buku.judul}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Book className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                {data.buku?.judul}
              </h2>
              <p className="text-gray-200 text-sm">
                Peminjam: <span className="font-medium">{data.user?.name}</span>
              </p>
              <p className="text-gray-200 text-sm">
                No. Resi: <span className="font-medium">{data.nomor_resi}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          {/* Status Peminjaman */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Status Peminjaman
            </h3>
            <div className="w-full bg-[#1a1225] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={data.status} />
                <span className="text-xs font-mono text-gray-400">#{data.id}</span>
              </div>
            </div>
          </div>

          {/* Informasi Pengiriman */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Informasi Pengiriman
            </h3>
            <div className="bg-[#1a1225] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Metode Pengiriman</span>
                <span className="font-medium">{data.metode_pengiriman}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Nomor Resi</span>
                <span className="font-mono text-purple-400">{data.nomor_resi || '-'}</span>
              </div>
              <div className="border-t border-gray-800 pt-3">
                <span className="text-gray-400 text-sm">Alamat Pengiriman:</span>
                <p className="mt-1 text-sm">{data.alamat_pengiriman}</p>
              </div>
            </div>
          </div>

          {/* Timeline Peminjaman */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Timeline Peminjaman
            </h3>
            <div className="bg-[#1a1225] rounded-lg p-4">
              <div className="space-y-4">
                {[
                  {
                    label: 'Tanggal Peminjaman',
                    date: data.tgl_peminjaman_diinginkan,
                    icon: '📅'
                  },
                  {
                    label: 'Tanggal Pengembalian',
                    date: data.tgl_kembali_rencana,
                    icon: '⏳'
                  },
                  data.tgl_kembali_aktual && {
                    label: 'Dikembalikan Pada',
                    date: data.tgl_kembali_aktual,
                    icon: '✅'
                  }
                ].filter(Boolean).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">{item.label}</p>
                      <p className="font-medium">
                        {new Date(item.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informasi Biaya */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Informasi Biaya
            </h3>
            <div className="bg-[#1a1225] rounded-lg p-4">
              {data.total_denda > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Total Denda</span>
                    <span className="text-red-400 font-medium">
                      Rp {data.total_denda?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    *Denda dikenakan karena keterlambatan pengembalian buku
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  Tidak ada denda
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg transition-all hover:opacity-90 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeminjamanDetailModal; 