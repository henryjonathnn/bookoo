import React from "react";
import ErrorPage from "../../components/modules/error/ErrorPage";

const Page403 = () => {
  return (
    <ErrorPage 
      code="403"
      title="Akses Tidak Diizinkan"
      description="Maaf, kamu tidak memiliki izin untuk mengakses halaman ini. Silakan login atau hubungi administrator jika kamu merasa ini adalah kesalahan."
      primaryButtonText="Kembali ke beranda"
      primaryButtonLink="/"
      gradientFrom="red-400"
      gradientVia="rose-300"
      gradientTo="red-400"
      glowFrom="red-500"
      glowVia="rose-500"
      glowTo="red-500"
      buttonBgColor="red-600"
      buttonHoverColor="red-500"
    />
  );
};

export default Page403;