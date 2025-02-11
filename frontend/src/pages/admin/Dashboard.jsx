import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BookOpen, Users, Bookmark, Award, ChevronDown, Search, Bell,
  ArrowUp, ArrowDown, PieChart, BarChart, TrendingUp, Calendar,
  Download, Filter, RefreshCw, Menu, Clock, UserPlus, Star, Activity
} from 'react-feather';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell,
  ComposedChart,
  Area,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card";
import DatePicker from '../../components/ui/admin/DatePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/admin/Tabs";
import Button from "../../components/ui/admin/Button";
import { peminjamanService } from '../../services/peminjamanService';
import { useBooks } from '../../hooks/useBook';
import { useUsers } from '../../hooks/useUsers';


// Expanded Mock Data
const borrowingData = [
  { month: 'Jan', borrowed: 350, returned: 300, active: 50 },
  { month: 'Feb', borrowed: 400, returned: 350, active: 50 },
  { month: 'Mar', borrowed: 380, returned: 330, active: 50 },
  { month: 'Apr', borrowed: 450, returned: 400, active: 50 },
  { month: 'May', borrowed: 420, returned: 370, active: 50 },
  { month: 'Jun', borrowed: 480, returned: 430, active: 50 }
];

const categoryData = [
  { name: 'Fiction', value: 400, description: 'Novels, Short Stories, Poetry' },
  { name: 'Non-Fiction', value: 300, description: 'Biographies, Self-Help' },
  { name: 'Academic', value: 200, description: 'Textbooks, Research Papers' },
  { name: 'Children', value: 150, description: 'Picture Books, Young Adult' }
];


const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('chart');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [dateRange, setDateRange] = useState({
    minDate: new Date(),
    maxDate: new Date()
  });
  const [peminjamanData, setPeminjamanData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initializeDateRange = async () => {
      try {
        setIsLoading(true);
        const response = await peminjamanService.getEarliestPeminjamanDate();
        if (response) {
          const earliestDate = new Date(response);
          const currentDate = new Date();
          setDateRange({
            minDate: earliestDate,
            maxDate: currentDate
          });
          setSelectedDate(currentDate);
        }
      } catch (error) {
        console.error("Failed to fetch date range:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDateRange();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchBorrowingData(date);
  };

  const fetchBorrowingData = async (date) => {
    try {
      setIsLoading(true);
      const response = await peminjamanService.getPeminjamanByDate(date);
      setPeminjamanData(response);
    } catch (error) {
      console.error("Failed to fetch borrowing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    books,
    loading: booksLoading,
    totalItems: totalBooks,
    refresh: refreshBooks
  } = useBooks({ limit: 1000 }); // Get all books for statistics

  const {
    users,
    loading: usersLoading,
    totalItems: totalUsers,
    refresh: refreshUsers
  } = useUsers({ limit: 1000 }); // Get all users for statistics

  // Calculate book statistics
  const bookStats = useMemo(() => {
    if (!books) return {};

    const activeBooks = books.filter(book => book.status === 'DIPINJAM').length;
    const totalReviews = books.reduce((acc, book) => acc + (book.reviews?.length || 0), 0);

    return {
      totalBooks,
      activeBooks,
      totalReviews
    };
  }, [books, totalBooks]);

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!users) return {};

    const activeUsers = users.filter(user => user.is_active === true && user.role === 'USER').length;

    return {
      totalUsers,
      activeUsers
    };
  }, [users, totalUsers]);

  const categoryData = useMemo(() => {
    if (!books) return [];

    const categories = books.reduce((acc, book) => {
      const category = book.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  }, [books]);

  // Enhanced Stats with Real Data
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


  const handleExport = () => {
    // Implement export functionality
    const data = {
      books: books,
      users: users,
      stats: {
        books: bookStats,
        users: userStats
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleRefresh = () => {
    // Placeholder for data refresh
    console.log('Memperbarui data...');
  };

  const renderTrendIcon = (trend) => {
    return trend === 'up' ?
      <ArrowUp className="text-green-500 inline ml-1" size={16} /> :
      <ArrowDown className="text-red-500 inline ml-1" size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#1a1625] p-3 sm:p-6 mt-16 sm:mt-20 mb-1 rounded-lg">
      {/* Mobile Menu Button */}
      <div className="block md:hidden mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex justify-between items-center"
        >
          <span>Menu</span>
          <Menu size={20} />
        </Button>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              className="w-full pl-10 pr-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <RefreshCw size={16} className="inline mr-2" /> Refresh
          </button>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[#2a2438] text-white rounded-lg hover:bg-[#362f47] transition-colors">
            <Filter size={16} className="inline mr-2" /> Filter
          </button>
          <button className="px-4 py-2 bg-[#2a2438] text-white rounded-lg hover:bg-[#362f47] transition-colors">
            <Download size={16} className="inline mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs Navigation - Responsive */}
      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="w-full flex-wrap">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Detailed Stats</TabsTrigger>
          <TabsTrigger value="management" className="flex-1">Library Management</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 mb-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Data Peminjaman */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Grafik Peminjaman Tahun Ini</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
              >
                <BarChart size={16} className="mr-2" /> Chart
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <TrendingUp size={16} className="mr-2" /> Table
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={borrowingData}>
                  <defs>
                    <linearGradient id="bookGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="returnedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="buku"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#bookGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="returned"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#returnedGradient)"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart Kategori Buku */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Buku</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-white">{value}</span>}
                  wrapperStyle={{ color: 'white' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;