import React, { useState, useEffect } from 'react';
import { User } from 'react-feather';
import PageHeader from '../../components/modules/admin/PageHeader';
import SearchFilterBar from '../../components/modules/admin/SearchFilterBar';
import DataTable from '../../components/modules/admin/DataTable';
import TombolAksi from '../../components/modules/admin/TombolAksi';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: ''
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Define columns after handleSelectAll is declared
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

  useEffect(() => {
    fetchUsers();
  }, [params]);

  const fetchUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await userService.getUsers(params);
      setUsers(data.users);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    // Debounce implementation
    const timeoutId = setTimeout(() => {
      setParams(prev => ({
        ...prev,
        search: value,
        page: 1 // Reset to first page on new search
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handlePageChange = (page) => {
    setParams(prev => ({
      ...prev,
      page
    }));
  };

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
        value={params.search}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          renderRow={renderUserRow}
          totalEntries={totalItems}
          currentPage={params.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          entriesPerPage={params.limit}
        />
      )}
    </div>
  );
};

export default DataUser;