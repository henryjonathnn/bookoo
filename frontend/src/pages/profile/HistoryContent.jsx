import React from 'react';
import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle, ArrowRight } from 'react-feather';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from '../../components/modules/admin/StatusBadge';
import { calculateBorrowingStats } from '../../utils/calculateBorrowingStats';

const HistoryContent = ({ historyPeminjaman, historyLoading }) => {
  if (historyLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (historyPeminjaman.length === 0) {
    return (
      <div className="text-center py-12 bg-purple-500/5 rounded-2xl border border-purple-500/10">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-400/50" />
        <h3 className="text-lg font-medium text-white mb-2">Belum Ada Riwayat</h3>
        <p className="text-gray-400">Anda belum memiliki riwayat peminjaman buku</p>
      </div>
    );
  }

  const { totalPeminjaman, dikembalikan, sedangBerjalan } = calculateBorrowingStats(historyPeminjaman);

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': <Clock className="w-4 h-4" />,
      'DIPROSES': <Clock className="w-4 h-4" />,
      'DIKIRIM': <Clock className="w-4 h-4" />,
      'DIPINJAM': <BookOpen className="w-4 h-4" />,
      'TERLAMBAT': <AlertCircle className="w-4 h-4" />,
      'DIKEMBALIKAN': <CheckCircle className="w-4 h-4" />,
      'DITOLAK': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-medium text-white">Total Peminjaman</h3>
          </div>
          <p className="text-2xl font-bold text-purple-400">{totalPeminjaman}</p>
        </div>
        <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-medium text-white">Dikembalikan</h3>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {dikembalikan}
          </p>
        </div>
        <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="font-medium text-white">Sedang Berjalan</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {sedangBerjalan}
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyPeminjaman.map((peminjaman) => (
          <div key={peminjaman.id} className="bg-purple-500/5 rounded-xl p-6 border border-purple-500/10 hover:bg-purple-500/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-16 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">{peminjaman.buku.judul}</h3>
                    <p className="text-gray-400">{peminjaman.buku.penulis}</p>
                  </div>
                </div>
              </div>
              <StatusBadge status={peminjaman.status} icon={getStatusIcon(peminjaman.status)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Peminjaman
                </p>
                <p className="text-white">
                  {peminjaman.tgl_dikirim
                    ? format(new Date(peminjaman.tgl_dikirim), 'dd MMMM yyyy', { locale: id })
                    : 'Belum dipinjam'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Rencana Pengembalian
                </p>
                <p className="text-white">
                  {peminjaman.tgl_kembali_rencana
                    ? format(new Date(peminjaman.tgl_kembali_rencana), 'dd MMMM yyyy', { locale: id })
                    : '-'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Pengembalian
                </p>
                <p className="text-white">
                  {peminjaman.tgl_kembali_aktual
                    ? format(new Date(peminjaman.tgl_kembali_aktual), 'dd MMMM yyyy', { locale: id })
                    : '-'
                  }
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-purple-500/10">
              <div className="flex flex-wrap gap-4">
                {peminjaman.total_denda > 0 && (
                  <div className="bg-red-500/10 px-4 py-2 rounded-lg">
                    <p className="text-sm text-red-400 mb-1">Total Denda</p>
                    <p className="text-white font-medium">
                      Rp {parseFloat(peminjaman.total_denda).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
                {peminjaman.catatan && (
                  <div className="bg-purple-500/10 px-4 py-2 rounded-lg flex-1">
                    <p className="text-sm text-purple-400 mb-1">Catatan</p>
                    <p className="text-white">{peminjaman.catatan}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryContent;