import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const DataTable = ({
  columns,
  data,
  renderRow,
  totalEntries,
  currentPage,
  onPageChange,
  entriesPerPage,
}) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <div className="bg-[#1a1625] rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 text-left">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
        <div className="text-gray-400">
          Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
          {Math.min(currentPage * entriesPerPage, totalEntries)} dari {totalEntries} data
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 ${
                currentPage === page
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-gray-800'
              } rounded-lg transition-colors`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
