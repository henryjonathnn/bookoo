import React, { useCallback, useEffect, useState } from 'react';
import { Book } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { toast } from 'react-hot-toast';
import DetailModal from '../../components/modules/admin/DetailModal';
import { peminjamanService } from '../../services/peminjamanService';
import { API_CONFIG } from '../../config/api.config';

const DataPeminjaman = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [selectedPeminjamans, setSelectedPeminjamans] = useState([]);
  const [peminjamans, setPeminjamans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await peminjamanService.getAllPeminjaman(searchParams);
      setPeminjamans(response.peminjaman);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Detail config
  const peminjamanDetailConfig = {
    title: 'Detail Peminjaman',
    imageField: 'buku.cover_img',
    defaultIcon: Book,
    primaryTextField: 'buku.judul',
    secondaryFields: [
      { key: 'user.name', label: 'Peminjam' },
      { key: 'status', label: 'Status' }
    ],
    sections: [
      {
        title: 'Informasi Peminjaman',
        fields: [
          { key: 'tgl_peminjaman_diinginkan', label: 'Tanggal Pinjam', format: (date) => new Date(date).toLocaleDateString() },
          { key: 'tgl_kembali_rencana', label: 'Tanggal Kembali', format: (date) => new Date(date).toLocaleDateString() },
          { key: 'alamat_pengiriman', label: 'Alamat Pengiriman' },
          { key: 'metode_pengiriman', label: 'Metode Pengiriman' },
          { key: 'nomor_resi', label: 'Nomor Resi' },
          { key: 'total_denda', label: 'Total Denda', format: (value) => `Rp ${value?.toLocaleString() || 0}` }
        ]
      }
    ]
  };

  // Search handler
  const handleSearch = useCallback((searchValue) => {
    setSearchParams(prev => ({ ...prev, search: searchValue, page: 1 }));
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  // Select handlers
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked && peminjamans?.length > 0) {
      setSelectedPeminjamans(peminjamans.map(p => p.id));
    } else {
      setSelectedPeminjamans([]);
    }
  }, [peminjamans]);

  const handleSelectPeminjaman = useCallback((id, checked) => {
    setSelectedPeminjamans(prev => {
      if (checked) return [...prev, id];
      return prev.filter(item => item !== id);
    });
  }, []);

  // Modal handlers
  const handleOpenDetailModal = useCallback((peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedPeminjaman(null);
    setIsDetailModalOpen(false);
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
      'DIKIRIM': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      'DIPINJAM': { bg: 'bg-green-500/10', text: 'text-green-400' },
      'TERLAMBAT': { bg: 'bg-red-500/10', text: 'text-red-400' },
      'DIKEMBALIKAN': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      'DITOLAK': { bg: 'bg-gray-500/10', text: 'text-gray-400' }
    };

    const { bg, text } = statusConfig[status] || statusConfig['PENDING'];
    return (
      <span className={`px-2 py-0.5 ${bg} ${text} rounded text-xs`}>
        {status}
      </span>
    );
  };

  // Table columns
  const columns = [
    { 
      header: <input
        type="checkbox"
        className="w-3.5 h-3.5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
        onChange={handleSelectAll}
        checked={peminjamans?.length > 0 && selectedPeminjamans.length === peminjamans.length}
      />,
      className: "w-[3%] px-2 py-2 text-center align-middle hidden md:table-cell"
    },
    { 
      header: 'ID', 
      className: "w-[5%] px-2 py-2 text-center align-middle font-medium hidden md:table-cell"
    },
    { 
      header: 'Buku & Peminjam', 
      className: "w-[25%] md:w-[25%] px-2 py-2 text-left align-middle font-medium"
    },
    { 
      header: 'Tanggal', 
      className: "w-[15%] px-2 py-2 text-center align-middle font-medium hidden md:table-cell"
    },
    { 
      header: 'Status', 
      className: "w-[10%] px-2 py-2 text-center align-middle font-medium"
    },
    { 
      header: 'Pengiriman', 
      className: "w-[22%] px-2 py-2 text-center align-middle font-medium hidden md:table-cell"
    },
    { 
      header: 'Denda', 
      className: "w-[10%] px-2 py-2 text-center align-middle font-medium hidden md:table-cell"
    },
    { 
      header: 'Actions', 
      className: "w-[10%] px-2 py-2 text-center align-middle font-medium"
    }
  ];

  // Row renderer
  const renderPeminjamanRow = useCallback((peminjaman) => (
    <tr key={peminjaman.id} 
        className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors cursor-pointer group"
        onClick={() => handleOpenDetailModal(peminjaman)}>
      <td className="px-2 py-2 text-center align-middle hidden md:table-cell">
        <input
          type="checkbox"
          className="w-3.5 h-3.5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
          checked={selectedPeminjamans.includes(peminjaman.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectPeminjaman(peminjaman.id, e.target.checked);
          }}
        />
      </td>
      <td className="px-2 py-2 text-center align-middle hidden md:table-cell">
        <span className="text-xs font-mono text-gray-400">#{peminjaman.id}</span>
      </td>
      <td className="px-2 py-2 align-middle">
        <div className="flex items-center gap-2">
          <div className="w-8 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            {peminjaman.buku?.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${peminjaman.buku.cover_img}`}
                alt={peminjaman.buku.judul}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Book className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-xs text-white group-hover:text-purple-400 transition-colors line-clamp-1">
              {peminjaman.buku?.judul}
            </h3>
            <p className="text-[11px] text-gray-400 line-clamp-1">{peminjaman.user?.name}</p>
            {/* Mobile-only date display */}
            <div className="md:hidden text-[10px] text-gray-500 mt-1">
              {new Date(peminjaman.tgl_peminjaman_diinginkan).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-2 py-2 text-center align-middle hidden md:table-cell">
        <div className="text-[11px] space-y-1">
          <p className="flex items-center justify-center gap-1">
            <span className="text-gray-400">Pinjam:</span>
            <span>{new Date(peminjaman.tgl_peminjaman_diinginkan).toLocaleDateString()}</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <span className="text-gray-400">Kembali:</span>
            <span>{new Date(peminjaman.tgl_kembali_rencana).toLocaleDateString()}</span>
          </p>
          {peminjaman.tgl_kembali_aktual && (
            <p className="flex items-center justify-center gap-1">
              <span className="text-gray-400">Aktual:</span>
              <span>{new Date(peminjaman.tgl_kembali_aktual).toLocaleDateString()}</span>
            </p>
          )}
        </div>
      </td>
      <td className="px-2 py-2 text-center align-middle">
        <div className="flex flex-col items-center gap-1">
          <StatusBadge status={peminjaman.status} />
          {peminjaman.status === 'TERLAMBAT' && (
            <span className="text-[10px] text-red-400">
              {Math.ceil((new Date() - new Date(peminjaman.tgl_kembali_rencana)) / (1000 * 60 * 60 * 24))} hari
            </span>
          )}
          {/* Mobile-only denda display */}
          {peminjaman.total_denda > 0 && (
            <span className="md:hidden text-[10px] text-red-400 mt-1">
              Rp {peminjaman.total_denda?.toLocaleString()}
            </span>
          )}
        </div>
      </td>
      <td className="px-2 py-2 text-center align-middle hidden md:table-cell">
        <div className="text-[11px] space-y-1">
          <p className="font-medium">{peminjaman.metode_pengiriman}</p>
          {peminjaman.nomor_resi && (
            <p className="text-gray-400 flex items-center justify-center gap-1">
              <span>Resi:</span>
              <span className="font-mono">{peminjaman.nomor_resi}</span>
            </p>
          )}
          <p className="text-[10px] text-gray-500 line-clamp-1">{peminjaman.alamat_pengiriman}</p>
        </div>
      </td>
      <td className="px-2 py-2 text-center align-middle hidden md:table-cell">
        {peminjaman.total_denda > 0 ? (
          <span className="text-xs font-medium text-red-400">
            Rp {peminjaman.total_denda?.toLocaleString()}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
      <td className="px-2 py-2 text-center align-middle" onClick={(e) => e.stopPropagation()}>
        <TombolAksi 
          onEdit={() => handleOpenDetailModal(peminjaman)}
          onRefresh={fetchData}
          className="opacity-0 group-hover:opacity-100 transition-opacity mx-auto" 
        />
      </td>
    </tr>
  ), [selectedPeminjamans, handleSelectPeminjaman, handleOpenDetailModal, fetchData]);

  return (
    <div className="pt-16">
      <PageHeader
        title="Data Peminjaman"
        subtitle="Pengelolaan data peminjaman buku di perpustakaan BooKoo"
      />

      <SearchFilterBar
        searchPlaceholder="Cari peminjaman..."
        onSearch={handleSearch}
        initialValue=""
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={peminjamans}
          renderRow={renderPeminjamanRow}
          totalEntries={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          entriesPerPage={10}
        />
      )}

      <DetailModal
        data={selectedPeminjaman}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        config={peminjamanDetailConfig}
      />
    </div>
  );
};

export default DataPeminjaman;