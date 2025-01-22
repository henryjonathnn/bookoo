import React, { useState, useEffect } from 'react';
import { BookOpen } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import api from '../../services/api';
import Dialog from '../../components/ui/admin/Dialog';
import Button from '../../components/ui/admin/Button';
import Input from '../../components/ui/admin/Input';
import Label from '../../components/ui/admin/Label';
import { toast } from 'react-hot-toast';

const DataBuku = () => {
  // Initialize states with proper database column names
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    penulis: '',
    isbn: '',
    kategori: '',
    deskripsi: '',
    stock: '',
    denda_harian: '',
    penerbit: '',
    tahun_terbit: '',
  });

  const fetchBooks = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await api.get('/buku', {
        params: {
          page,
          limit: 10,
          search,
        },
      });
      
      setBooks(response.data?.rows || []);
      setTotalItems(response.data?.count || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBooks([]);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked && books.length > 0) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentBook(null);
    setFormData({
      judul: '',
      penulis: '',
      isbn: '',
      kategori: '',
      deskripsi: '',
      stock: '',
      denda_harian: '',
      penerbit: '',
      tahun_terbit: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setModalMode('edit');
    setCurrentBook(book);
    setFormData({
      judul: book.judul || '',
      penulis: book.penulis || '',
      isbn: book.isbn || '',
      kategori: book.kategori || '',
      deskripsi: book.deskripsi || '',
      stock: book.stock || '',
      denda_harian: book.denda_harian || '',
      penerbit: book.penerbit || '',
      tahun_terbit: book.tahun_terbit || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formDataObj.append(key, value);
      }
    });
    
    if (e.target.cover_img?.files?.[0]) {
      formDataObj.append('cover_img', e.target.cover_img.files[0]);
    }

    try {
      if (modalMode === 'create') {
        await api.post('/buku', formDataObj);
        toast.success('Book created successfully');
      } else if (currentBook?.id) {
        await api.patch(`/buku/${currentBook.id}`, formDataObj);
        toast.success('Book updated successfully');
      }
      setIsModalOpen(false);
      fetchBooks(currentPage, searchQuery);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Operation failed');
    }
  };

  const columns = [
    {
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        onChange={handleSelectAll}
        checked={books.length > 0 && selectedBooks.length === books.length}
      />
    },
    { header: 'Book Info' },
    { header: 'ISBN' },
    { header: 'Category' },
    { header: 'Stock' },
    { header: 'Publisher' },
    { header: 'Actions' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(value);
  };

  const renderBookRow = (book) => (
    <tr key={book.id} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedBooks.includes(book.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBooks([...selectedBooks, book.id]);
            } else {
              setSelectedBooks(selectedBooks.filter(id => id !== book.id));
            }
          }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
            {book.cover_img ? (
              <img
                src={book.cover_img}
                alt={book.judul}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{book.judul || 'Untitled'}</h3>
            <p className="text-sm text-gray-400">{book.penulis || 'Unknown Author'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {book.isbn || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
          {book.kategori || 'Uncategorized'}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {book.stock || 0}
      </td>
      <td className="px-6 py-4 text-gray-400">
        {book.penerbit || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <TombolAksi onEdit={() => openEditModal(book)} />
      </td>
    </tr>
  );

  return (
    <div className="pt-16">
      <PageHeader
        title="Books Management"
        subtitle="Manage and organize your library's book collection"
        buttonLabel="Add New Book"
        onButtonClick={openCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Search books..."
        onSearch={handleSearch}
        initialValue={searchQuery}
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
          totalPages={Math.ceil(totalItems / 10)}
          onPageChange={handlePageChange}
          entriesPerPage={10}
        />
      )}

      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {modalMode === 'create' ? 'Add New Book' : 'Edit Book'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="judul">Title</Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="penulis">Author</Label>
                  <Input
                    id="penulis"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="kategori">Category</Label>
                  <Input
                    id="kategori"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deskripsi">Description</Label>
                  <Input
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="denda_harian">Daily Fine</Label>
                  <Input
                    id="denda_harian"
                    type="number"
                    value={formData.denda_harian}
                    onChange={(e) => setFormData({ ...formData, denda_harian: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="penerbit">Publisher</Label>
                  <Input
                    id="penerbit"
                    value={formData.penerbit}
                    onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tahun_terbit">Publication Year</Label>
                  <Input
                    id="tahun_terbit"
                    value={formData.tahun_terbit}
                    onChange={(e) => setFormData({ ...formData, tahun_terbit: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cover_img">Cover Image</Label>
                  <Input
                    id="cover_img"
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default DataBuku;