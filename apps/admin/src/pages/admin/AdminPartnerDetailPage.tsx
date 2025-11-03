import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@mumbies/shared';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Gift,
  Award,
  AlertTriangle,
  CheckCircle,
  Ban,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  History,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface PartnerDetails {
  partner: any;
  user: any;
  balance_info: {
    current_balance: number;
    user_balance: number;
    balance_synced: boolean;
    pending_reservations: number;
    available_balance: number;
  };
  statistics: {
    total_transactions: number;
    total_earned: number;
    total_spent: number;
    total_leads: number;
    active_giveaways: number;
    completed_rewards: number;
  };
  recent_transactions: any[];
  recent_adjustments: any[];
}

export default function AdminPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<PartnerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'giveaways' | 'rewards'>('overview');

  // Adjustment modal state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [adjustmentReason, setAdjustmentReason] = useState('bonus');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchPartnerDetails();
    }
  }, [id]);

  const fetchPartnerDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_partner_details', {
        p_partner_id: id
      });

      if (error) throw error;
      setDetails(data);
    } catch (error) {
      console.error('Error fetching partner details:', error);
      alert('Failed to load partner details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!adjustAmount || parseFloat(adjustAmount) === 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!adjustmentNotes.trim()) {
      alert('Please provide a reason for this adjustment');
      return;
    }

    setAdjusting(true);

    try {
      const amount = adjustType === 'add'
        ? parseFloat(adjustAmount)
        : -parseFloat(adjustAmount);

      const { data, error } = await supabase.rpc('admin_adjust_partner_balance', {
        p_partner_id: id,
        p_amount: amount,
        p_adjustment_type: adjustmentReason,
        p_reason: adjustmentNotes,
        p_notes: adjustmentNotes
      });

      if (error) throw error;

      alert(`Balance ${adjustType === 'add' ? 'added' : 'removed'} successfully!`);
      setShowAdjustModal(false);
      setAdjustAmount('');
      setAdjustmentNotes('');
      fetchPartnerDetails();
    } catch (error: any) {
      console.error('Error adjusting balance:', error);
      alert(error.message || 'Failed to adjust balance');
    } finally {
      setAdjusting(false);
    }
  };

  const handleFixMismatch = async (useSource: 'user' | 'partner') => {
    if (!confirm(`Sync balance using ${useSource} table as source?`)) return;

    setFixing(true);
    try {
      const { data, error } = await supabase.rpc('admin_fix_balance_mismatch', {
        p_partner_id: id,
        p_use_source: useSource
      });

      if (error) throw error;

      alert('Balance synced successfully!');
      fetchPartnerDetails();
    } catch (error: any) {
      console.error('Error fixing mismatch:', error);
      alert(error.message || 'Failed to fix mismatch');
    } finally {
      setFixing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change partner status to "${newStatus}"?`)) return;

    try {
      const { error } = await supabase
        .from('nonprofits')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      alert('Status updated successfully!');
      fetchPartnerDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
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

  if (!details) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Partner not found</p>
          <Link to="/partners" className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Back to Partners
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { partner, user, balance_info, statistics, recent_transactions, recent_adjustments } = details;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/partners')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{partner.organization_name}</h1>
              <p className="text-gray-600 mt-1">{partner.partner_type}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                partner.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : partner.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {partner.status}
            </span>

            {partner.status === 'active' && (
              <button
                onClick={() => handleStatusChange('suspended')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Suspend
              </button>
            )}

            {partner.status === 'suspended' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Reactivate
              </button>
            )}
          </div>
        </div>

        {/* Balance Mismatch Alert */}
        {!balance_info.balance_synced && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-sm">Balance Mismatch Detected</h4>
                <p className="text-red-700 text-sm mt-1">
                  User balance (${balance_info.user_balance.toFixed(2)}) does not match Partner balance (${balance_info.current_balance.toFixed(2)})
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFixMismatch('user')}
                  disabled={fixing}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                >
                  Use User Balance
                </button>
                <button
                  onClick={() => handleFixMismatch('partner')}
                  disabled={fixing}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                >
                  Use Partner Balance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mumbies Cash Balance</h3>
              <button
                onClick={() => setShowAdjustModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                Adjust Balance
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">${balance_info.current_balance.toFixed(2)}</p>
              </div>
              {balance_info.pending_reservations > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Pending Reservations</p>
                  <p className="text-lg font-semibold text-yellow-600">${balance_info.pending_reservations.toFixed(2)}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-lg font-semibold text-green-600">${balance_info.available_balance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <StatCard
            title="Total Earned"
            value={`$${statistics.total_earned.toFixed(2)}`}
            icon={TrendingUp}
            color="green"
          />

          <StatCard
            title="Total Spent"
            value={`$${statistics.total_spent.toFixed(2)}`}
            icon={TrendingDown}
            color="red"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Transactions"
            value={statistics.total_transactions}
            icon={History}
            color="gray"
          />
          <StatCard
            title="Total Leads"
            value={statistics.total_leads}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Giveaways"
            value={statistics.active_giveaways}
            icon={Gift}
            color="purple"
          />
          <StatCard
            title="Completed Rewards"
            value={statistics.completed_rewards}
            icon={Award}
            color="yellow"
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactItem icon={Mail} label="Email" value={partner.contact_email} />
            <ContactItem icon={Phone} label="Phone" value={partner.contact_phone || 'Not provided'} />
            <ContactItem icon={MapPin} label="Address" value={partner.address || 'Not provided'} />
            <ContactItem
              icon={Calendar}
              label="Joined"
              value={new Date(partner.created_at).toLocaleDateString()}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                label="Overview"
              />
              <TabButton
                active={activeTab === 'transactions'}
                onClick={() => setActiveTab('transactions')}
                label={`Transactions (${recent_transactions.length})`}
              />
              <TabButton
                active={activeTab === 'giveaways'}
                onClick={() => setActiveTab('giveaways')}
                label="Giveaways"
              />
              <TabButton
                active={activeTab === 'rewards'}
                onClick={() => setActiveTab('rewards')}
                label="Rewards"
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab
                transactions={recent_transactions}
                adjustments={recent_adjustments}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionsTab partnerId={id!} />
            )}
            {activeTab === 'giveaways' && (
              <GiveawaysTab partnerId={id!} />
            )}
            {activeTab === 'rewards' && (
              <RewardsTab partnerId={id!} />
            )}
          </div>
        </div>

        {/* Adjust Balance Modal */}
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Mumbies Cash Balance</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdjustType('add')}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        adjustType === 'add'
                          ? 'bg-green-50 border-green-600 text-green-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Add Cash
                    </button>
                    <button
                      onClick={() => setAdjustType('remove')}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        adjustType === 'remove'
                          ? 'bg-red-50 border-red-600 text-red-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Remove Cash
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <select
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="bonus">Bonus</option>
                    <option value="refund">Refund</option>
                    <option value="penalty">Penalty</option>
                    <option value="correction">Correction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Required)
                  </label>
                  <textarea
                    value={adjustmentNotes}
                    onChange={(e) => setAdjustmentNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Explain why this adjustment is being made..."
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-700">
                    Current Balance: <span className="font-semibold">${balance_info.current_balance.toFixed(2)}</span>
                  </p>
                  {adjustAmount && (
                    <p className="text-gray-700 mt-1">
                      New Balance:{' '}
                      <span className="font-semibold">
                        $
                        {(
                          balance_info.current_balance +
                          (adjustType === 'add' ? 1 : -1) * parseFloat(adjustAmount || '0')
                        ).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={adjusting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustBalance}
                  disabled={adjusting || !adjustAmount || !adjustmentNotes.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {adjusting ? 'Processing...' : 'Apply Adjustment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
        active
          ? 'border-green-600 text-green-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

function OverviewTab({ transactions, adjustments }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Recent Transactions</h4>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.description}</p>
                  <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {adjustments.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Recent Admin Adjustments</h4>
          <div className="space-y-2">
            {adjustments.map((a: any) => (
              <div key={a.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.reason}</p>
                    <p className="text-xs text-gray-600 mt-1">{a.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {a.admin_name || a.admin_email} on {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${a.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {a.amount >= 0 ? '+' : ''}${a.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionsTab({ partnerId }: { partnerId: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [partnerId]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('partner_transactions')
      .select('*')
      .eq('nonprofit_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setTransactions(data);
    setLoading(false);
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  if (transactions.length === 0) {
    return <p className="text-sm text-gray-500">No transactions found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {t.transaction_type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{t.description}</td>
              <td className={`px-4 py-3 text-sm text-right font-semibold ${
                t.amount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                ${t.balance_after?.toFixed(2) || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GiveawaysTab({ partnerId }: { partnerId: string }) {
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGiveaways();
  }, [partnerId]);

  const fetchGiveaways = async () => {
    const { data } = await supabase
      .from('partner_giveaways')
      .select(`
        *,
        bundle:bundle_id (
          name,
          retail_value,
          tier
        )
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (data) setGiveaways(data);
    setLoading(false);
  };

  const handleStatusChange = async (giveawayId: string, newStatus: string) => {
    if (!confirm(`Change giveaway status to "${newStatus}"?`)) return;

    const { error } = await supabase
      .from('partner_giveaways')
      .update({ status: newStatus })
      .eq('id', giveawayId);

    if (!error) {
      alert('Status updated!');
      fetchGiveaways();
    } else {
      alert('Failed to update status');
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  if (giveaways.length === 0) {
    return <p className="text-sm text-gray-500">No giveaways created yet</p>;
  }

  return (
    <div className="space-y-4">
      {giveaways.map((giveaway) => (
        <div key={giveaway.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{giveaway.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  giveaway.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : giveaway.status === 'ended'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {giveaway.status}
                </span>
                {giveaway.bundle && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    giveaway.bundle.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                    giveaway.bundle.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    giveaway.bundle.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {giveaway.bundle.tier} - ${giveaway.bundle.retail_value}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{giveaway.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Entries:</span>
                  <span className="ml-2 font-semibold text-gray-900">{giveaway.total_entries || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">Leads Generated:</span>
                  <span className="ml-2 font-semibold text-gray-900">{giveaway.total_leads_generated || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ends:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date(giveaway.ends_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Landing Page:{' '}
                  <a
                    href={`https://mumbies.com/giveaway/${giveaway.landing_page_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    mumbies.com/giveaway/{giveaway.landing_page_slug}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {giveaway.status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusChange(giveaway.id, 'paused')}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleStatusChange(giveaway.id, 'ended')}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    End
                  </button>
                </>
              )}
              {giveaway.status === 'paused' && (
                <button
                  onClick={() => handleStatusChange(giveaway.id, 'active')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RewardsTab({ partnerId }: { partnerId: string }) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewardProgress();
  }, [partnerId]);

  const fetchRewardProgress = async () => {
    const { data } = await supabase
      .from('partner_reward_progress')
      .select(`
        *,
        reward:reward_id (
          title,
          description,
          reward_type,
          reward_value,
          reward_description,
          requirement_description
        )
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (data) setProgress(data);
    setLoading(false);
  };

  const handleClaimReward = async (progressId: string, rewardId: string) => {
    if (!confirm('Mark this reward as claimed?')) return;

    const { error: progressError } = await supabase
      .from('partner_reward_progress')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString()
      })
      .eq('id', progressId);

    if (!progressError) {
      await supabase
        .from('partner_reward_redemptions')
        .insert({
          partner_id: partnerId,
          reward_id: rewardId,
          progress_id: progressId,
          reward_type: 'manual_claim',
          redemption_method: 'admin_portal',
          fulfillment_status: 'pending'
        });

      alert('Reward claimed successfully!');
      fetchRewardProgress();
    } else {
      alert('Failed to claim reward');
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  if (progress.length === 0) {
    return <p className="text-sm text-gray-500">No rewards in progress</p>;
  }

  return (
    <div className="space-y-4">
      {progress.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{item.reward.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'claimed'
                    ? 'bg-blue-100 text-blue-800'
                    : item.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.reward.description}</p>
              <p className="text-sm text-gray-700 font-medium">
                Reward: {item.reward.reward_description || `$${item.reward.reward_value}`}
              </p>
            </div>
            {item.status === 'completed' && (
              <button
                onClick={() => handleClaimReward(item.id, item.reward_id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Mark as Claimed
              </button>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">
                {item.current_value} / {item.target_value} ({item.progress_percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(item.progress_percentage, 100)}%` }}
              />
            </div>
          </div>

          {item.reward.requirement_description && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Requirement:</strong> {item.reward.requirement_description}
              </p>
            </div>
          )}

          {item.completed_at && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Completed: {new Date(item.completed_at).toLocaleString()}
              </p>
            </div>
          )}

          {item.claimed_at && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Claimed: {new Date(item.claimed_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
