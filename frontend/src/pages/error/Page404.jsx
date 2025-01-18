import React from "react";
import ErrorPage from "../../components/modules/error/ErrorPage";

const Page404 = () => {
  return (
    <ErrorPage 
      code="404"
      title="Halaman yang kamu cari tidak ditemukan"
      description="Mungkin halaman ini telah dipindahkan atau dihapus. Kamu bisa kembali ke beranda."
      // Menggunakan default purple gradient
    />
  );
};

export default Page404;