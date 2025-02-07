import React, { useCallback, useEffect, useState } from 'react';
import { User, Filter, Download } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { useUsers } from '../../hooks/useUsers';
import { toast } from 'react-hot-toast';
import FormModal from '../../components/modules/admin/FormModal';
import { userService } from '../../services/userService';
import { API_CONFIG } from '../../config/api.config';
import DetailModal from '../../components/modules/admin/DetailModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DataUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    active: 'ACTIVE'
  })

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
    search: '',
    ...filters
  });

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    updateParams({
      ...newFilters,
      page: 1
    })
  }

  // INI FORM
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

  // INI DETAIL
  const userDetailConfig = {
    title: 'Detail User',
    imageField: 'profile_img',
    defaultIcon: User,
    primaryTextField: 'name',
    secondaryFields: [
      { key: 'email', label: 'Email' },
      { key: 'username', label: 'Username' }
    ],
    sections: [
      {
        title: 'Informasi Akun',
        fields: [
          { key: 'role', label: 'Role' },
          { key: 'createdAt', label: 'Tanggal Bergabung', format: (date) => new Date(date).toLocaleDateString() }
        ]
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
        toast.success('User berhasil diupdate!');
      } else {
        await userService.createUser(formData);
        toast.success('User berhasil ditambahkan!');
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

  const handleOpenDetailModal = useCallback((user) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setSelectedUser(null)
    setIsDetailModalOpen(false)
  }, [])

  const handleDelete = async (id) => {
    try {
      const response = await userService.deleteUser(id);
      return response; // Ini akan mengembalikan {status: true, message: "User berhasil dihapus"}
    } catch (error) {
      throw error;
    }
  };

  const columns = [
    {
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 hidden md:block"
        onChange={handleSelectAll}
        checked={users?.length > 0 && selectedUsers.length === users.length}
      />,
      className: 'hidden md:table-cell w-[5%] px-2 lg:px-6 py-3'
    },
    {
      header: 'User Info',
      className: 'text-left px-2 lg:px-6 py-3 w-[60%] sm:w-[40%]'
    },
    {
      header: 'Role',
      className: 'hidden sm:table-cell px-2 lg:px-6 py-3 w-[15%]'
    },
    {
      header: 'Status',
      className: 'hidden sm:table-cell px-2 lg:px-6 py-3 w-[15%]'
    },
    {
      header: 'Join Date',
      className: 'hidden md:table-cell px-2 lg:px-6 py-3 w-[15%]'
    },
    {
      header: 'Actions',
      className: 'text-right sm:text-left px-2 lg:px-6 py-3 w-[40%] sm:w-[10%]'
    }
  ];

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const renderUserRow = useCallback((user) => (
    <tr key={user.id}
      className="border-b border-gray-800 hover:bg-[#2a2435] transition-colors cursor-pointer"
      onClick={() => { handleOpenDetailModal(user) }}>
      <td className="hidden md:table-cell px-2 lg:px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectUser(user.id, e.target.checked);
          }}
        />
      </td>
      <td className="px-2 lg:px-6 py-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
            {user.profile_img ? (
              <img
                src={`${API_CONFIG.baseURL}${user.profile_img}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-xs sm:text-sm lg:text-base truncate">{user.name}</h3>
            <p className="text-xs text-gray-400 truncate hidden sm:block">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-2 lg:px-6 py-4">
        <span className="px-2 py-1 text-xs lg:text-sm bg-blue-500/10 text-blue-400 rounded">
          {user.role}
        </span>
      </td>
      <td className="hidden sm:table-cell px-2 lg:px-6 py-4">
        <span className={`px-2 py-1 text-xs lg:text-sm rounded ${user.is_active
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400'
          }`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="hidden md:table-cell px-2 lg:px-6 py-4 text-gray-400 text-xs">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-2 lg:px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end sm:justify-start">
          <TombolAksi
            onEdit={() => handleOpenEditModal(user)}
            onDelete={() => handleDelete(user.id)}
            onRefresh={refresh}
          />
        </div>
      </td>
    </tr>
  ), [selectedUsers, handleSelectUser, formatDate, refresh]);

  return (
    <div className="pt-16">
      <PageHeader
        title="Data User"
        subtitle="Pengelolaan data user yang ada di perpustakaan BooKoo"
        buttonLabel="Tambah User"
        onButtonClick={handleOpenCreateModal}
      />

      <SearchFilterBar
        searchPlaceholder="Cari user..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterType="user"
        initialValue=""
        initialFilters={filters}
        className="w-full"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full">
          <div className="inline-block min-w-full align-middle">
            <DataTable
              columns={columns}
              data={users}
              renderRow={renderUserRow}
              totalEntries={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              entriesPerPage={10}
              className="w-full text-sm"
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <FormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedUser}
          formConfig={userFormConfig}
          apiConfig={API_CONFIG}
        />
      )}

      <DetailModal
        data={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        config={userDetailConfig}
      />
    </div>
  );
};

export default DataUser;