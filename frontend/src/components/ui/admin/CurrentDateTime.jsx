import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'react-feather';

const CurrentDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${dayNumber} ${month} ${year}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex justify-between items-center p-4 rounded-lg border border-slate-700">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Calendar className="text-purple-500" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400">Tanggal</p>
          <p className="text-lg font-semibold text-white">{formatDate(dateTime)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Clock className="text-blue-500" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400">Waktu</p>
          <p className="text-lg font-semibold text-white">{formatTime(dateTime)} WIB</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentDateTime;