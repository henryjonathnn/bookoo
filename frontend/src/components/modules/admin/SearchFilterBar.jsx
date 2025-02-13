import React, { useState, useCallback } from 'react';
import { Search, Filter, Download } from 'react-feather';
import debounce from 'lodash/debounce';
import FilterModal from './FilterModal';

const SearchFilterBar = ({ 
  searchPlaceholder, 
  onSearch, 
  onFilter, 
  initialValue = '', 
  className, 
  initialFilters = {}, 
  filterType 
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      onSearch(searchValue);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleApplyFilter = (filters) => {
    setCurrentFilters(filters);
    onFilter(filters);
  };

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="bg-[#1a1625] p-4 rounded-xl mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-[#0f0a19] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2.5 bg-[#0f0a19] rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-[#2a2435] transition-colors"
            type="button"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
          <button
            className="px-4 py-2.5 bg-[#0f0a19] rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-[#2a2435] transition-colors"
            type="button"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        type={filterType}
        initialFilters={currentFilters}
      />
    </div>
  );
};

export default SearchFilterBar;