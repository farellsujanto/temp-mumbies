import { useEffect, useState } from 'react';
import { supabase } from '@mumbies/shared';
import { Users, Search, Plus, Ban, CheckCircle, Mail, Shield, Award, User as UserIcon, MoreVertical, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Account {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_partner: boolean;
  is_suspended: boolean;
  suspended_at: string | null;
  suspension_reason: string | null;
  account_type: string;
  nonprofit_id: string | null;
  created_at: string;
  total_orders: number;
  total_spent: number;
  nonprofit?: {
    organization_name: string;
    status: string;
  } | null;
}

type AccountFilter = 'all' | 'admin' | 'partner' | 'customer' | 'suspended';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<AccountFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accounts, searchQuery, filter]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          is_admin,
          is_partner,
          is_suspended,
          suspended_at,
          suspension_reason,
          account_type,
          nonprofit_id,
          created_at,
          total_orders,
          total_spent,
          nonprofit:nonprofits!users_nonprofit_id_fkey(
            organization_name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(account => ({
        ...account,
        nonprofit: Array.isArray(account.nonprofit) ? account.nonprofit[0] : account.nonprofit
      })) || [];

      setAccounts(formattedData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...accounts];

    if (filter === 'admin') {
      filtered = filtered.filter(a => a.is_admin);
    } else if (filter === 'partner') {
      filtered = filtered.filter(a => a.is_partner);
    } else if (filter === 'customer') {
      filtered = filtered.filter(a => !a.is_admin && !a.is_partner);
    } else if (filter === 'suspended') {
      filtered = filtered.filter(a => a.is_suspended);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.email.toLowerCase().includes(query) ||
          a.full_name?.toLowerCase().includes(query) ||
          a.nonprofit?.organization_name?.toLowerCase().includes(query)
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleSuspendUser = async (account: Account) => {
    const reason = prompt(`Why are you suspending ${account.email}?`);
    if (!reason) return;

    try {
      const { error } = await supabase.rpc('admin_suspend_user', {
        p_user_id: account.id,
        p_reason: reason
      });

      if (error) throw error;

      alert(`User ${account.email} has been suspended`);
      fetchAccounts();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleActivateUser = async (account: Account) => {
    const reason = prompt(`Why are you reactivating ${account.email}?`);
    if (!reason) return;

    try {
      const { error } = await supabase.rpc('admin_activate_user', {
        p_user_id: account.id,
        p_reason: reason
      });

      if (error) throw error;

      alert(`User ${account.email} has been reactivated`);
      fetchAccounts();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const getAccountTypeBadge = (account: Account) => {
    if (account.is_suspended) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
          <Ban className="h-3 w-3" />
          Suspended
        </span>
      );
    }
    if (account.is_admin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
          <Shield className="h-3 w-3" />
          Admin
        </span>
      );
    }
    if (account.is_partner) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
          <Award className="h-3 w-3" />
          Partner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
        <UserIcon className="h-3 w-3" />
        Customer
      </span>
    );
  };

  const stats = {
    total: accounts.length,
    admins: accounts.filter(a => a.is_admin).length,
    partners: accounts.filter(a => a.is_partner).length,
    customers: accounts.filter(a => !a.is_admin && !a.is_partner).length,
    suspended: accounts.filter(a => a.is_suspended).length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Accounts</h1>
            <p className="text-gray-600 mt-1">Manage all user accounts across the platform</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Accounts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600">Admins</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{stats.admins}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">Partners</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.partners}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">Customers</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.customers}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">Suspended</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.suspended}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('admin')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === 'admin'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setFilter('partner')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === 'partner'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  Partners
                </button>
                <button
                  onClick={() => setFilter('customer')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === 'customer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setFilter('suspended')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === 'suspended'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Suspended
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {account.full_name || 'No name set'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {account.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getAccountTypeBadge(account)}</td>
                      <td className="px-6 py-4">
                        {account.nonprofit ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {account.nonprofit.organization_name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {account.nonprofit.status}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{account.total_orders}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${account.total_spent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(account.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {account.is_suspended ? (
                            <button
                              onClick={() => handleActivateUser(account)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Activate
                            </button>
                          ) : !account.is_admin && (
                            <button
                              onClick={() => handleSuspendUser(account)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                            >
                              <Ban className="h-3 w-3" />
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredAccounts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {filteredAccounts.length} of {accounts.length} accounts
              </p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAccounts();
          }}
        />
      )}
    </AdminLayout>
  );
}

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'partner' | 'admin'>('customer');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase.rpc('admin_create_user', {
        p_email: email,
        p_full_name: fullName,
        p_account_type: accountType,
        p_is_admin: accountType === 'admin',
        p_is_partner: accountType === 'partner'
      });

      if (error) throw error;

      alert(`User created successfully! Email: ${email}`);
      onSuccess();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type *
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              Note: User will need to set their password through the password reset flow.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
