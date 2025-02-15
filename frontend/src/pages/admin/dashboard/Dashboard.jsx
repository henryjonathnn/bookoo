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
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/admin/Card";
import Button from "../../../components/ui/admin/Button";
import FilterPanel from '../../../components/modules/admin/FilterPanel';
import CurrentDateTime from '../../../components/modules/admin/CurrentDateTime';
import useWindowSize from '../../../hooks/useWindowSize';
import { useBooks } from '../../../hooks/useBook';
import { useUsers } from '../../../hooks/useUsers';
import { useParallelDataFetch } from '../../../hooks/useParallelDataFetch';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { LibraryStatsOverview } from './LibraryStatsOverview';
import FilterableStatsGrid from './FilterableStatsGrid';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobileView = width < 768;
  const [currentDateRange, setCurrentDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Awal tahun
    endDate: new Date()
  });

  const {
    books,
    users,
    totalCategories,
    totalPeminjaman,
    peminjamanData,
    isLoading,
    error,
    refresh
  } = useParallelDataFetch();

  useEffect(() => {
    let lastY = 0;
    const handleTouchStart = (e) => {
      lastY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      if (currentY - lastY > 150) { // Pull down threshold
        refresh();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [refresh]);

  if (isLoading) {
    <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1625] p-6 mt-16">
        <div className="text-red-500">
          Error loading data. Please try again.
        </div>
      </div>
    );
  }

  // Callbacks for user interactions
  const handleExport = useCallback(() => {
    alert("Mengekspor Data..")
  }, []);

  const handleFilterChange = useCallback((dateRange) => {
    console.log('Filter changed:', dateRange);
    setCurrentDateRange(dateRange);
  }, []);

  // Hitung data yang difilter untuk stats grid
  const filteredPeminjamanData = useMemo(() => {
    return peminjamanData?.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= currentDateRange.startDate && 
             itemDate <= currentDateRange.endDate;
    }) || [];
  }, [peminjamanData, currentDateRange]);

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
        <FilterPanel 
          onFilterChange={handleFilterChange} 
          peminjaman={peminjamanData || []}
        />
      </div>

      <div className='mb-6'>
        <CurrentDateTime />
      </div>
      {/* Overview Panel dengan data akumulatif */}
      <LibraryStatsOverview
        books={books || []}
        users={users || []}
        totalCategories={totalCategories || 0}
        totalPeminjaman={peminjamanData || []} // Kirim semua data peminjaman
        dateRange={currentDateRange} // Tambahkan dateRange
      />

      {/* Stats Grid dengan data terfilter */}
      <FilterableStatsGrid
        peminjaman={filteredPeminjamanData}
        selectedPeriod={selectedPeriod}
      />
    </div>
  );
};

export default Dashboard;