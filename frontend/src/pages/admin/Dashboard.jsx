import React, { useState, useMemo, useCallback } from 'react';
import {
  BookOpen, Users, Bookmark, Award, Search, Bell,
  ArrowUp, ArrowDown, Download, RefreshCw, Menu, Clock,
  UserPlus, Star, Activity
} from 'react-feather';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/admin/Tabs";
import Button from "../../components/ui/admin/Button";
import FilterPanel from '../../components/modules/admin/FilterPanel';
import CurrentDateTime from '../../components/modules/admin/CurrentDateTime';
import useWindowSize from '../../hooks/useWindowSize';
import { useBooks } from '../../hooks/useBook';
import { useUsers } from '../../hooks/useUsers';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobileView = width < 768;

  // Data fetching hooks
  const { books, loading: booksLoading, totalItems: totalBooks } = useBooks({ limit: 1000 });
  const { users, loading: usersLoading, totalItems: totalUsers } = useUsers({ limit: 1000 });

  // Memoized computations
  const bookStats = useMemo(() => {
    if (!books?.length) return { totalBooks: 0, activeBooks: 0, totalReviews: 0 };

    const activeBooks = books.filter(book => book.status === 'DIPINJAM').length;
    const totalReviews = books.reduce((acc, book) => acc + (book.reviews?.length || 0), 0);

    return { totalBooks, activeBooks, totalReviews };
  }, [books, totalBooks]);

  const userStats = useMemo(() => {
    if (!users?.length) return { totalUsers: 0, activeUsers: 0 };

    const activeUsers = users.filter(user => user.is_active && user.role === 'USER').length;
    return { totalUsers, activeUsers };
  }, [users, totalUsers]);

  const stats = useMemo(() => [
    {
      title: "Total Buku",
      value: bookStats.totalBooks || 0,
      change: "+12.5%",
      icon: <BookOpen className="text-purple-500" />,
      bgColor: "bg-purple-500/10",
      trend: 'up'
    },
    {
      title: "Pengunjung Aktif",
      value: userStats.activeUsers || 0,
      change: "+8.2%",
      icon: <Users className="text-indigo-500" />,
      bgColor: "bg-indigo-500/10",
      trend: 'up'
    },
    {
      title: "Buku Dipinjam",
      value: bookStats.activeBooks || 0,
      change: "-3.1%",
      icon: <Bookmark className="text-pink-500" />,
      bgColor: "bg-pink-500/10",
      trend: 'down'
    },
    {
      title: "Total Reviews",
      value: bookStats.totalReviews || 0,
      change: "+15.8%",
      icon: <Award className="text-blue-500" />,
      bgColor: "bg-blue-500/10",
      trend: 'up'
    },
    {
      title: "Keterlambatan",
      value: 12,
      change: "+2.4%",
      icon: <Clock className="text-red-500" />,
      bgColor: "bg-red-500/10",
      trend: 'up'
    },
    {
      title: "Member Baru",
      value: 28,
      change: "+5.6%",
      icon: <UserPlus className="text-green-500" />,
      bgColor: "bg-green-500/10",
      trend: 'up'
    },
    {
      title: "Rating Rata-rata",
      value: "4.5",
      change: "+0.3",
      icon: <Star className="text-yellow-500" />,
      bgColor: "bg-yellow-500/10",
      trend: 'up'
    },
    {
      title: "Aktivitas Harian",
      value: 156,
      change: "+12.3%",
      icon: <Activity className="text-cyan-500" />,
      bgColor: "bg-cyan-500/10",
      trend: 'up'
    }
  ], [bookStats, userStats]);

  const detailedStats = [
    {
      title: "Statistik Peminjaman",
      items: [
        {
          label: "Peminjaman Hari Ini",
          value: "24",
          change: "+4",
          trend: "up"
        },
        {
          label: "Pengembalian Hari Ini",
          value: "18",
          change: "-2",
          trend: "down"
        },
        {
          label: "Rata-rata Durasi",
          value: "7 hari",
          change: "0",
          trend: "neutral"
        }
      ]
    },
    {
      title: "Performa Kategori",
      items: [
        {
          label: "Kategori Terpopuler",
          value: "Fiksi",
          change: "+15%",
          trend: "up"
        },
        {
          label: "Kategori Terendah",
          value: "Referensi",
          change: "-8%",
          trend: "down"
        }
      ]
    }
  ];

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

  if (booksLoading || usersLoading) {
    return <div className="min-h-screen bg-[#1a1625] p-6 flex items-center justify-center">
      <span className="text-white">Loading dashboard...</span>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1625] p-3 sm:p-6 mt-16 sm:mt-20 mb-1 rounded-lg">
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
      

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex-wrap">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Detailed Stats</TabsTrigger>
          <TabsTrigger value="management" className="flex-1">Library Management</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#2a2438] border-0">
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
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {detailedStats.map((section, index) => (
          <Card key={index} className="bg-[#2a2438] border-0">
            <CardHeader>
              <CardTitle className="text-lg text-white">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#362f47] rounded-lg">
                    <span className="text-gray-300">{item.label}</span>
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-2">{item.value}</span>
                      <span className={`text-sm ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change} {renderTrendIcon(item.trend)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;