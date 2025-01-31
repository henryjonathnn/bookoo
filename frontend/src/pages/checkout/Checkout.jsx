import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Truck, Home, Calendar } from 'react-feather';
import { usePeminjaman } from '../../hooks/usePeminjaman';
import { API_CONFIG } from '../../config/api.config';
import { useAuth } from '../../contexts/AuthContext';
import { bookService } from '../../services/bookService';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Checkout = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPeminjaman, loading } = usePeminjaman();
  const [book, setBook] = useState(location.state?.book || null);
  const [formData, setFormData] = useState({
    alamat_pengiriman: '',
    metode_pengiriman: 'KURIR',
    tgl_peminjaman_diinginkan: new Date().toISOString().split('T')[0],
    catatan_pengiriman: ''
  });

  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('bookId');

  useEffect(() => {
    const fetchBookData = async () => {
      if (!orderId || !bookId) {
        console.error('Missing required parameters');
        navigate('/');
        return;
      }

      try {
        // Jika tidak ada data buku dari state, ambil dari API
        if (!book) {
          setLoading(true);
          const bookData = await bookService.getBookById(bookId);
          setBook(bookData);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Gagal memuat data buku');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [orderId, bookId, book, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!book) return;

    try {
      await createPeminjaman({
        id_buku: book.id,
        ...formData
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!book) return null;

  // Calculate min and max dates for the date picker
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen text-gray-100 p-4 mt-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Konfirmasi Peminjaman
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A2E] rounded-xl overflow-hidden shadow-lg shadow-purple-900/10">
              <div className="relative group">
                <img
                  src={`${API_CONFIG.baseURL}${book.cover_img}`}
                  alt={book.judul}
                  className="w-full h-[280px] object-cover"
                />
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold">{book.judul}</h2>
                <p className="text-purple-400 text-sm">by {book.penulis}</p>
                <div className="text-sm text-gray-400">
                  <p>Durasi Peminjaman: 7 hari</p>
                  <p>Kategori: {book.kategori}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Info Section */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Informasi Peminjam</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Nama: {user.name}</p>
                  <p>Email: {user.email}</p>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Metode Pengiriman</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-[#2A2A3E]">
                    <input
                      type="radio"
                      name="metode_pengiriman"
                      value="KURIR"
                      checked={formData.metode_pengiriman === 'KURIR'}
                      onChange={(e) => setFormData({...formData, metode_pengiriman: e.target.value})}
                      className="hidden"
                    />
                    <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center">
                      {formData.metode_pengiriman === 'KURIR' && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>Kurir</span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-[#2A2A3E]">
                    <input
                      type="radio"
                      name="metode_pengiriman"
                      value="AMBIL_DI_TEMPAT"
                      checked={formData.metode_pengiriman === 'AMBIL_DI_TEMPAT'}
                      onChange={(e) => setFormData({...formData, metode_pengiriman: e.target.value})}
                      className="hidden"
                    />
                    <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center">
                      {formData.metode_pengiriman === 'AMBIL_DI_TEMPAT' && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <Home className="w-4 h-4 text-purple-400" />
                    <span>Ambil di Tempat</span>
                  </label>
                </div>
              </div>

              {/* Borrowing Date */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Tanggal Peminjaman</h3>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="date"
                    value={formData.tgl_peminjaman_diinginkan}
                    onChange={(e) => setFormData({...formData, tgl_peminjaman_diinginkan: e.target.value})}
                    min={today}
                    max={maxDateString}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  * Peminjaman dapat dilakukan maksimal 30 hari ke depan
                </p>
              </div>

              {/* Address */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">
                  {formData.metode_pengiriman === 'KURIR' ? 'Alamat Pengiriman' : 'Alamat Pengambilan'}
                </h3>
                <textarea
                  value={formData.alamat_pengiriman}
                  onChange={(e) => setFormData({...formData, alamat_pengiriman: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none"
                  rows="3"
                  placeholder={formData.metode_pengiriman === 'KURIR' ? 
                    "Masukkan alamat lengkap pengiriman" : 
                    "Masukkan alamat tempat pengambilan"
                  }
                  required
                />
              </div>

              {/* Notes */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Catatan Pengiriman</h3>
                <textarea
                  value={formData.catatan_pengiriman}
                  onChange={(e) => setFormData({...formData, catatan_pengiriman: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none"
                  rows="2"
                  placeholder="Catatan tambahan untuk pengiriman/pengambilan (opsional)"
                />
              </div>

              {/* Return Date Info */}
              <div className="bg-[#1A1A2E] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-2">Informasi Pengembalian</h3>
                <p className="text-sm text-gray-400">
                  Buku harus dikembalikan dalam waktu 7 hari setelah tanggal peminjaman.
                  {formData.tgl_peminjaman_diinginkan && (
                    <>
                      <br />
                      Tanggal pengembalian: {
                        new Date(new Date(formData.tgl_peminjaman_diinginkan).getTime() + (7 * 24 * 60 * 60 * 1000))
                          .toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                      }
                    </>
                  )}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Peminjaman'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;