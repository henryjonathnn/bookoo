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
                <th 
                  key={index} 
                  className={`px-3 py-3 text-left text-sm font-medium ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
      </div>

      {/* Mobile Pagination */}
      <div className="px-4 py-3 border-t border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-sm text-gray-400 order-2 md:order-1">
          Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
          {Math.min(currentPage * entriesPerPage, totalEntries)} dari {totalEntries} data
        </div>
        <div className="flex items-center justify-center gap-1 order-1 md:order-2">
          <button
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          
          {/* Show limited page numbers on mobile */}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(page => {
              if (totalPages <= 5) return true;
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 1) return true;
              return false;
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="text-gray-600">...</span>
                )}
                <button
                  className={`min-w-[32px] h-8 ${
                    currentPage === page
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'hover:bg-gray-800'
                  } rounded-lg transition-colors text-sm`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
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
