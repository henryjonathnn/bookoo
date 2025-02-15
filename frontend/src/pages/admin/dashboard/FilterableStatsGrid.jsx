import React, { useMemo, useState } from 'react';
import { Send, Bookmark, Activity, Clock, ArrowUp, ArrowDown, BookOpen, CheckCircle, AlertCircle } from 'react-feather';
import { Card, CardContent } from "../../../components/ui/admin/Card";

const StatCard = React.memo(({ stat }) => {
  return (
    <div className={`p-4 rounded-lg ${stat.bgColor} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{stat.name}</p>
          <h4 className="text-2xl font-semibold mt-1">{stat.value}</h4>
        </div>
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          {stat.icon}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
    </div>
  );
});

const useFilterableStats = (peminjaman, selectedPeriod) => {
  return useMemo(() => {
    // Selalu kembalikan array stats meskipun tidak ada data
    const periodText = selectedPeriod === 'today' ? 'hari ini' 
      : selectedPeriod === 'week' ? 'minggu ini' 
      : 'bulan ini';

    return [
      {
        name: "Request Peminjaman",
        value: peminjaman?.filter(p => p.status === "PENDING")?.length || 0,
        change: "0%",
        icon: <Clock className="text-blue-500" />,
        bgColor: "bg-blue-500/10",
        trend: 'neutral',
        description: `Total permintaan peminjaman yang masih pending ${periodText}`
      },
      {
        name: "Peminjaman Aktif",
        value: peminjaman?.filter(p => p.status === "DIPINJAM")?.length || 0,
        change: "0%",
        icon: <BookOpen className="text-purple-500" />,
        bgColor: "bg-purple-500/10",
        trend: 'neutral',
        description: `Total buku yang sedang dipinjam ${periodText}`
      },
      {
        name: "Pengembalian",
        value: peminjaman?.filter(p => p.status === "DIKEMBALIKAN")?.length || 0,
        change: "0%",
        icon: <CheckCircle className="text-green-500" />,
        bgColor: "bg-green-500/10",
        trend: 'neutral',
        description: `Total buku yang sudah dikembalikan ${periodText}`
      },
      {
        name: "Keterlambatan",
        value: peminjaman?.filter(p => p.status === "TERLAMBAT")?.length || 0,
        change: "0%",
        icon: <AlertCircle className="text-red-500" />,
        bgColor: "bg-red-500/10",
        trend: 'neutral',
        description: `Total peminjaman yang masih terlambat ${periodText}`
      }
    ];
  }, [peminjaman, selectedPeriod]);
};

const FilterableStatsGrid = React.memo(({ peminjaman, selectedPeriod }) => {
  const stats = useFilterableStats(peminjaman, selectedPeriod);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          stat={stat}
        />
      ))}
    </div>
  );
});

export default FilterableStatsGrid;