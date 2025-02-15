import React, { useMemo, useState } from 'react';
import { Send, Bookmark, Activity, Clock, ArrowUp, ArrowDown } from 'react-feather';
import { Card, CardContent } from "../../../components/ui/admin/Card";

const StatCard = React.memo(({ stat, renderTrendIcon }) => (
  <Card className="bg-[#2a2438] border-0 transition-all duration-200 hover:bg-[#362f47]">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          {stat.icon}
        </div>
        <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {stat.change} {renderTrendIcon(stat.trend)}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
      <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
      <p className="text-sm text-gray-400">{stat.description}</p>
    </CardContent>
  </Card>
));

const useFilterableStats = (peminjaman, selectedPeriod) => {
  return useMemo(() => {
    if (!peminjaman || peminjaman.length === 0) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Fungsi untuk mendapatkan rentang waktu berdasarkan periode
    const getTimeRange = () => {
      const end = new Date();
      let start = new Date();

      switch (selectedPeriod) {
        case 'today':
          start = startOfToday;
          break;
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth(), 1); // Awal bulan ini
          break;
        default:
          start = startOfToday;
      }
      return { start, end };
    };

    const timeRange = getTimeRange();

    // Fungsi untuk mengecek apakah tanggal berada dalam rentang
    const isInRange = (date) => {
      const checkDate = new Date(date);
      return checkDate >= timeRange.start && checkDate <= timeRange.end;
    };

    // Fungsi untuk menghitung status berdasarkan kondisi
    const countByStatus = (status, requireInRange = false) => {
      return peminjaman.filter(p => {
        const peminjamanDate = new Date(p.createdAt);
        
        // Untuk status yang perlu dicek dalam rentang waktu
        if (requireInRange) {
          return p.status === status && isInRange(peminjamanDate);
        }
        
        // Untuk status yang perlu dicek kondisi saat ini (masih aktif)
        return p.status === status && peminjamanDate <= timeRange.end;
      }).length;
    };

    // Hitung statistik berdasarkan status
    const pendingCount = countByStatus('PENDING'); // Yang masih pending sampai saat ini
    const activeCount = countByStatus('DIPINJAM'); // Yang masih dipinjam sampai saat ini
    const returnedCount = countByStatus('DIKEMBALIKAN', true); // Yang dikembalikan dalam periode
    const overdueCount = countByStatus('TERLAMBAT'); // Yang masih terlambat sampai saat ini

    const periodText = selectedPeriod === 'today' 
      ? 'hari ini' 
      : selectedPeriod === 'week' 
        ? '7 hari terakhir' 
        : 'bulan ini';

    return [
      {
        title: "Request Peminjaman",
        value: pendingCount,
        change: "0%", // Bisa dihitung perubahan jika diperlukan
        icon: <Send className="text-blue-500" />,
        bgColor: "bg-blue-500/10",
        trend: 'up',
        description: `Total permintaan peminjaman yang masih pending ${periodText}`
      },
      {
        title: "Peminjaman Aktif",
        value: activeCount,
        change: "0%",
        icon: <Bookmark className="text-purple-500" />,
        bgColor: "bg-purple-500/10",
        trend: 'up',
        description: `Total peminjaman yang sedang berlangsung ${periodText}`
      },
      {
        title: "Pengembalian",
        value: returnedCount,
        change: "0%",
        icon: <Activity className="text-green-500" />,
        bgColor: "bg-green-500/10",
        trend: 'up',
        description: `Buku yang dikembalikan ${periodText}`
      },
      {
        title: "Keterlambatan",
        value: overdueCount,
        change: "0%",
        icon: <Clock className="text-red-500" />,
        bgColor: "bg-red-500/10",
        trend: 'down',
        description: `Total peminjaman yang masih terlambat ${periodText}`
      }
    ];
  }, [peminjaman, selectedPeriod]);
};

const FilterableStatsGrid = React.memo(({ peminjaman, selectedPeriod }) => {
  const [activePeriod, setActivePeriod] = useState('month'); // Default ke bulan ini
  const renderTrendIcon = React.useCallback((trend) => {
    return trend === 'up' ?
      <ArrowUp className="text-green-500 inline ml-1" size={16} /> :
      <ArrowDown className="text-red-500 inline ml-1" size={16} />;
  }, []);

  const stats = useFilterableStats(peminjaman, activePeriod);

  return (
    <div className="space-y-6">
      {/* Period Tabs */}
      <div className="flex gap-2 bg-[#2a2438] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActivePeriod('today')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activePeriod === 'today'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#362f47]'
          }`}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setActivePeriod('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activePeriod === 'week'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#362f47]'
          }`}
        >
          Minggu Ini
        </button>
        <button
          onClick={() => setActivePeriod('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activePeriod === 'month'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#362f47]'
          }`}
        >
          Bulan Ini
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            stat={stat} 
            renderTrendIcon={renderTrendIcon}
          />
        ))}
      </div>
    </div>
  );
});

export default FilterableStatsGrid;