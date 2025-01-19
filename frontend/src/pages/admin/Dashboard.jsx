
import React from 'react';
import { BookOpen, Users, Bookmark, Award, ChevronDown } from 'react-feather';

const Dashboard = () => {
  return (
    <div className="pt-24">
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
    </div>
  );
};

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