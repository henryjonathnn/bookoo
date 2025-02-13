import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BookOpen, Users, UserPlus, Star, Award
} from 'react-feather';

export const LibraryStatsOverview = React.memo(({ books, users, totalCategories, totalPeminjaman }) => {
  const libraryStats = useMemo(() => {
    const stats = {
      totalBooks: Array.isArray(books) ? books.length : 0,
      totalMembers: Array.isArray(users) ? users.filter(user => user.role === 'USER').length : 0,
      totalCategories: totalCategories || 0,
      totalStaff: Array.isArray(users) ? users.filter(user => user.role === 'STAFF').length : 0,
      totalDipinjam: totalPeminjaman || 0,
      averageRating: 0
    };

    if (Array.isArray(books) && books.length > 0) {
      const validRatings = books.filter(book => book.rating > 0);
      if (validRatings.length > 0) {
        stats.averageRating = (
          validRatings.reduce((sum, book) => sum + book.rating, 0) / validRatings.length
        ).toFixed(1);
      }
    }

    return stats;
  }, [books, users, totalCategories, totalPeminjaman]);

  const StatCard = React.memo(({ icon: Icon, value, label, iconColor }) => (
    <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
      <Icon className={`${iconColor} mb-2`} size={24} />
      <span className="text-2xl font-bold text-white">{value.toLocaleString()}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  ));

  return (
    <div className="bg-[#2a2438] rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Ringkasan Perpustakaan</h2>
        <span className="text-sm text-gray-400">
          Terakhir diupdate: {new Date().toLocaleDateString()}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={BookOpen}
          value={libraryStats.totalBooks}
          label="Total Buku"
          iconColor="text-purple-500"
        />
        <StatCard
          icon={Users}
          value={libraryStats.totalMembers}
          label="Total Anggota"
          iconColor="text-blue-500"
        />
        <StatCard
          icon={UserPlus}
          value={libraryStats.totalStaff}
          label="Total Staff"
          iconColor="text-green-500"
        />
        <StatCard
          icon={BookOpen}
          value={libraryStats.totalDipinjam}
          label="Total Dipinjam"
          iconColor="text-yellow-500"
        />
        <StatCard
          icon={Star}
          value={Number(libraryStats.averageRating)}
          label="Rating Rata-rata"
          iconColor="text-amber-500"
        />
        <StatCard
          icon={Award}
          value={libraryStats.totalCategories}
          label="Total Kategori"
          iconColor="text-indigo-500"
        />
      </div>
    </div>
  );
});