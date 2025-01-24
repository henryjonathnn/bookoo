import React, { useCallback, useState } from 'react';
import { BookOpen } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import FormModal from '../../components/modules/admin/FormModal';
import { useBooks } from '../../hooks/useBook';
import { bookService } from '../../services/bookService';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '../../config/api.config';

const DataBuku = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const {
    books,
    loading,
    totalItems,
    totalPages,
    currentPage,
    updateParams,
    refresh
  } = useBooks({
    page: 1,
    limit: 10,
    search: ''
  });

  const bookFormConfig = {
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
            {options.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        ),
        options: ['FIKSI', 'NON-FIKSI', 'SAINS', 'TEKNOLOGI', 'SEJARAH', 'SASTRA', 'KOMIK', 'LAINNYA']
      },
      { id: 'stock', label: 'Stok', type: 'number', required: true },
      { id: 'denda_harian', label: 'Denda Harian', type: 'number', required: true },
      { id: 'penerbit', label: 'Penerbit', required: true },
      { id: 'tahun_terbit', label: 'Tahun Terbit', required: true },
      { id: 'deskripsi', label: 'Deskripsi', required: false }
    ]
  };

  const handleSearch = useCallback((searchValue) => {
    updateParams({ search: searchValue, page: 1 });
  }, [updateParams]);

  const handlePageChange = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedBook(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBook(null);
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id, formData);
        toast.success('Buku berhasil diupdate!');
      } else {
        await bookService.createBook(formData);
        toast.success('Buku berhasil ditambahkan!');
      }
      refresh();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked && books?.length > 0) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId, checked) => {
    setSelectedBooks(prev => {
      if (checked) {
        return [...prev, bookId];
      }
      return prev.filter(id => id !== bookId);
    });
  };

  const renderBookRow = (book) => (
    <tr key={book.id} className="border-b border-gray-800 hover:bg-[#2a2435]">
      <td className="px-6 py-2">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600"
          checked={selectedBooks.includes(book.id)}
          onChange={(e) => handleSelectBook(book.id, e.target.checked)}
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-14 bg-gray-800 rounded flex-shrink-0">
            {book.cover_img ? (
              <img
                src={`${API_CONFIG.baseURL}${book.cover_img}`}
                alt={book.judul}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <BookOpen className="w-6 h-6 m-2 text-gray-600" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{book.judul}</h3>
            <p className="text-xs text-gray-400 truncate">{book.penulis}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2 text-sm text-gray-400">{book.isbn}</td>
      <td className="px-3 py-2">
        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">
          {book.kategori}
        </span>
      </td>
      <td className="px-3 py-2 text-sm text-gray-400">{book.stock}</td>
      <td className="px-3 py-2 text-sm text-gray-400">{book.penerbit}</td>
      <td className="px-3 py-2">
        <TombolAksi
          onEdit={() => handleOpenEditModal(book)}
          onDelete={() => bookService.deleteBook(book.id)}
          onRefresh={refresh}
        />
      </td>
    </tr>
  );

  const columns = [
    {
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        onChange={handleSelectAll}
        checked={books?.length > 0 && selectedBooks.length === books.length}
      />
    },
    { header: 'Info Buku' },
    { header: 'ISBN' },
    { header: 'Kategori' },
    { header: 'Stok' },
    { header: 'Penerbit' },
    { header: 'Aksi' }
  ];

  return (
    <div className="pt-16">
      <PageHeader
        title="Data Buku"
        subtitle="Pengelolaan koleksi buku perpustakaan BooKoo"
        buttonLabel="Tambah Buku"
        onButtonClick={handleOpenCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Search books..."
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
          data={books}
          renderRow={renderBookRow}
          totalEntries={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          entriesPerPage={10}
        />
      )}

      {isModalOpen && (
        <FormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedBook}
          formConfig={bookFormConfig}
          apiConfig={API_CONFIG}
        />
      )}
    </div>
  );
};

export default DataBuku;