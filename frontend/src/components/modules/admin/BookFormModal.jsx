import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'react-feather';

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const BOOK_CATEGORIES = [
    'FIKSI', 'NON-FIKSI', 'SAINS', 'TEKNOLOGI', 'SEJARAH', 'SASTRA', 'KOMIK', 'LAINNYA'
  ];
  const [preview, setPreview] = useState('');
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
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        judul: initialData?.judul || '',
        penulis: initialData?.penulis || '',
        isbn: initialData?.isbn || '',
        kategori: initialData?.kategori || '',
        deskripsi: initialData?.deskripsi || '',
        stock: initialData?.stock || '',
        denda_harian: initialData?.denda_harian || '',
        penerbit: initialData?.penerbit || '',
        tahun_terbit: initialData?.tahun_terbit || '',
      });
      setPreview(initialData?.cover_img || '');
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAlert({
          type: 'error',
          message: 'Ukuran gambar tidak boleh melebihi 2MB'
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setAlert({
          type: 'error',
          message: 'Hanya file JPG, JPEG & PNG yang diizinkan'
        });
        return;
      }
      setAlert(null);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') {
        formDataObj.append(key, value);
      }
    });

    const imageFile = e.target.cover_img.files[0];
    if (imageFile) {
      formDataObj.append('cover_img', imageFile);
    }

    try {
      await onSubmit(formDataObj);
      setAlert({
        type: 'success',
        message: initialData ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!'
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0a19] rounded-lg shadow-xl">
        <div className="sticky top-0 flex items-center justify-between p-6 bg-[#0f0a19] border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Buku' : 'Tambah Buku Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {alert && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                alert.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {alert.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() => setAlert(null)}
                className="ml-auto hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Cover Buku</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-40 bg-gray-800 rounded-lg overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Tidak ada gambar
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="cover_img"
                    name="cover_img"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    Format yang diizinkan: JPG, JPEG, PNG. Ukuran maksimal: 2MB
                  </p>
                </div>
              </div>
            </div>

            {[
              { id: 'judul', label: 'Judul', required: true },
              { id: 'penulis', label: 'Penulis', required: true },
              { id: 'isbn', label: 'ISBN', required: true },
              {
                id: 'kategori',
                label: 'Kategori',
                required: true,
                component: (
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {BOOK_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                )
              },
              { id: 'deskripsi', label: 'Deskripsi', required: false },
              { id: 'stock', label: 'Stok', type: 'number', required: true },
              { id: 'denda_harian', label: 'Denda Harian', type: 'number', required: true },
              { id: 'penerbit', label: 'Penerbit', required: true },
              { id: 'tahun_terbit', label: 'Tahun Terbit', required: true }
            ].map(({ id, label, type = 'text', required, component }) => (
              <div key={id} className="flex flex-col gap-2">
                <label htmlFor={id} className="font-medium">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {component || (
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                    required={required}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
            >
              {initialData ? 'Perbarui Buku' : 'Tambah Buku'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;