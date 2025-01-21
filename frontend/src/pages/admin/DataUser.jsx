import React, { useEffect, useState } from 'react';
import { User } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';

const DataUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const usersPerPage = 10;

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

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: 'Jan 19, 2024',
    },
    {
      id: 2,
      name: 'Cantika Aurel',
      email: 'aurel@gmail.com',
      role: 'User',
      status: 'Active',
      joinDate: 'Jan 18, 2024',
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Petugas',
      status: 'Inactive',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 4,
      name: 'Henry Jonathan',
      email: 'henry@gmail.com',
      role: 'Admin',
      status: 'Active',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 5,
      name: 'Nala Rohmatal',
      email: 'nala@gmail.com',
      role: 'Petugas',
      status: 'Inactive',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 6,
      name: 'Nila Rohmatal',
      email: 'nila@gmail.com',
      role: 'Petugas',
      status: 'Inactive',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 7,
      name: 'Hyura Developer',
      email: 'hyuradev@gmail.com',
      role: 'Admin',
      status: 'Active',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 8,
      name: 'Hyura',
      email: 'hyura@gmail.com',
      role: 'User',
      status: 'Inactive',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 9,
      name: 'Abel Putra',
      email: 'abel@gmail.com',
      role: 'User',
      status: 'Active',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 10,
      name: 'Fauzi',
      email: 'fauzi@gmail.com',
      role: 'User',
      status: 'Active',
      joinDate: 'Jan 17, 2024',
    },
    {
      id: 11,
      name: 'Wafi Udin',
      email: 'udin@gmail.com',
      role: 'User',
      status: 'Active',
      joinDate: 'Jan 17, 2024',
    },
  ];

  // Efek untuk filter data berdasarkan pencarian dengan debounce
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(results);
  }, [searchQuery]);

  // Efek untuk memperbarui data paginasi
  useEffect(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setPaginatedUsers(filteredUsers.slice(startIndex, endIndex));
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filteredUsers.length / usersPerPage)) return;
    setCurrentPage(page);
  };

  // Set data awal ke semua users
  useEffect(() => {
    setFilteredUsers(mockUsers);
  }, []);

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

      <SearchFilterBar
        searchPlaceholder="Search users..."
        onSearch={(e) => setSearchQuery(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={paginatedUsers}
        renderRow={renderUserRow}
        totalEntries={filteredUsers.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        entriesPerPage={usersPerPage}
      />

    </div>
  );
};

export default DataUser;
