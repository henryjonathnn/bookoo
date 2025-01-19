import React, { useState } from 'react';
import { Bell, Search, BookOpen, Users, Settings, ChevronDown, TrendingUp, Award, Bookmark } from 'react-feather';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f0a19] text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1625] transition-all duration-300 p-4`}>
        <div className="flex items-center mb-8">
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent ${!isSidebarOpen && 'hidden'}`}>
            BooKoo
          </h1>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<BookOpen />} label="Dashboard" active />
          <NavItem icon={<Users />} label="Users" />
          <NavItem icon={<Bookmark />} label="Books" />
          <NavItem icon={<TrendingUp />} label="Analytics" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#1a1625] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="relative p-2 hover:bg-[#1a1625] rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Books"
            value="2,846"
            change="+12.5%"
            icon={<BookOpen className="text-purple-500" />}
          />
          <StatCard
            title="Active Users"
            value="1,453"
            change="+8.2%"
            icon={<Users className="text-indigo-500" />}
          />
          <StatCard
            title="Books Borrowed"
            value="846"
            change="+23.1%"
            icon={<Bookmark className="text-pink-500" />}
          />
          <StatCard
            title="Total Reviews"
            value="4,721"
            change="+15.8%"
            icon={<Award className="text-blue-500" />}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1625] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              user="Sarah Chen"
              action="borrowed"
              book="The Design of Everyday Things"
              time="2 hours ago"
            />
            <ActivityItem
              user="John Smith"
              action="returned"
              book="Clean Code"
              time="4 hours ago"
            />
            <ActivityItem
              user="Maria Garcia"
              action="reviewed"
              book="Atomic Habits"
              time="6 hours ago"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-[#2a2435]'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-[#1a1625] p-6 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-800/50 rounded-lg">
        {icon}
      </div>
      <span className="text-green-400 text-sm">{change}</span>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ActivityItem = ({ user, action, book, time }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
        <Users size={20} className="text-purple-400" />
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