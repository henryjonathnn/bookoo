
import React from 'react';
import { Bell, Search } from 'react-feather';

const Navbar = () => {
  return (
    <header className="bg-[#1a1625]/50 backdrop-blur-sm border-b border-purple-500/10 fixed right-0 left-64 top-0 z-10">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1a1625] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div> */}
          <button className="relative p-2 hover:bg-[#1a1625] rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;