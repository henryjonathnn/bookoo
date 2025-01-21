import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'react-feather';

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DatePicker = ({ onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay && 
                        selectedMonth === selectedDate.getMonth() && 
                        selectedYear === selectedDate.getFullYear();
      const isToday = day === new Date().getDate() && 
                     selectedMonth === new Date().getMonth() && 
                     selectedYear === new Date().getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDay(day);
            const newDate = new Date(selectedYear, selectedMonth, day);
            setSelectedDate(newDate);
          }}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSelected ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}
            ${isToday && !isSelected ? 'border border-purple-500' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
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

  const handleDateSelect = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
    setIsOpen(false);
  };

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
          {/* Month and Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer mr-2"
              >
                {months.map((month, index) => (
                  <option key={month} value={index} className="bg-[#2a2438]">
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i).map((year) => (
                  <option key={year} value={year} className="bg-[#2a2438]">
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleMonthChange(1)}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {generateCalendarDays()}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleDateSelect}
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