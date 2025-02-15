import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'react-feather';
import DatePicker from '../../ui/admin/DatePicker';

const FilterPanel = ({ onFilterChange, peminjaman = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('monthly'); // 'monthly' atau 'custom'
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Proses data peminjaman untuk mendapatkan bulan dan tahun yang tersedia
  useEffect(() => {
    if (peminjaman && peminjaman.length > 0) {
      const dates = peminjaman
        .map(p => new Date(p.createdAt))
        .filter(date => !isNaN(date.getTime()));

      if (dates.length > 0) {
        // Dapatkan tahun yang unik dan urutkan
        const years = [...new Set(dates.map(date => date.getFullYear()))]
          .sort((a, b) => b - a);
        setAvailableYears(years.length > 0 ? years : [new Date().getFullYear()]);

        // Dapatkan bulan yang tersedia untuk tahun yang dipilih
        const monthsInYear = dates
          .filter(date => date.getFullYear() === selectedYear)
          .map(date => date.getMonth());
        
        const uniqueMonths = [...new Set(monthsInYear)].sort((a, b) => a - b);
        
        // Jika tidak ada bulan yang tersedia untuk tahun ini, gunakan semua bulan
        if (uniqueMonths.length === 0) {
          setAvailableMonths([...Array(12).keys()]); // 0-11 untuk semua bulan
        } else {
          setAvailableMonths(uniqueMonths);
        }
      } else {
        // Jika tidak ada data, set default ke tahun dan bulan saat ini
        setAvailableYears([new Date().getFullYear()]);
        setAvailableMonths([new Date().getMonth()]);
      }
    }
  }, [peminjaman, selectedYear]);

  // Set filter default saat komponen dimount
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    handleMonthYearChange(currentMonth, currentYear);
  }, []);

  const handleMonthYearChange = (month, year) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    setSelectedMonth(month);
    setSelectedYear(year);
    setDateRange({ startDate, endDate });
    onFilterChange({ startDate, endDate });
  };

  const handleCustomDateChange = (type, date) => {
    const newDateRange = { ...dateRange, [type]: date };
    setDateRange(newDateRange);
    onFilterChange(newDateRange);
  };

  const resetFilters = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setFilterType('monthly');
    handleMonthYearChange(currentMonth, currentYear);
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
            <h3 className="text-lg font-medium text-white">Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setFilterType('monthly')}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  filterType === 'monthly' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setFilterType('custom')}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  filterType === 'custom' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Kustom
              </button>
            </div>

            <div className="space-y-2">
              {filterType === 'custom' ? (
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Tanggal Mulai</label>
                    <DatePicker
                      onDateChange={(date) => handleCustomDateChange('startDate', date)}
                      minDate={new Date(Math.min(...availableYears))}
                      maxDate={dateRange.endDate}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Tanggal Akhir</label>
                    <DatePicker
                      onDateChange={(date) => handleCustomDateChange('endDate', date)}
                      minDate={dateRange.startDate}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthYearChange(parseInt(e.target.value), selectedYear)}
                    className="flex-1 px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableMonths.map((monthIndex) => (
                      <option key={monthIndex} value={monthIndex}>
                        {months[monthIndex]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleMonthYearChange(selectedMonth, parseInt(e.target.value))}
                    className="w-28 px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

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