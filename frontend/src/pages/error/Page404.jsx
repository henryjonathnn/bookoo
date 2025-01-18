import React from "react";
import { ArrowLeft, Search } from "react-feather";

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D1A] text-white px-6">
      <main className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-3xl mx-auto">
          {/* Header 404 */}
          <div className="mb-12">
            <h1 className="text-[140px] font-bold leading-none tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent inline-block">
              404
            </h1>
          </div>

          {/* Deskripsi */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-3xl"></div>
            <h2 className="relative text-2xl md:text-3xl font-light mb-6 tracking-wide">
              Halaman yang kamu cari tidak ditemukan
            </h2>
            <p className="relative text-gray-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              Mungkin halaman ini telah dipindahkan atau dihapus.
              Kamu bisa kembali ke beranda.
            </p>
          </div>

          {/* Tombol Navigasi */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Tombol Beranda */}
            <a
              href="/"
              className="flex items-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-lg shadow-md transition"
            >
              <ArrowLeft className="mr-2" />
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page404;
