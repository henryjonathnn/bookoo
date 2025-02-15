import React, { useMemo } from 'react';
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
          start.setDate(start.getDate() - 30);
          break;
        default:
          start = startOfToday;
      }
      return { start, end };
    };

    const currentRange = getTimeRange();
    const prevRange = {
      start: new Date(currentRange.start),
      end: new Date(currentRange.start)
    };
    prevRange.start.setDate(prevRange.start.getDate() - (selectedPeriod === 'today' ? 1 : selectedPeriod === 'week' ? 7 : 30));

    // Fungsi untuk mengecek apakah tanggal berada dalam rentang
    const isInRange = (date, range) => {
      const checkDate = new Date(date);
      return checkDate >= range.start && checkDate <= range.end;
    };

    // Fungsi untuk menghitung data berdasarkan status dan rentang waktu
    const countByStatusAndRange = (status, range, includeActive = false) => {
      return peminjaman.filter(p => {
        const peminjamanDate = new Date(p.createdAt);
        if (includeActive) {
          // Untuk peminjaman aktif dan terlambat, cek status saat ini
          return p.status === status;
        } else {
          // Untuk request dan pengembalian, cek dalam rentang waktu
          return p.status === status && isInRange(peminjamanDate, range);
        }
      }).length;
    };

    // Hitung statistik untuk periode saat ini
    const currentPending = countByStatusAndRange('PENDING', currentRange);
    const currentActive = countByStatusAndRange('DIPINJAM', currentRange, true);
    const currentReturned = countByStatusAndRange('DIKEMBALIKAN', currentRange);
    const currentOverdue = countByStatusAndRange('TERLAMBAT', currentRange, true);

    // Hitung statistik untuk periode sebelumnya
    const prevPending = countByStatusAndRange('PENDING', prevRange);
    const prevActive = countByStatusAndRange('DIPINJAM', prevRange, true);
    const prevReturned = countByStatusAndRange('DIKEMBALIKAN', prevRange);
    const prevOverdue = countByStatusAndRange('TERLAMBAT', prevRange, true);

    // Fungsi untuk menghitung perubahan persentase
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const periodText = selectedPeriod === 'today' 
      ? 'hari ini' 
      : selectedPeriod === 'week' 
        ? 'minggu ini' 
        : 'bulan ini';

    return [
      {
        title: "Request Peminjaman",
        value: currentPending,
        change: calculateChange(currentPending, prevPending),
        icon: <Send className="text-blue-500" />,
        bgColor: "bg-blue-500/10",
        trend: currentPending >= prevPending ? 'up' : 'down',
        description: `Permintaan peminjaman baru ${periodText}`
      },
      {
        title: "Peminjaman Aktif",
        value: currentActive,
        change: calculateChange(currentActive, prevActive),
        icon: <Bookmark className="text-purple-500" />,
        bgColor: "bg-purple-500/10",
        trend: currentActive >= prevActive ? 'up' : 'down',
        description: `Total peminjaman yang sedang berlangsung ${periodText}`
      },
      {
        title: "Pengembalian",
        value: currentReturned,
        change: calculateChange(currentReturned, prevReturned),
        icon: <Activity className="text-green-500" />,
        bgColor: "bg-green-500/10",
        trend: currentReturned >= prevReturned ? 'up' : 'down',
        description: `Buku yang dikembalikan ${periodText}`
      },
      {
        title: "Keterlambatan",
        value: currentOverdue,
        change: calculateChange(currentOverdue, prevOverdue),
        icon: <Clock className="text-red-500" />,
        bgColor: "bg-red-500/10",
        trend: currentOverdue <= prevOverdue ? 'up' : 'down',
        description: `Total peminjaman yang melewati tenggat waktu ${periodText}`
      }
    ];
  }, [peminjaman, selectedPeriod]);
};

const FilterableStatsGrid = React.memo(({ peminjaman, selectedPeriod }) => {
  const renderTrendIcon = React.useCallback((trend) => {
    return trend === 'up' ?
      <ArrowUp className="text-green-500 inline ml-1" size={16} /> :
      <ArrowDown className="text-red-500 inline ml-1" size={16} />;
  }, []);

  const stats = useFilterableStats(peminjaman, selectedPeriod);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          stat={stat} 
          renderTrendIcon={renderTrendIcon}
        />
      ))}
    </div>
  );
});

export default FilterableStatsGrid;