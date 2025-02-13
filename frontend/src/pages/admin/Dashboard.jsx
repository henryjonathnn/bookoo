import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BookOpen, Users, Bookmark, Award, Search, Bell,
  ArrowUp, ArrowDown, Download, RefreshCw, Menu, Clock,
  UserPlus, Star, Activity, Box, Gift,
  Grid,
  Send
} from 'react-feather';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card";
import Button from "../../components/ui/admin/Button";
import FilterPanel from '../../components/modules/admin/FilterPanel';
import CurrentDateTime from '../../components/modules/admin/CurrentDateTime';
import useWindowSize from '../../hooks/useWindowSize';
import { useBooks } from '../../hooks/useBook';
import { useUsers } from '../../hooks/useUsers';
import { usePeminjaman } from '../../hooks/usePeminjaman';
import { useBookCategories } from '../../hooks/useBookCategories';
import { peminjamanService } from '../../services/peminjamanService';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalPeminjaman, setTotalPeminjaman ] = useState(0)
  const { width } = useWindowSize();
  const isMobileView = width < 768;

    // Data fetching hooks
  const { books, loading: booksLoading, totalItems: totalBooks } = useBooks({ limit: 1000 });
  const { users, loading: usersLoading, totalItems: totalUsers } = useUsers({ limit: 1000 });
  const { totalCategories, loading: categoriesLoading } = useBookCategories();

  useEffect(() => {
    const fetchTotalPeminjaman = async () => {
      try {
        const response = await peminjamanService.getAllPeminjaman()
        setTotalPeminjaman(response.totalItems || 0)
      } catch (error) {
        console.error('Error fetching total peminjaman:', error)
        setTotalPeminjaman(0)
      }
    }
    fetchTotalPeminjaman()
  }, [])

  const libraryStats = useMemo(() => {
    if (!books?.length) return {
      totalBooks: 0,
      totalMembers: 0,
      totalCategories: 0,
      totalStaff: 0,
      totalDipinjam: 0,
      averageRating: 0
    };

    // Count books with status "DIPINJAM"
    const totalDipinjam = totalPeminjaman
    console.log()

    // Calculate average rating if available
    const validRatings = books.filter(book => book.rating > 0);
    const averageRating = validRatings.length > 0
      ? (validRatings.reduce((sum, book) => sum + book.rating, 0) / validRatings.length).toFixed(1)
      : 0;

    return {
      totalBooks: totalBooks || 0,
      totalMembers: users?.filter(user => user.role === 'USER').length || 0,
      totalCategories: totalCategories || 0,
      totalStaff: users?.filter(user => user.role === 'STAFF').length || 0,
      totalDipinjam,
      averageRating
    };
  }, [books, totalBooks, users, totalCategories]);

  // Memoized computations
  const bookStats = useMemo(() => {
    if (!books?.length) return { totalBooks: 0, activeBooks: 0, totalReviews: 0 };

    const activeBooks = books.filter(book => book.status === 'DIPINJAM').length;
    const totalReviews = books.reduce((acc, book) => acc + (book.reviews?.length || 0), 0);

    return { totalBooks, activeBooks, totalReviews };
  }, [books, totalBooks]);

  const userStats = useMemo(() => {
    if (!users?.length) return { totalMembers: 0, totalStaff: 0 };

    const members = users.filter(user => user.is_active && user.role === 'USER').length;
    const staff = users.filter(user => user.is_active && user.role === 'STAFF').length;

    return { totalMembers: members, totalStaff: staff };
  }, [users]);

  // Filterable statistics (main stats)
  const filterableStats = useMemo(() => [
    {
      title: "Request Peminjaman",
      value: 284,
      change: "+15.8%",
      icon: <Send className="text-blue-500" />,
      bgColor: "bg-blue-500/10",
      trend: 'up',
      description: "Jumlah permintaan peminjaman yang belum disetujui"
    },
    {
      title: "Peminjaman Aktif",
      value: 145,
      change: "+12.5%",
      icon: <Bookmark className="text-purple-500" />,
      bgColor: "bg-purple-500/10",
      trend: 'up',
      description: "Total peminjaman yang sedang berlangsung"
    },
    {
      title: "Pengembalian Hari Ini",
      value: 89,
      change: "+8.2%",
      icon: <Activity className="text-green-500" />,
      bgColor: "bg-green-500/10",
      trend: 'up',
      description: "Buku yang dikembalikan hari ini"
    },
    {
      title: "Keterlambatan",
      value: 12,
      change: "-3.1%",
      icon: <Clock className="text-red-500" />,
      bgColor: "bg-red-500/10",
      trend: 'down',
      description: "Peminjaman yang melewati tenggat waktu"
    }
  ], []);

    // Callbacks for user interactions
    const handleExport = useCallback(() => {
      const data = {
        books,
        users,
        stats: { books: bookStats, users: userStats }
      };
  
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard-data.json';
      a.click();
      URL.revokeObjectURL(url);
    }, [books, users, bookStats, userStats]);
  
    const handleFilterChange = useCallback((filters) => {
      console.log('Filters applied:', filters);
    }, []);

  const renderTrendIcon = useCallback((trend) => {
    return trend === 'up' ?
      <ArrowUp className="text-green-500 inline ml-1" size={16} /> :
      <ArrowDown className="text-red-500 inline ml-1" size={16} />;
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1625] p-6 mt-16">
          {/* Mobile Menu */}
      {isMobileView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex justify-between items-center mb-4"
        >
          <span>Menu</span>
          <Menu size={20} />
        </Button>
      )}

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aktivitas..."
              className="w-full pl-10 pr-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download size={16} /> Export
          </Button>
        </div>
        <FilterPanel onFilterChange={handleFilterChange} />
      </div>

      <div className='mb-6'>
      <CurrentDateTime />
      </div>
      {/* Perpustakaan Overview Panel - Static Data */}
      <div className="bg-[#2a2438] rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Ringkasan Perpustakaan</h2>
          <span className="text-sm text-gray-400">Terakhir diupdate: 12 Feb 2024</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <BookOpen className="text-purple-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.totalBooks.toLocaleString()}</span>
            <span className="text-sm text-gray-400">Total Buku</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <Users className="text-blue-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.totalMembers.toLocaleString()}</span>
            <span className="text-sm text-gray-400">Total Anggota</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <UserPlus className="text-green-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.totalStaff}</span>
            <span className="text-sm text-gray-400">Total Staff</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <BookOpen className="text-yellow-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.totalDipinjam}</span>
            <span className="text-sm text-gray-400">Total Dipinjam</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <Star className="text-amber-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.averageRating}</span>
            <span className="text-sm text-gray-400">Rating Rata-rata</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#362f47] rounded-lg">
            <Award className="text-indigo-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">{libraryStats.totalCategories}</span>
            <span className="text-sm text-gray-400">Total Kategori</span>
          </div>
        </div>
      </div>

      {/* Controls for Filterable Stats */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Statistik Perpustakaan</h2>
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === 'today' ? 'default' : 'secondary'}
              onClick={() => setSelectedPeriod('today')}
              size="sm"
            >
              Hari Ini
            </Button>
            <Button 
              variant={selectedPeriod === 'week' ? 'default' : 'secondary'}
              onClick={() => setSelectedPeriod('week')}
              size="sm"
            >
              Minggu Ini
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'default' : 'secondary'}
              onClick={() => setSelectedPeriod('month')}
              size="sm"
            >
              Bulan Ini
            </Button>
          </div>
        </div>
      </div>

      {/* Filterable Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterableStats.map((stat, index) => (
          <Card key={index} className="bg-[#2a2438] border-0 transition-all duration-200 hover:bg-[#362f47]">
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;