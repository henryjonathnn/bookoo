import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'react-feather';
import DatePicker from './DatePicker';

const FilterPanel = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: new Date(),
      endDate: new Date()
    },
    category: 'all',
    status: 'all',
    sortBy: 'newest',
    userType: 'all',
    activity: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (type, date) => {
    const newDateRange = { ...filters.dateRange, [type]: date };
    handleFilterChange('dateRange', newDateRange);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      category: 'all',
      status: 'all',
      sortBy: 'newest',
      userType: 'all',
      activity: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg text-gray-200 hover:bg-[#332d44] transition-colors"
      >
        <Filter size={18} />
        <span>Filter</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-[#2a2438] border border-slate-700 rounded-lg shadow-xl z-50 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Date Range</label>
              <div className="flex gap-2">
                <DatePicker
                  onDateChange={(date) => handleDateChange('startDate', date)}
                  minDate={new Date(2020, 0, 1)}
                  maxDate={new Date()}
                />
                <DatePicker
                  onDateChange={(date) => handleDateChange('endDate', date)}
                  minDate={filters.dateRange.startDate}
                  maxDate={new Date()}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="academic">Academic</option>
                <option value="children">Children</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">User Type</label>
              <select
                value={filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
                className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Users</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Activity Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Activity</label>
              <select
                value={filters.activity}
                onChange={(e) => handleFilterChange('activity', e.target.value)}
                className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Activities</option>
                <option value="borrowing">Borrowing</option>
                <option value="returning">Returning</option>
                <option value="reviews">Reviews</option>
                <option value="visits">Visits</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-active">Most Active</option>
                <option value="least-active">Least Active</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;