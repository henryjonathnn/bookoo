import React from 'react';
import { User } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { useUsers } from '../../hooks/useUsers';
import { toast } from 'react-hot-toast';

const DataUser = () => {
  const {
    users,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    updateParams,
    refresh
  } = useUsers();

  const [selectedUsers, setSelectedUsers] = React.useState([]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSearch = React.useCallback((searchValue) => {
    updateParams({ search: searchValue, page: 1 });
  }, [updateParams]);

  const handlePageChange = React.useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const columns = [
    {
      header: <input
        type="checkbox"
        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
        onChange={handleSelectAll}
        checked={selectedUsers.length === users.length && users.length > 0}
      />
    },
    { header: 'User Info' },
    { header: 'Role' },
    { header: 'Status' },
    { header: 'Join Date' },
    { header: 'Actions' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderUserRow = (user) => (
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
          Active
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4">
        <TombolAksi />
      </td>
    </tr>
  );

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
        buttonLabel="Add New User"
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
    </div>
  );
};

export default DataUser;