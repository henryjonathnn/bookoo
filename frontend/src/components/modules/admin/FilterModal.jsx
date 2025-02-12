import React, { useState, useEffect } from 'react';
import { X, Check } from 'react-feather';
import { useBookCategories } from '../../../hooks/useBookCategories';

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  type,
  initialFilters
}) => {
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters || {});
    }
  }, [isOpen, initialFilters]);

  const { categories, loading: LoadingCategories } = useBookCategories();

  const filterConfigs = {
    user: {
      title: 'Filter User',
      options: [
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          choices: ['USER', 'STAFF', 'ADMIN'],
          defaultLabel: 'Semua Role'
        },
        {
          key: 'active',
          label: 'Status',
          type: 'select',
          choices: ['ACTIVE', 'INACTIVE'],
          defaultLabel: 'Semua Status',
          valueLabels: {
            'ACTIVE': 'Aktif',
            'INACTIVE': 'Tidak Aktif',
          }
        }
      ]
    },
    book: {
      title: 'Filter Buku',
      options: [
        {
          key: 'kategori',
          label: 'Kategori',
          type: 'select',
          defaultLabel: 'Semua Kategori',
          choices: LoadingCategories ? [] : categories,
        }
      ]
    },
    peminjaman: {
      title: 'Filter Peminjaman',
      options: [
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          choices: ['PENDING', 'DIPROSES', 'DIKIRIM', 'DIPINJAM', 'DIKEMBALIKAN', 'DITOLAK', 'TERLAMBAT']
        }
      ]
    }
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      role: '',
      active: ''
    }
    setLocalFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  if (!isOpen) return null;

  const config = filterConfigs[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#1a1625] rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold">{config.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {config.options.map(option => (
            <div key={option.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {option.label}
              </label>
              <select
                value={localFilters[option.key] || ''}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                className="w-full px-3 py-2 bg-[#0f0a19] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">{option.defaultLabel}</option>
                {LoadingCategories ? (
                  <option disabled>Memuat kategori...</option>
                ) : (
                  option.choices.length > 0 ? (
                    option.choices.map(choice => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))
                  ) : (
                    <option disabled>Kategori tidak tersedia</option>
                  )
                )}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-between p-4 border-t border-gray-800">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#0f0a19] text-sm rounded-lg hover:bg-[#2a2435] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;