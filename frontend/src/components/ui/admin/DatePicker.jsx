import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'react-feather';

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DatePicker = ({ selectedDate, onDateChange, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(selectedDate ? selectedDate.getMonth() : new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(selectedDate ? selectedDate.getDate() : new Date().getDate());

  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

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
    const checkDate = new Date(selectedYear, selectedMonth, date);
    return (minDate && checkDate < minDate) || (maxDate && checkDate > maxDate);
  };

  // Generate tahun antara minDate dan maxDate
  const generateYearOptions = () => {
    const minYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 10;
    const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10;
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  };

  // Generate bulan yang tersedia berdasarkan tahun terpilih
  const getAvailableMonths = () => {
    const monthsArray = [];
    const minYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 10;
    const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10;

    for (let i = 0; i < 12; i++) {
      if (
        (selectedYear === minYear && minDate && i < minDate.getMonth()) ||
        (selectedYear === maxYear && maxDate && i > maxDate.getMonth())
      ) {
        continue;
      }
      monthsArray.push(i);
    }
    return monthsArray;
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    if (!isDateDisabled(day)) {
      onDateChange(newDate);
      setIsOpen(false);
    }
  };

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

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay && 
                        selectedDate?.getMonth() === selectedMonth && 
                        selectedDate?.getFullYear() === selectedYear;
      const isDisabled = isDateDisabled(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors
            ${isSelected ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-[#362f47] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-between"
      >
        <span>
          {selectedDate ? selectedDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'Pilih tanggal'}
        </span>
        <Calendar size={18} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-[#2a2438] border border-slate-700 rounded-lg shadow-xl z-50">
          {/* Header dengan navigasi bulan */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              disabled={selectedYear === minDate?.getFullYear() && selectedMonth === minDate?.getMonth()}
              className={`p-1 rounded-full transition-colors ${
                selectedYear === minDate?.getFullYear() && selectedMonth === minDate?.getMonth()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-700'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
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
              disabled={selectedYear === maxDate?.getFullYear() && selectedMonth === maxDate?.getMonth()}
              className={`p-1 rounded-full transition-colors ${
                selectedYear === maxDate?.getFullYear() && selectedMonth === maxDate?.getMonth()
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
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;