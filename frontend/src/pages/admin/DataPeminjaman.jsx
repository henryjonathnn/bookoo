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
      <span className={`px-3 py-1 ${bg} ${text} rounded-md text-sm`}>
        {status}
      </span>
    );
  };

  // Table columns
  const columns = [
    { header: <input
      type="checkbox"
      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
      onChange={handleSelectAll}
      checked={peminjamans?.length > 0 && selectedPeminjamans.length === peminjamans.length}
    /> },
    { header: 'Buku & Peminjam' },
    { header: 'Tanggal' },
    { header: 'Status' },
    { header: 'Pengiriman' },
    { header: 'Actions' }
  ];

  // Row renderer
  const renderPeminjamanRow = useCallback((peminjaman) => (
    <tr key={peminjaman.id} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors cursor-pointer"
      onClick={() => handleOpenDetailModal(peminjaman)}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedPeminjamans.includes(peminjaman.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectPeminjaman(peminjaman.id, e.target.checked);
          }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden">
            {peminjaman.buku?.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${peminjaman.buku.cover_img}`}
                alt={peminjaman.buku.judul}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Book className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{peminjaman.buku?.judul}</h3>
            <p className="text-sm text-gray-400">{peminjaman.user?.name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <p>Pinjam: {new Date(peminjaman.tgl_peminjaman_diinginkan).toLocaleDateString()}</p>
          <p>Kembali: {new Date(peminjaman.tgl_kembali_rencana).toLocaleDateString()}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={peminjaman.status} />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <p>{peminjaman.metode_pengiriman}</p>
          {peminjaman.nomor_resi && (
            <p className="text-gray-400">Resi: {peminjaman.nomor_resi}</p>
          )}
        </div>
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <TombolAksi 
          onEdit={() => handleOpenDetailModal(peminjaman)}
          onRefresh={fetchData} 
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