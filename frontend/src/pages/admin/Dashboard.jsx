import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BookOpen, Users, Bookmark, Award, ChevronDown, Search, Bell,
  ArrowUp, ArrowDown, PieChart, BarChart, TrendingUp, Calendar,
  Download, Filter, RefreshCw
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

// Expanded Mock Data
const borrowingData = [
  { month: 'Jan', buku: 350, returned: 300 },
  { month: 'Feb', buku: 400, returned: 350 },
  { month: 'Mar', buku: 380, returned: 330 },
  { month: 'Apr', buku: 450, returned: 400 },
  { month: 'Mei', buku: 420, returned: 370 },
  { month: 'Jun', buku: 480, returned: 430 }
];

const categoryData = [
  { name: 'Fiction', value: 400 },
  { name: 'Non-Fiction', value: 300 },
  { name: '科学', value: 200 },
  { name: 'History', value: 150 }
];

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('chart');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    minDate: new Date(),
    maxDate: new Date()
  });
  const [peminjamanData, setPeminjamanData] = useState([]);

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


  // Enhanced Stats with More Detailed Information
  const stats = useMemo(() => [
    {
      title: "Total Buku",
      value: "2,846",
      change: "+12.5%",
      icon: <BookOpen className="text-purple-500" />,
      bgColor: "bg-purple-500/10",
      trend: 'up'
    },
    {
      title: "Pengunjung Aktif",
      value: "1,453",
      change: "+8.2%",
      icon: <Users className="text-indigo-500" />,
      bgColor: "bg-indigo-500/10",
      trend: 'up'
    },
    {
      title: "Buku Dipinjam",
      value: "846",
      change: "-3.1%",
      icon: <Bookmark className="text-pink-500" />,
      bgColor: "bg-pink-500/10",
      trend: 'down'
    },
    {
      title: "Total Reviews",
      value: "4,721",
      change: "+15.8%",
      icon: <Award className="text-blue-500" />,
      bgColor: "bg-blue-500/10",
      trend: 'up'
    }
  ], []);

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Mengekspor data...');
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
    <div className="min-h-screen bg-[#1a1625] p-6 mt-20 mb-1">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <DatePicker
            onDateChange={handleDateChange}
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBorrowingData(selectedDate)}
            disabled={isLoading}
          >
            <RefreshCw size={16} className="mr-2" /> Refresh Data
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              className="pl-10 pr-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleExport}>
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Stats</TabsTrigger>
          <TabsTrigger value="management">Library Management</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change} {renderTrendIcon(stat.trend)}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Borrowing Trends Chart with Gradient Fill */}
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

        {/* Enhanced Book Category Distribution */}
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