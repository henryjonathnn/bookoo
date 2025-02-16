export const handleApiError = (error) => {
  if (error.response) {
    // Error dari response server
    const message = error.response.data?.message || 
                   error.response.data?.msg || 
                   'Terjadi kesalahan pada server';
    
    switch (error.response.status) {
      case 400:
        return `${message}`;
      case 401:
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki akses ke fitur ini.';
      case 404:
        return 'Data tidak ditemukan.';
      case 422:
        return `${message}`;
      case 429:
        return 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
      default:
        return message;
    }
  } 
  
  if (error.request) {
    // Error karena tidak ada response (network error)
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }
  
  // Error lainnya
  return error.message || 'Terjadi kesalahan yang tidak diketahui.';
};