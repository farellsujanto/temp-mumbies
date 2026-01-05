'use client';

import { useState, useEffect } from 'react';
import { Users as UsersIcon, Loader2, Search, RefreshCw, Edit2 } from 'lucide-react';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import { UserRole, PartnerTag as PrismaPartnerTag, User as PrismaUser } from '@/generated/prisma/client';

interface PartnerTag extends PrismaPartnerTag {}

interface User extends PrismaUser {
  partnerTag: PartnerTag | null;
  _count: {
    referredUsers: number;
    partnerApplications: number;
  };
}

type RoleFilter = 'ALL' | UserRole;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [partnerTags, setPartnerTags] = useState<PartnerTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    role: UserRole;
    partnerTagId: number | null;
  }>({
    role: 'CUSTOMER',
    partnerTagId: null,
  });

  useEffect(() => {
    fetchPartnerTags();
  }, []);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchUsers(0, true);
  }, [roleFilter]);

  const fetchUsers = async (currentOffset: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        limit: '50',
        offset: currentOffset.toString(),
      });

      if (roleFilter !== 'ALL') {
        params.append('role', roleFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await fetch(`/api/v1/admin/users?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        const newUsers = data.data.users;
        setUsers(reset ? newUsers : [...users, ...newUsers]);
        setTotal(data.data.total);
        setHasMore(currentOffset + newUsers.length < data.data.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchPartnerTags = async () => {
    try {
      const res = await fetch('/api/v1/admin/partner-tags');
      const data = await res.json();
      if (data.success) {
        setPartnerTags(data.data);
      }
    } catch (error) {
      console.error('Error fetching partner tags:', error);
    }
  };

  const handleSearch = () => {
    setOffset(0);
    setHasMore(true);
    fetchUsers(0, true);
  };

  const loadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchUsers(newOffset);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      role: user.role,
      partnerTagId: user.partnerTagId,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          role: editFormData.role,
          partnerTagId: editFormData.partnerTagId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers(0, true);
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-600';
      case 'PARTNER':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
        <p className="text-gray-600">Manage user roles and partner tags</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <AdminInput
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or referral code..."
                className="flex-1"
              />
              <AdminButton
                onClick={handleSearch}
                icon={Search}
                variant="primary"
              >
                Search
              </AdminButton>
            </div>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-600"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PARTNER">Partner</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner Tag
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred Users
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.partnerTag ? (
                          <div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                              {user.partnerTag.name}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {Number(user.partnerTag.referralPercentage).toFixed(2)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                          {user.referralCode}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user._count.referredUsers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 text-center">
              <AdminButton
                onClick={loadMore}
                disabled={loadingMore}
                variant="primary"
                icon={loadingMore ? Loader2 : RefreshCw}
                className="mx-auto"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </AdminButton>
              <p className="text-sm text-gray-500 mt-2">
                Showing {users.length} of {total} users
              </p>
            </div>
          )}
        </>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit User: {editingUser.name || editingUser.email}
            </h2>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role *
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-600"
                  required
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="PARTNER">Partner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Tag
                </label>
                <select
                  value={editFormData.partnerTagId || ''}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    partnerTagId: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-600"
                  disabled={editFormData.role !== 'PARTNER'}
                >
                  <option value="">No Partner Tag</option>
                  {partnerTags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name} ({Number(tag.referralPercentage).toFixed(2)}%)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {editFormData.role !== 'PARTNER' && 'Partner tag can only be assigned to users with Partner role'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  variant="secondary"
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="flex-1"
                  icon={submitting ? Loader2 : undefined}
                >
                  Update User
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
