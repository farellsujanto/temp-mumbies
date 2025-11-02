import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  MoreHorizontal,
  Plus,
  Search
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Partner {
  id: string;
  organization_name: string;
  contact_email: string;
  contact_name: string;
  partner_type: string;
  status: string;
  mumbies_cash_balance: number;
  created_at: string;
  auth_user_id: string;
}

export default function AdminPartnersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, [statusFilter, searchQuery]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('nonprofits')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.or(`organization_name.ilike.%${searchQuery}%,contact_email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId: string) => {
    if (!confirm('Approve this partner application?')) return;

    try {
      // Update nonprofit status
      const { error: nonprofitError } = await supabase
        .from('nonprofits')
        .update({
          status: 'active',
          approved_at: new Date().toISOString()
        })
        .eq('id', partnerId);

      if (nonprofitError) throw nonprofitError;

      // Get the nonprofit to find auth_user_id
      const { data: nonprofit } = await supabase
        .from('nonprofits')
        .select('auth_user_id')
        .eq('id', partnerId)
        .single();

      if (nonprofit?.auth_user_id) {
        // Update user to activate partner features
        await supabase
          .from('users')
          .update({
            is_partner: true,
            nonprofit_id: partnerId
          })
          .eq('id', nonprofit.auth_user_id);
      }

      // Log activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'approve_partner',
        p_entity_type: 'partner',
        p_entity_id: partnerId,
        p_notes: 'Partner application approved'
      });

      alert('Partner approved successfully!');
      fetchPartners();
    } catch (error) {
      console.error('Error approving partner:', error);
      alert('Failed to approve partner');
    }
  };

  const handleReject = async (partnerId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      await supabase
        .from('nonprofits')
        .update({ status: 'rejected' })
        .eq('id', partnerId);

      await supabase.rpc('log_admin_activity', {
        p_action_type: 'reject_partner',
        p_entity_type: 'partner',
        p_entity_id: partnerId,
        p_notes: reason || 'Partner application rejected'
      });

      alert('Partner rejected');
      fetchPartners();
    } catch (error) {
      console.error('Error rejecting partner:', error);
      alert('Failed to reject partner');
    }
  };

  const handleSuspend = async (partnerId: string) => {
    const reason = prompt('Reason for suspension:');
    if (!reason) return;

    try {
      await supabase
        .from('nonprofits')
        .update({ status: 'suspended' })
        .eq('id', partnerId);

      await supabase.rpc('log_admin_activity', {
        p_action_type: 'suspend_partner',
        p_entity_type: 'partner',
        p_entity_id: partnerId,
        p_notes: reason
      });

      alert('Partner suspended');
      fetchPartners();
    } catch (error) {
      console.error('Error suspending partner:', error);
      alert('Failed to suspend partner');
    }
  };

  const handleActivate = async (partnerId: string) => {
    if (!confirm('Reactivate this partner?')) return;

    try {
      await supabase
        .from('nonprofits')
        .update({ status: 'active' })
        .eq('id', partnerId);

      await supabase.rpc('log_admin_activity', {
        p_action_type: 'activate_partner',
        p_entity_type: 'partner',
        p_entity_id: partnerId,
        p_notes: 'Partner reactivated'
      });

      alert('Partner activated');
      fetchPartners();
    } catch (error) {
      console.error('Error activating partner:', error);
      alert('Failed to activate partner');
    }
  };

  const statusCounts = {
    all: partners.length,
    pending: partners.filter(p => p.status === 'pending').length,
    active: partners.filter(p => p.status === 'active').length,
    suspended: partners.filter(p => p.status === 'suspended').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
            <p className="text-gray-600 mt-1">Manage partner applications and accounts</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex gap-2">
              <StatusTab
                label="All"
                count={statusCounts.all}
                active={statusFilter === 'all'}
                onClick={() => setSearchParams({ status: 'all' })}
              />
              <StatusTab
                label="Pending"
                count={statusCounts.pending}
                active={statusFilter === 'pending'}
                onClick={() => setSearchParams({ status: 'pending' })}
                variant="warning"
              />
              <StatusTab
                label="Active"
                count={statusCounts.active}
                active={statusFilter === 'active'}
                onClick={() => setSearchParams({ status: 'active' })}
                variant="success"
              />
              <StatusTab
                label="Suspended"
                count={statusCounts.suspended}
                active={statusFilter === 'suspended'}
                onClick={() => setSearchParams({ status: 'suspended' })}
                variant="danger"
              />
            </div>

            {/* Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    newParams.set('q', e.target.value);
                  } else {
                    newParams.delete('q');
                  }
                  setSearchParams(newParams);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Partners Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No partners found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {partners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{partner.organization_name}</p>
                          <p className="text-sm text-gray-500">{partner.contact_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {partner.partner_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            partner.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : partner.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${partner.mumbies_cash_balance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(partner.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === partner.id ? null : partner.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {actionMenuOpen === partner.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <Link
                                to={`/partner/${partner.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setActionMenuOpen(null)}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Link>

                              {partner.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleApprove(partner.id);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleReject(partner.id);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-50"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </button>
                                </>
                              )}

                              {partner.status === 'active' && (
                                <button
                                  onClick={() => {
                                    handleSuspend(partner.id);
                                    setActionMenuOpen(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-700 hover:bg-gray-50"
                                >
                                  <Ban className="h-4 w-4" />
                                  Suspend
                                </button>
                              )}

                              {partner.status === 'suspended' && (
                                <button
                                  onClick={() => {
                                    handleActivate(partner.id);
                                    setActionMenuOpen(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-50"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Reactivate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

interface StatusTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant?: 'warning' | 'success' | 'danger';
}

function StatusTab({ label, count, active, onClick, variant }: StatusTabProps) {
  const getColors = () => {
    if (active) {
      switch (variant) {
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'success':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'danger':
          return 'bg-red-100 text-red-800 border-red-300';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    }
    return 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${getColors()}`}
    >
      {label} ({count})
    </button>
  );
}
