import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = {
  pending: '#3b82f6',    // blue
  dipinjam: '#8b5cf6',   // purple
  dikembalikan: '#22c55e', // green
  terlambat: '#ef4444',  // red
  categories: [
    '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', 
    '#10b981', '#6366f1', '#f43f5e', '#84cc16',
    '#14b8a6', '#a855f7', '#22c55e', '#eab308'
  ]
};

const DashboardCharts = ({ peminjaman, books, dateRange }) => {
  const chartData = useMemo(() => {
    if (!peminjaman?.length) return { status: [], categories: [], daily: [] };

    // Filter peminjaman berdasarkan dateRange
    const filteredPeminjaman = peminjaman.filter(p => {
      const date = new Date(p.createdAt);
      return date >= dateRange.startDate && date <= dateRange.endDate;
    });

    // Data harian
    const dailyMap = new Map();
    let currentDate = new Date(dateRange.startDate);
    while (currentDate <= dateRange.endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyMap.set(dateStr, { date: dateStr, total: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    filteredPeminjaman.forEach(p => {
      const dateStr = new Date(p.createdAt).toISOString().split('T')[0];
      if (dailyMap.has(dateStr)) {
        dailyMap.get(dateStr).total++;
      }
    });

    const dailyData = Array.from(dailyMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Data status peminjaman
    const statusCount = {
      PENDING: 0,
      DIPINJAM: 0,
      DIKEMBALIKAN: 0,
      TERLAMBAT: 0
    };
    filteredPeminjaman.forEach(p => statusCount[p.status]++);

    const statusData = [
      { name: 'Pending', value: statusCount.PENDING, color: COLORS.pending },
      { name: 'Dipinjam', value: statusCount.DIPINJAM, color: COLORS.dipinjam },
      { name: 'Dikembalikan', value: statusCount.DIKEMBALIKAN, color: COLORS.dikembalikan },
      { name: 'Terlambat', value: statusCount.TERLAMBAT, color: COLORS.terlambat }
    ].filter(item => item.value > 0); // Hanya tampilkan yang ada nilainya

    // Data kategori buku yang dipinjam
    const categoryCount = {};
    filteredPeminjaman.forEach(p => {
      const book = books.find(b => b.id === p.id_buku);
      if (book?.kategori) {
        categoryCount[book.kategori] = (categoryCount[book.kategori] || 0) + 1;
      }
    });

    const categoryData = Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Batasi hanya 8 kategori teratas

    return { status: statusData, categories: categoryData, daily: dailyData };
  }, [peminjaman, books, dateRange]);

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1625] border border-slate-700 rounded-lg p-3">
          <p className="font-medium text-sm mb-1">{data.name}</p>
          <p className="text-sm text-gray-300">
            Jumlah: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1625] border border-slate-700 rounded-lg p-3">
          <p className="font-medium text-sm mb-1">
            {new Date(label).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-gray-300">
            Total Peminjaman: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return null; // Tidak menampilkan label, hanya muncul saat hover
  };

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      {/* Trend Peminjaman Harian */}
      <div className="bg-[#2a2438] p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Trend Peminjaman Harian</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="date" 
              stroke="#999"
              tickFormatter={(date) => {
                return new Date(date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short'
                });
              }}
            />
            <YAxis stroke="#999" />
            <Tooltip content={<CustomLineTooltip />} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6, fill: '#a855f7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid untuk Pie dan Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Peminjaman (Pie Chart) */}
        <div className="bg-[#2a2438] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Status Peminjaman</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.status}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.status.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => `${value} (${entry.payload.value})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Kategori Buku (Donut Chart) */}
        <div className="bg-[#2a2438] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Peminjaman per Kategori</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.categories.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS.categories[index % COLORS.categories.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => `${value} (${entry.payload.value})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 