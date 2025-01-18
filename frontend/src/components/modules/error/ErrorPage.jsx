import React from "react";
import { ArrowLeft } from "react-feather";

const ErrorPage = ({
  code = "404",
  title = "Halaman tidak ditemukan",
  description = "Mungkin halaman ini telah dipindahkan atau dihapus.",
  primaryButtonText = "Kembali ke Beranda",
  primaryButtonLink = "/",
  gradientFrom = "purple-400",
  gradientVia = "fuchsia-300",
  gradientTo = "indigo-400",
  glowFrom = "purple-500",
  glowVia = "fuchsia-500",
  glowTo = "indigo-500",
  buttonBgColor = "purple-600",
  buttonHoverColor = "purple-500",
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D1A] text-white px-6">
      <main className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-3xl mx-auto">
          {/* Error Code Header */}
          <div className="mb-12">
            <h1 
              className={`text-[140px] font-bold leading-none tracking-tight bg-gradient-to-r from-${gradientFrom} via-${gradientVia} to-${gradientTo} bg-clip-text text-transparent inline-block`}
            >
              {code}
            </h1>
          </div>

          {/* Description */}
          <div className="relative mb-12">
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-${glowFrom}/20 via-${glowVia}/20 to-${glowTo}/20 blur-3xl`}
            ></div>
            <h2 className="relative text-2xl md:text-3xl font-light mb-6 tracking-wide">
              {title}
            </h2>
            <p className="relative text-gray-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
          </div>

          {/* Navigation Button */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <a
              href={primaryButtonLink}
              className={`flex items-center px-6 py-3 rounded-lg bg-${buttonBgColor} hover:bg-${buttonHoverColor} text-white font-medium text-lg shadow-md transition`}
            >
              <ArrowLeft className="mr-2" />
              {primaryButtonText}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;