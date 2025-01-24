import React, { useCallback, useEffect, useState } from 'react';
import { User } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { useUsers } from '../../hooks/useUsers';
import { toast } from 'react-hot-toast';
import FormModal from '../../components/modules/admin/FormModal';
import { userService } from '../../services/userService';

const DataUser = () => {
  // Initialize with default values
  const {
    users,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    updateParams,
    refresh
  } = useUsers({
    page: 1,
    limit: 10,
    search: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userFormConfig = {
    type: 'user',
    title: 'User',
    imageField: 'profile_img',
    fields: [
      { id: 'name', label: 'Nama', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'username', label: 'Username', required: true },
      { id: 'password', label: 'Password', type: 'password', required: true },
      {
        id: 'role',
        label: 'Role',
        required: true,
        component: ({ value, onChange, options }) => (
          <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Pilih Role</option>
            {options.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        ),
        options: ['USER', 'STAFF', 'ADMIN']
      }
    ]
  };

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Search handler with debounce
  const handleSearch = useCallback((searchValue) => {
    updateParams({ search: searchValue, page: 1 });
  }, [updateParams]);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((book) => {
    setSelectedUser(book);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
        toast.success('User updated successfully!');
      } else {
        await userService.createUser(formData);
        toast.success('User created successfully!');
      }
      refresh();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };


  // Select all handler
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked && users?.length > 0) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [users]);

  // Individual select handler
  const handleSelectUser = useCallback((userId, checked) => {
    setSelectedUsers(prev => {
      if (checked) {
        return [...prev, userId];
      }
      return prev.filter(id => id !== userId);
    });
  }, []);

  const columns = [
    {
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        onChange={handleSelectAll}
        checked={users?.length > 0 && selectedUsers.length === users.length}
      />
    },
    { header: 'User Info' },
    { header: 'Role' },
    { header: 'Status' },
    { header: 'Join Date' },
    { header: 'Actions' }
  ];

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const renderUserRow = useCallback((user) => (
    <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
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
          Active
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4">
        <TombolAksi onEdit={() => handleOpenEditModal(user)}
          onDelete={() => userService.deleteUser(user.id)}
          onRefresh={refresh} />
      </td>
    </tr>
  ), [selectedUsers, handleSelectUser, formatDate, refresh]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="pt-16">
      <PageHeader
        title="User Management"
        subtitle="Manage and organize your system users"
        buttonLabel="Tambah User"
        onButtonClick={handleOpenCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Search users..."
        onSearch={handleSearch}
        initialValue=""
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          renderRow={renderUserRow}
          totalEntries={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          entriesPerPage={10}
        />
      )}

      {isModalOpen && (
        <FormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedUser}
          formConfig={userFormConfig}
        />
      )}
    </div>
  );
};

export default DataUser;