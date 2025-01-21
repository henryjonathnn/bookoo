import React from 'react';
import { Search, Filter, Download } from 'react-feather';

const SearchFilterBar = ({ searchPlaceholder }) => (
  <div className="bg-[#1a1625] p-4 rounded-xl mb-6">
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-[#0f0a19] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="px-4 py-2 bg-[#0f0a19] rounded-lg flex items-center gap-2">
          <Filter size={20} />
          Filters
        </button>
      </div>
      <button className="px-4 py-2 bg-[#0f0a19] rounded-lg flex items-center gap-2 w-full md:w-auto">
        <Download size={20} />
        Export Data
      </button>
    </div>
  </div>
);

export default SearchFilterBar;