import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'react-feather';

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DatePicker = ({ onDateChange, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Fungsi untuk mendapatkan jumlah hari dalam bulan
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Fungsi untuk mendapatkan hari pertama dalam bulan
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Fungsi untuk mengecek apakah tanggal diluar rentang
  const isDateDisabled = (date) => {
    return date < minDate || date > maxDate;
  };

  // Generate tahun antara minDate dan maxDate
  const generateYearOptions = () => {
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  };

  // Generate bulan yang tersedia berdasarkan tahun terpilih
  const getAvailableMonths = () => {
    const monthsArray = [];
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();

    for (let i = 0; i < 12; i++) {
      if (
        (selectedYear === minYear && i < minDate.getMonth()) ||
        (selectedYear === maxYear && i > maxDate.getMonth())
      ) {
        continue;
      }
      monthsArray.push(i);
    }
    return monthsArray;
  };

  // Generate kalender
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Tambahkan sel kosong untuk hari sebelum bulan dimulai
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Tambahkan hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const isDisabled = isDateDisabled(currentDate);
      const isSelected = day === selectedDay &&
        selectedMonth === selectedDate.getMonth() &&
        selectedYear === selectedDate.getFullYear();
      const isToday = day === new Date().getDate() &&
        selectedMonth === new Date().getMonth() &&
        selectedYear === new Date().getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDaySelect(day)}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSelected ? 'bg-purple-600 text-white' : ''}
            ${isToday && !isSelected ? 'border border-purple-500' : ''}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Handle perubahan bulan
  const handleMonthChange = (increment) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    // Pastikan bulan dan tahun tidak melebihi batas
    const newDate = new Date(newYear, newMonth, 1);
    if (newDate >= minDate && newDate <= maxDate) {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    }
  };

  // Handle pemilihan hari
  const handleDaySelect = (day) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    setSelectedDate(newDate);
    setSelectedDay(day);
    onDateChange?.(newDate);
    setIsOpen(false);
  };

  // Format tanggal untuk ditampilkan
  const formatDate = (date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#2a2438] border border-slate-700 rounded-lg text-gray-200 hover:bg-[#332d44] transition-colors"
      >
        <Calendar size={18} />
        <span>{formatDate(selectedDate)}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-[#2a2438] border border-slate-700 rounded-lg shadow-xl z-50 w-[320px]">
          {/* Navigasi Bulan dan Tahun */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              disabled={selectedYear === minDate.getFullYear() && selectedMonth === minDate.getMonth()}
              className={`p-1 rounded-full transition-colors ${
                selectedYear === minDate.getFullYear() && selectedMonth === minDate.getMonth()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-700'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="text-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer mr-2"
              >
                {getAvailableMonths().map((monthIndex) => (
                  <option key={monthIndex} value={monthIndex} className="bg-[#2a2438]">
                    {months[monthIndex]}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year} className="bg-[#2a2438]">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleMonthChange(1)}
              disabled={selectedYear === maxDate.getFullYear() && selectedMonth === maxDate.getMonth()}
              className={`p-1 rounded-full transition-colors ${
                selectedYear === maxDate.getFullYear() && selectedMonth === maxDate.getMonth()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-700'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Hari dalam Minggu */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Kalender */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {generateCalendarDays()}
          </div>

          {/* Tombol Apply */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DatePicker;