import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await api.get('/users', { params });
      setUsers(res.data.data || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      toast.error(err.formattedMessage || 'Action failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Manage Users
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administer candidate and recruiter accounts and permissions
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Loading users..." />
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No registered accounts matched your search." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u._id, u.isActive)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        u.isActive
                          ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                          : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold px-4">
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
