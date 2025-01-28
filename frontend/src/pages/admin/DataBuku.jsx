import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import FormModal from '../../components/modules/admin/FormModal';
import DetailModal from '../../components/modules/admin/DetailModal';
import { useBuku } from '../../hooks/useBuku';
import { API_CONFIG } from '../../config/api.config';
import { toast } from 'react-hot-toast';

const DataBuku = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const {
    buku,
    loading,
    totalItems,
    totalPages,
    currentPage,
    handleSearch,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh
  } = useBuku();

  // Handle select all
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked && buku?.length > 0) {
      setSelectedBooks(buku.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  }, [buku]);

  // Handle individual select
  const handleSelectBook = useCallback((bookId, checked) => {
    setSelectedBooks(prev => {
      if (checked) {
        return [...prev, bookId];
      }
      return prev.filter(id => id !== bookId);
    });
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (selectedBuku) {
        await handleUpdate(selectedBuku.id, formData);
        toast.success('Buku berhasil diupdate!');
      } else {
        await handleCreate(formData);
        toast.success('Buku berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      setSelectedBuku(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpenCreateModal = useCallback(() => {
    setSelectedBuku(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((book) => {
    setSelectedBuku(book);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBuku(null);
  }, []);

  const handleOpenDetailModal = useCallback((book) => {
    setSelectedBuku(book);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedBuku(null);
    setIsDetailModalOpen(false);
  }, []);

  const columns = [
    {
      header: <div className="flex justify-center">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          onChange={handleSelectAll}
          checked={buku?.length > 0 && selectedBooks.length === buku.length}
        />
      </div>,
      className: "w-14"
    },
    { header: 'Buku Info', className: "w-1/3" },
    { header: 'ISBN', className: "w-1/6 text-center" },
    { header: 'Kategori', className: "w-32 text-center" },
    { header: 'Stok', className: "w-24 text-center" },
    { header: 'Actions', className: "w-24 text-right" }
  ];

  const bukuFormConfig = {
    type: 'book',
    title: 'Buku',
    imageField: 'cover_img',
    fields: [
      { id: 'judul', label: 'Judul', required: true },
      { id: 'penulis', label: 'Penulis', required: true },
      { id: 'isbn', label: 'ISBN', required: true },
      {
        id: 'kategori',
        label: 'Kategori',
        required: true,
        component: ({ value, onChange, options }) => (
          <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Pilih Kategori</option>
            {['FIKSI', 'NON-FIKSI', 'SAINS', 'TEKNOLOGI', 'SEJARAH', 'SASTRA', 'KOMIK', 'LAINNYA'].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )
      },
      { id: 'stock', label: 'Stok', type: 'number', required: true },
      { id: 'denda_harian', label: 'Denda Harian', type: 'number', required: true },
      { id: 'penerbit', label: 'Penerbit', required: true },
      { id: 'tahun_terbit', label: 'Tahun Terbit', type: 'number', required: true },
      {
        id: 'deskripsi',
        label: 'Deskripsi',
        component: ({ value, onChange }) => (
          <textarea
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
        )
      }
    ]
  };

  const bukuDetailConfig = {
    title: 'Detail Buku',
    imageField: 'cover_img',
    defaultIcon: BookOpen,
    primaryTextField: 'judul',
    secondaryFields: [
      { key: 'penulis', label: 'Penulis' },
      { key: 'isbn', label: 'ISBN' }
    ],
    sections: [
      {
        title: 'Informasi Umum',
        fields: [
          { key: 'kategori', label: 'Kategori' },
          { key: 'stock', label: 'Stok' },
          { key: 'penerbit', label: 'Penerbit' },
          { key: 'tahun_terbit', label: 'Tahun Terbit' },
          {
            key: 'denda_harian',
            label: 'Denda Harian',
            format: (value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`
          }
        ]
      },
      {
        title: 'Deskripsi',
        fields: [
          { key: 'deskripsi', label: 'Deskripsi' }
        ]
      }
    ]
  };

  const renderBookRow = useCallback((book) => (
    <tr key={book.id} 
        className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors cursor-pointer"
        onClick={() => handleOpenDetailModal(book)}>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
            checked={selectedBooks.includes(book.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectBook(book.id, e.target.checked);
            }}
          />
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            {book.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${book.cover_img}`}
                alt={book.judul}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white leading-tight">{book.judul}</h3>
            <p className="text-sm text-gray-400">{book.penulis}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-400 text-center">
        {book.isbn}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <span className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 rounded">
            {book.kategori}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-center text-gray-400">
        {book.stock}
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <TombolAksi 
            onEdit={() => handleOpenEditModal(book)}
            onDelete={async () => {
                await handleDelete(book.id);
                toast.success('Buku berhasil dihapus!');
            }}
            onRefresh={refresh}
          />
        </div>
      </td>
    </tr>
  ), [selectedBooks, handleSelectBook, handleDelete, handleOpenDetailModal, handleOpenEditModal, refresh]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="pt-16">
      <PageHeader
        title="Data Buku"
        subtitle="Pengelolaan data buku yang ada di perpustakaan BooKoo"
        buttonLabel="Tambah Buku"
        onButtonClick={handleOpenCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Cari buku..."
        onSearch={handleSearch}
        initialValue=""
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={buku}
          renderRow={renderBookRow}
          totalEntries={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          entriesPerPage={10}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedBuku}
        formConfig={bukuFormConfig}
        apiConfig={API_CONFIG}
      />

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        data={selectedBuku}
        config={bukuDetailConfig}
      />
    </div>
  );
};

export default DataBuku;