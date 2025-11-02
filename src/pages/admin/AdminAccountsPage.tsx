import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Search, Filter, Mail, Shield, Award, User as UserIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Account {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_partner: boolean;
  nonprofit_id: string | null;
  created_at: string;
  total_orders: number;
  total_spent: number;
  nonprofit?: {
    organization_name: string;
    status: string;
  } | null;
}

type AccountFilter = 'all' | 'admin' | 'partner' | 'customer';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<AccountFilter>('all');

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

  const getAccountTypeBadge = (account: Account) => {
    if (account.is_admin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Accounts</h1>
          <p className="text-gray-600 mt-1">Manage all user accounts across the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Accounts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">Admins</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.admins}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">Partners</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.partners}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">Customers</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.customers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
              <div className="flex gap-2">
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
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
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
                    Type
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
    </AdminLayout>
  );
}
