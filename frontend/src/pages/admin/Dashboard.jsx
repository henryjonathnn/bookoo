import React, { useState, useMemo, useCallback } from 'react';
import { BookOpen, Users, Bookmark, Award, ChevronDown, Search, Bell } from 'react-feather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card";
import DatePicker from '../../components/ui/admin/DatePicker';

// Mock data untuk chart
const borrowingData = [
  { month: 'Jan', books: 350 }, { month: 'Feb', books: 400 },
  { month: 'Mar', books: 380 }, { month: 'Apr', books: 450 },
  { month: 'May', books: 420 }, { month: 'Jun', books: 480 }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Memoized stats to prevent unnecessary recalculations
  const stats = useMemo(() => [
    {
      title: "Total Buku",
      value: "2,846",
      change: "+12.5%",
      icon: <BookOpen className="text-purple-500" />,
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Pengunjung Aktif",
      value: "1,453",
      change: "+8.2%",
      icon: <Users className="text-indigo-500" />,
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Buku yang dipinjam",
      value: "846",
      change: "+23.1%",
      icon: <Bookmark className="text-pink-500" />,
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Total Reviews",
      value: "4,721",
      change: "+15.8%",
      icon: <Award className="text-blue-500" />,
      bgColor: "bg-blue-500/10"
    }
  ], []);

  const activities = useMemo(() => [
    {
      user: "Sarah Chen",
      action: "borrowed",
      book: "The Design of Everyday Things",
      time: "2 hours ago",
      avatar: "SC"
    },
    {
      user: "John Smith",
      action: "returned",
      book: "Clean Code",
      time: "4 hours ago",
      avatar: "JS"
    },
    {
      user: "Maria Garcia",
      action: "reviewed",
      book: "Atomic Habits",
      time: "6 hours ago",
      avatar: "MG"
    }
  ], []);

  const handleDateChange = (date) => {
    setSelectedDate(date)

    console.log("Menghasilkan data untuk tanggal:", date)
  }

  // Memoized filter function for activities
  const filteredActivities = useMemo(() =>
    activities.filter(activity =>
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.book.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [activities, searchQuery]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1625] p-6 mt-20 mb-1">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <DatePicker onDateChange={handleDateChange} />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              className="pl-10 pr-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrowing Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Borrowing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={borrowingData}>
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
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, bgColor }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {icon}
        </div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({ user, action, book, time, avatar }) => (
  <div className="flex items-center justify-between py-2 hover:bg-gray-800/50 rounded-lg px-3 transition-colors">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
        <span className="text-purple-400 font-medium">{avatar}</span>
      </div>
      <div>
        <p>
          <span className="font-medium">{user}</span>
          {' '}
          <span className="text-gray-400">{action}</span>
          {' '}
          <span className="font-medium">{book}</span>
        </p>
        <p className="text-sm text-gray-400">{time}</p>
      </div>
    </div>
    <ChevronDown size={20} className="text-gray-400" />
  </div>
);

export default Dashboard;