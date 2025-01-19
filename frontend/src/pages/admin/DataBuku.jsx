import React, { useState } from 'react';
import { 
  Search, Plus, Filter, Download, MoreVertical, Trash2, Eye,
  ChevronLeft, ChevronRight, BookOpen, 
  PenTool
} from 'react-feather';

const DataBuku = () => {
  const [selectedBooks, setSelectedBooks] = useState([]);

  return (
    <div className="pt-24">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Books Management</h1>
          <p className="text-gray-400">Manage and organize your library's book collection</p>
        </div>
        <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add New Book
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-[#1a1625] p-4 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books..."
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

      {/* Books Table */}
      <div className="bg-[#1a1625] rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox"
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-4 text-left">Book Info</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Added Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((book) => (
                <tr key={book} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">The Design of Everyday Things</h3>
                        <p className="text-sm text-gray-400">Don Norman</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                      Design
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                      Available
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    Jan 19, 2024
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                        <Eye size={18} className="text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                        <PenTool size={18} className="text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
          <div className="text-gray-400">
            Showing 1 to 5 of 50 entries
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">1</button>
            <button className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors">2</button>
            <button className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors">3</button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBuku;