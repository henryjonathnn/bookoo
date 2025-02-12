import React, { useState } from 'react';
import { Filter, X, ChevronDown, Calendar } from 'react-feather';
import DatePicker from './DatePicker';

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const FilterPanel = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
  });

  // Generate year options (last 5 years until current year)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 4; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const handleMonthYearChange = (month, year) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const newFilters = {
      ...filters,
      dateRange: { startDate, endDate }
    };
    
    setSelectedMonth(month);
    setSelectedYear(year);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (type, date) => {
    const newDateRange = { ...filters.dateRange, [type]: date };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const defaultFilters = {
      dateRange: {
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 0)
      },
    };
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setIsCustomPeriod(false);
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
            {/* Period Selection Type */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setIsCustomPeriod(false)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  !isCustomPeriod 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setIsCustomPeriod(true)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  isCustomPeriod 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Kustom
              </button>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">
                {isCustomPeriod ? 'Periode' : 'Bulan dan Tahun'}
              </label>
              
              {isCustomPeriod ? (
                <div className="flex gap-2">
                  <DatePicker
                    onDateChange={(date) => handleDateRangeChange('startDate', date)}
                    minDate={new Date(2020, 0, 1)}
                    maxDate={new Date()}
                  />
                  <DatePicker
                    onDateChange={(date) => handleDateRangeChange('endDate', date)}
                    minDate={filters.dateRange.startDate}
                    maxDate={new Date()}
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthYearChange(parseInt(e.target.value), selectedYear)}
                    className="flex-1 px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleMonthYearChange(selectedMonth, parseInt(e.target.value))}
                    className="w-28 px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
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
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;