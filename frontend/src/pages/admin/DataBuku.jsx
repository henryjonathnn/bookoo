import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import FormModal from '../../components/modules/admin/FormModal';
import DetailModal from '../../components/modules/admin/DetailModal';
import { useBooks } from '../../hooks/useBook';
import { bookService } from '../../services/bookService';
import { API_CONFIG } from '../../config/api.config';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useBookCategories } from '../../hooks/useBookCategories';

const DataBuku = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [filters, setFilters] = useState({
    kategori: '',
  })

  const { categories, loading: categoriesLoading } = useBookCategories();

  const {
    books,
    loading,
    updateParams,
    refresh,
    totalItems,
    currentPage,
  } = useBooks({
    page: 1,
    limit: 10,
    search: '',
    kategori: filters.kategori 
  });



  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    updateParams({ 
      ...newFilters,
      page: 1 
    });
  }, [updateParams]);


  // Handle search
  const handleSearch = useCallback((search) => {
    updateParams({ search, page: 1 });
  }, [updateParams]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  // Handle create
  const handleCreate = async (formData) => {
    try {
      await bookService.createBuku(formData);
      refresh();
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Handle update
  const handleUpdate = async (id, formData) => {
    try {
      await bookService.updateBuku(id, formData);
      refresh();
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await bookService.deleteBuku(id);
      refresh();
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Handle select all
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked && books?.length > 0) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  }, [books]);

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
      // Log untuk debugging
      console.log('Form data before submit:', formData);

      // Validasi data wajib
      const requiredFields = ['judul', 'penulis', 'kategori'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(', ')} wajib diisi`);
      }

      // Pastikan nilai numerik dikonversi dengan benar
      const processedData = {
        ...formData,
        stock: parseInt(formData.stock) || 0,
        denda_harian: parseInt(formData.denda_harian) || 0,
        tahun_terbit: formData.tahun_terbit ? parseInt(formData.tahun_terbit) : null
      };

      if (selectedBuku) {
        await handleUpdate(selectedBuku.id, processedData);
        toast.success('Buku berhasil diupdate!');
      } else {
        await handleCreate(processedData);
        toast.success('Buku berhasil ditambahkan!');
      }
      
      setIsModalOpen(false);
      setSelectedBuku(null);
      refresh();
    } catch (error) {
      console.error('Submit error:', error);
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
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        onChange={handleSelectAll}
        checked={books?.length > 0 && selectedBooks.length === books.length}
      />,
      className: "hidden md:table-cell w-[5%] px-2 lg:px-6 py-3"
    },
    {
      header: 'Buku Info',
      className: "text-left px-2 lg:px-6 py-3 w-[60%] sm:w-[40%]"
    },
    {
      header: 'ISBN',
      className: "hidden md:table-cell px-2 py-3 w-[15%] text-center"
    },
    {
      header: 'Kategori',
      className: "px-2 py-3 w-[30%] md:w-[15%] text-center"
    },
    {
      header: 'Stok',
      className: "hidden md:table-cell px-2 py-3 w-[10%] text-center"
    },
    {
      header: 'Actions',
      className: "px-2 py-3 w-[20%] md:w-[10%] text-right"
    }
  ];

  const bukuFormConfig = {
    fields: [
      {
        name: 'judul',
        label: 'Judul Buku',
        type: 'text',
        required: true,
        placeholder: 'Masukkan judul buku'
      },
      {
        name: 'penulis',
        label: 'Penulis',
        type: 'text',
        required: true,
        placeholder: 'Masukkan nama penulis'
      },
      {
        name: 'kategori',
        label: 'Kategori',
        type: 'select',
        required: true,
        options: [
          { value: 'FIKSI', label: 'Fiksi' },
          { value: 'NON-FIKSI', label: 'Non-Fiksi' },
          { value: 'SAINS', label: 'Sains' },
          { value: 'TEKNOLOGI', label: 'Teknologi' },
          { value: 'SEJARAH', label: 'Sejarah' },
          { value: 'SASTRA', label: 'Sastra' },
          { value: 'KOMIK', label: 'Komik' },
          { value: 'LAINNYA', label: 'Lainnya' }
        ]
      },
      {
        name: 'isbn',
        label: 'ISBN',
        type: 'text',
        placeholder: 'Masukkan ISBN buku'
      },
      {
        name: 'stock',
        label: 'Stok',
        type: 'number',
        min: 0,
        placeholder: 'Masukkan jumlah stok'
      },
      {
        name: 'denda_harian',
        label: 'Denda Harian',
        type: 'number',
        min: 0,
        placeholder: 'Masukkan nominal denda'
      },
      {
        name: 'penerbit',
        label: 'Penerbit',
        type: 'text',
        placeholder: 'Masukkan nama penerbit'
      },
      {
        name: 'tahun_terbit',
        label: 'Tahun Terbit',
        type: 'number',
        min: 1800,
        max: new Date().getFullYear(),
        placeholder: 'Masukkan tahun terbit'
      },
      {
        name: 'deskripsi',
        label: 'Deskripsi',
        type: 'textarea',
        placeholder: 'Masukkan deskripsi buku'
      },
      {
        name: 'cover_img',
        label: 'Cover Buku',
        type: 'file',
        accept: 'image/*'
      }
    ]
  };

  const bukuDetailConfig = {
    fields: [
      { name: 'judul', label: 'Judul Buku' },
      { name: 'penulis', label: 'Penulis' },
      { name: 'kategori', label: 'Kategori' },
      { name: 'isbn', label: 'ISBN' },
      { name: 'stock', label: 'Stok' },
      { name: 'denda_harian', label: 'Denda Harian' },
      { name: 'penerbit', label: 'Penerbit' },
      { name: 'tahun_terbit', label: 'Tahun Terbit' },
      { name: 'deskripsi', label: 'Deskripsi' },
      { 
        name: 'cover_img', 
        label: 'Cover Buku',
        type: 'image',
        baseUrl: API_CONFIG.baseURL 
      }
    ]
  };

  const renderBookRow = useCallback((book) => (
    <tr key={book.id}
      className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors cursor-pointer"
      onClick={() => handleOpenDetailModal(book)}>
      <td className="hidden md:table-cell px-2 lg:px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedBooks.includes(book.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectBook(book.id, e.target.checked);
          }}
        />
      </td>
      <td className="px-3 lg:px-6 py-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-7 h-10 md:w-10 md:h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            {book.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${book.cover_img}`}
                alt={book.judul}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-3 h-3 md:w-5 md:h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-[11px] md:text-sm text-white leading-tight truncate max-w-[100px] md:max-w-[250px]">
              {book.judul}
            </h3>
            <p className="text-[10px] md:text-xs text-gray-400 truncate">{book.penulis}</p>
            <p className="text-[10px] md:hidden text-gray-400">Stok: {book.stock}</p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-2 py-2 text-center text-sm">
        {book.isbn}
      </td>
      <td className="px-2 py-2 text-center">
        <span className="px-1 py-0.5 text-[9px] md:text-xs bg-purple-500/10 text-purple-400 rounded">
          {book.kategori}
        </span>
      </td>
      <td className="hidden md:table-cell px-2 py-2 text-center text-sm">
        {book.stock}
      </td>
      <td className="px-2 lg:px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end sm:justify-start">
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

  return (
    <div className="pt-16">
      <PageHeader
        title="Data Buku"
        subtitle="Pengelolaan data buku yang ada di perpustakaan Booktopia"
        buttonLabel="Tambah Buku"
        onButtonClick={handleOpenCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Cari buku..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterType="book"
        initialValue=""
        initialFilters={filters} 
        className="w-full"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full">
          <div className="inline-block min-w-full align-middle">
            <DataTable
              columns={columns}
              data={books}
              renderRow={renderBookRow}
              totalEntries={totalItems}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              entriesPerPage={10}
              className="w-full text-sm"
            />
          </div>
        </div>
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