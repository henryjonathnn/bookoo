import React, { useCallback, useEffect, useState } from 'react';
import { Book, Check, X, Send } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { toast } from 'react-hot-toast';
import PeminjamanDetailModal from '../../components/modules/admin/PeminjamanDetailModal';
import { peminjamanService } from '../../services/peminjamanService';
import { API_CONFIG } from '../../config/api.config';
import StatusBadge from '../../components/modules/admin/StatusBadge';
import PenolakanModal from '../../components/modules/admin/PenolakanModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
  const [filters, setFilters] = useState({
    status: ''
  })
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    ...filters
  });
  const [isPenolakanModalOpen, setIsPenolakanModalOpen] = useState(false);
  const [selectedPeminjamanId, setSelectedPeminjamanId] = useState(null);

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

  const updateParams = useCallback((newParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams
    }));
  }, []);
  
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    updateParams({
      ...newFilters,
      page: 1
    });
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

  const handleStatusUpdate = async (id, status, alasanPenolakan = null) => {
    try {
      await peminjamanService.updateStatus(id, status, alasanPenolakan);
      toast.success('Status peminjaman berhasil diupdate!');
      fetchData();
    } catch (error) {
      toast.error('Gagal mengupdate status peminjaman');
    }
  };

  const handlePenolakan = (id) => {
    setSelectedPeminjamanId(id);
    setIsPenolakanModalOpen(true);
  };

  const handlePenolakanSubmit = async (alasan) => {
    await handleStatusUpdate(selectedPeminjamanId, 'DITOLAK', alasan);
    setIsPenolakanModalOpen(false);
    setSelectedPeminjamanId(null);
  };

  const handleKonfirmasiPengiriman = async (peminjaman) => {
    try {
      // Buka file picker
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            setLoading(true);
            await peminjamanService.konfirmasiPengiriman(peminjaman.id, file);
            toast.success('Pengiriman berhasil dikonfirmasi!');
            fetchData();
          } catch (error) {
            toast.error('Gagal mengonfirmasi pengiriman');
          } finally {
            setLoading(false);
          }
        }
      };

      fileInput.click();
    } catch (error) {
      toast.error('Gagal membuka file picker');
    }
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
      header: 'No. Resi',
      className: "w-[15%] px-2 py-2 text-center align-middle font-medium"
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
      <td className="w-[5%] px-2 py-2 text-center">
        <input
          type="checkbox"
          checked={selectedPeminjamans.includes(peminjaman.id)}
          onChange={(e) => handleSelectPeminjaman(peminjaman.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        />
      </td>
      <td className="w-[5%] px-2 py-2 text-center text-sm text-gray-400">
        #{peminjaman.id}
      </td>
      <td className="w-[25%] px-2 py-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-[#1a1225] rounded overflow-hidden flex-shrink-0">
            {peminjaman.buku?.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${peminjaman.buku.cover_img}`}
                alt={peminjaman.buku.judul}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Book className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-white truncate">
              {peminjaman.buku?.judul}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {peminjaman.user?.name}
            </p>
          </div>
        </div>
      </td>
      <td className="w-[15%] px-2 py-2 text-center">
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-gray-400">Pinjam: {new Date(peminjaman.tgl_peminjaman_diinginkan).toLocaleDateString()}</span>
          <span className="text-gray-400">Kembali: {new Date(peminjaman.tgl_kembali_rencana).toLocaleDateString()}</span>
        </div>
      </td>
      <td className="w-[15%] px-2 py-2 text-center">
  <div className="flex flex-col items-center gap-2">
    <StatusBadge status={peminjaman.status} />
    
    {peminjaman.status === 'PENDING' && (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStatusUpdate(peminjaman.id, 'DIPROSES');
          }}
          className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
          title="Terima"
        >
          <Check size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePenolakan(peminjaman.id);
          }}
          className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Tolak"
        >
          <X size={14} />
        </button>
      </div>
    )}
  
    {peminjaman.status === 'DIPROSES' && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStatusUpdate(peminjaman.id, 'DIKIRIM');
        }}
        className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
      >
        <Send size={14} />
        <span className="text-xs">Kirim</span>
      </button>
    )}
  
    {peminjaman.status === 'DIKIRIM' && (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleKonfirmasiPengiriman(peminjaman);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
          >
            <Check size={14} />
            <span className="text-xs">Konfirmasi Pengiriman</span>
          </button>
        </div>
        
        {peminjaman.bukti_pengiriman ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">Bukti Pengiriman</span>
            <div className="relative group">
              <img
                src={`${API_CONFIG.baseURL}${peminjaman.bukti_pengiriman}`}
                alt="Bukti Pengiriman"
                className="w-20 h-20 object-cover rounded-lg shadow-md transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <a 
                  href={`${API_CONFIG.baseURL}${peminjaman.bukti_pengiriman}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-xs bg-blue-500/80 px-2 py-1 rounded hover:bg-blue-500/90"
                >
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-yellow-400">Menunggu Konfirmasi</span>
        )}
      </div>
    )}
  </div>
      </td>
      <td className="w-[15%] px-2 py-2 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono text-gray-400">
            {peminjaman.nomor_resi || '-'}
          </span>
          {peminjaman.status === 'PENDING' && (
            <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 rounded">
              Baru
            </span>
          )}
        </div>
      </td>
      <td className="w-[15%] px-2 py-2 text-center">
        <span className="text-sm">{peminjaman.metode_pengiriman}</span>
      </td>
      <td className="w-[10%] px-2 py-2 text-center">
        {peminjaman.total_denda > 0 ? (
          <span className="text-red-400">
            Rp {peminjaman.total_denda.toLocaleString()}
          </span>
        ) : (
          '-'
        )}
      </td>
      <td className="w-[10%] px-2 py-2" onClick={(e) => e.stopPropagation()}>
        <TombolAksi onView={() => handleOpenDetailModal(peminjaman)} />
      </td>
    </tr>
  ), [selectedPeminjamans, handleSelectPeminjaman, handleStatusUpdate, handlePenolakan, handleOpenDetailModal]);

  return (
    <div className="pt-16">
      <PageHeader
        title="Data Peminjaman"
        subtitle="Pengelolaan data peminjaman buku di perpustakaan BooKoo"
      />

      <SearchFilterBar
        searchPlaceholder="Cari peminjaman..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterType="peminjaman"
        initialValue=""
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full">
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
        </div>
      )}

      <PeminjamanDetailModal
        data={selectedPeminjaman}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      <PenolakanModal
        isOpen={isPenolakanModalOpen}
        onClose={() => setIsPenolakanModalOpen(false)}
        onSubmit={handlePenolakanSubmit}
      />
    </div>
  );
};

export default DataPeminjaman;