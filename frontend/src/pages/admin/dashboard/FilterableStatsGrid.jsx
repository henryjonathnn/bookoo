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
    if (!peminjaman) return [];

    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.setDate(today.getDate() - 30));

    const filterByDate = (items, startDate) => {
      return items.filter(item => new Date(item.created_at) >= startDate);
    };

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    // Filter data based on selected period
    const periodData = {
      today: filterByDate(peminjaman, new Date().setHours(0, 0, 0, 0)),
      week: filterByDate(peminjaman, startOfWeek),
      month: filterByDate(peminjaman, startOfMonth)
    }[selectedPeriod];

    // Calculate previous period data for comparison
    const previousPeriodData = {
      today: filterByDate(peminjaman, new Date(new Date().setDate(new Date().getDate() - 1))),
      week: filterByDate(peminjaman, new Date(startOfWeek.setDate(startOfWeek.getDate() - 7))),
      month: filterByDate(peminjaman, new Date(startOfMonth.setDate(startOfMonth.getDate() - 30)))
    }[selectedPeriod];

    // Calculate stats
    const requestPeminjaman = periodData.filter(p => p.status === 'PENDING').length;
    const previousRequestPeminjaman = previousPeriodData.filter(p => p.status === 'PENDING').length;

    const peminjamanAktif = periodData.filter(p => p.status === 'DIPINJAM').length;
    const previousPeminjamanAktif = previousPeriodData.filter(p => p.status === 'DIPINJAM').length;

    const pengembalianHariIni = periodData.filter(p => p.status === 'SELESAI').length;
    const previousPengembalian = previousPeriodData.filter(p => p.status === 'SELESAI').length;

    const keterlambatan = periodData.filter(p => {
      const dueDate = new Date(p.tgl_kembali);
      return p.status === 'DIPINJAM' && dueDate < new Date();
    }).length;
    const previousKeterlambatan = previousPeriodData.filter(p => {
      const dueDate = new Date(p.tgl_kembali);
      return p.status === 'DIPINJAM' && dueDate < new Date();
    }).length;

    return [
      {
        title: "Request Peminjaman",
        value: requestPeminjaman,
        change: calculateChange(requestPeminjaman, previousRequestPeminjaman),
        icon: <Send className="text-blue-500" />,
        bgColor: "bg-blue-500/10",
        trend: requestPeminjaman >= previousRequestPeminjaman ? 'up' : 'down',
        description: "Jumlah permintaan peminjaman yang belum disetujui"
      },
      {
        title: "Peminjaman Aktif",
        value: peminjamanAktif,
        change: calculateChange(peminjamanAktif, previousPeminjamanAktif),
        icon: <Bookmark className="text-purple-500" />,
        bgColor: "bg-purple-500/10",
        trend: peminjamanAktif >= previousPeminjamanAktif ? 'up' : 'down',
        description: "Total peminjaman yang sedang berlangsung"
      },
      {
        title: "Pengembalian Hari Ini",
        value: pengembalianHariIni,
        change: calculateChange(pengembalianHariIni, previousPengembalian),
        icon: <Activity className="text-green-500" />,
        bgColor: "bg-green-500/10",
        trend: pengembalianHariIni >= previousPengembalian ? 'up' : 'down',
        description: "Buku yang dikembalikan hari ini"
      },
      {
        title: "Keterlambatan",
        value: keterlambatan,
        change: calculateChange(keterlambatan, previousKeterlambatan),
        icon: <Clock className="text-red-500" />,
        bgColor: "bg-red-500/10",
        trend: keterlambatan <= previousKeterlambatan ? 'up' : 'down',
        description: "Peminjaman yang melewati tenggat waktu"
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