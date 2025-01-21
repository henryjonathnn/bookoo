import React, { useState } from 'react';
import { User } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';

const DataUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const columns = [
    {
      header: <input 
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
      />
    },
    { header: 'User Info' },
    { header: 'Role' },
    { header: 'Status' },
    { header: 'Join Date' },
    { header: 'Actions' }
  ];

  const mockUsers = [1, 2, 3, 4, 5].map((id) => ({
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: 'Jan 19, 2024'
  }));

  const renderUserRow = (user, index) => (
    <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors">
      <td className="px-6 py-4">
        <input 
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, user.id]);
            } else {
              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
            }
          }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <User className="text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {user.joinDate}
      </td>
      <td className="px-6 py-4">
        <TombolAksi />
      </td>
    </tr>
  );

  return (
    <div className="pt-16">
      <PageHeader 
        title="User Management"
        subtitle="Manage and organize your system users"
        buttonLabel="Add New User"
      />
      
      <SearchFilterBar searchPlaceholder="Search users..." />
      
      <DataTable
        columns={columns}
        data={mockUsers}
        renderRow={renderUserRow}
        totalEntries={50}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DataUser