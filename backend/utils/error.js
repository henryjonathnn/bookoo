export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const handleApiError = (error) => {
  if (error.response) {
    // Kesalahan dari response server
    return error.response.data.message || 'Terjadi kesalahan pada server';
  } else if (error.request) {
    // Kesalahan tidak ada response
    return 'Tidak dapat terhubung ke server';
  } else {
    // Kesalahan lainnya
    return error.message || 'Terjadi kesalahan';
  }
}; 