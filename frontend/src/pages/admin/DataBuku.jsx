import React, { useState } from 'react';
import { BookOpen } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';

const DataBuku = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const columns = [
    {
      header: <input 
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
      />
    },
    { header: 'Book Info' },
    { header: 'Category' },
    { header: 'Status' },
    { header: 'Added Date' },
    { header: 'Actions' }
  ];

  const mockBooks = [1, 2, 3, 4, 5].map((id) => ({
    id,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Design',
    status: 'Available',
    addedDate: 'Jan 19, 2024'
  }));

  const renderBookRow = (book, index) => (
    <tr key={book.id} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors">
      <td className="px-6 py-4">
        <input 
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedBooks.includes(book.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBooks([...selectedBooks, book.id]);
            } else {
              setSelectedBooks(selectedBooks.filter(id => id !== book.id));
            }
          }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
            <BookOpen className="text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium">{book.title}</h3>
            <p className="text-sm text-gray-400">{book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
          {book.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
          {book.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {book.addedDate}
      </td>
      <td className="px-6 py-4">
        <TombolAksi />
      </td>
    </tr>
  );

  return (
    <div className="pt-16">
      <PageHeader 
        title="Books Management"
        subtitle="Manage and organize your library's book collection"
        buttonLabel="Add New Book"
      />
      
      <SearchFilterBar searchPlaceholder="Search books..." />
      
      <DataTable
        columns={columns}
        data={mockBooks}
        renderRow={renderBookRow}
        totalEntries={50}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DataBuku;