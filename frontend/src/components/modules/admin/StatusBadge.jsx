import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'PENDING': { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    'DIKIRIM': { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    'DIPINJAM': { bg: 'bg-green-500/10', text: 'text-green-400' },
    'TERLAMBAT': { bg: 'bg-red-500/10', text: 'text-red-400' },
    'DIKEMBALIKAN': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    'DITOLAK': { bg: 'bg-gray-500/10', text: 'text-gray-400' }
  };

  const { bg, text } = statusConfig[status] || statusConfig['PENDING'];
  return (
    <span className={`px-2 py-0.5 ${bg} ${text} rounded text-xs`}>
      {status}
    </span>
  );
};

export default StatusBadge; 