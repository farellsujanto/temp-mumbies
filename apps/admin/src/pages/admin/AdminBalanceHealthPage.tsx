import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@mumbies/shared';
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
  AlertCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface BalanceHealth {
  system_totals: {
    total_partners: number;
    total_mumbies_cash: number;
    total_user_balance: number;
    total_pending_reservations: number;
  };
  health_status: {
    mismatched_accounts: number;
    expired_reservations_pending_cleanup: number;
    failed_webhooks_last_24h: number;
  };
  mismatched_partners: Array<{
    partner_id: string;
    organization_name: string;
    user_balance: number;
    partner_balance: number;
    difference: number;
  }>;
  last_reconciliation: any;
}

export default function AdminBalanceHealthPage() {
  const [health, setHealth] = useState<BalanceHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [runningReconciliation, setRunningReconciliation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      console.log('[Balance Health] Fetching health data...');

      const { data, error } = await supabase.rpc('admin_get_balance_health', {});

      console.log('[Balance Health] Response:', { data, error });

      if (error) {
        console.error('[Balance Health] Error:', error);
        setErrorCode(error.code || null);

        // Schema cache error
        if (error.message?.includes('schema cache') || error.code === 'PGRST202') {
          setError('schema_cache');
          return;
        }

        // Function doesn't exist
        if (error.code === '42883') {
          setError('function_missing');
          return;
        }

        // Permission denied
        if (error.message?.includes('Only admins')) {
          setError('permission_denied');
          return;
        }

        // Generic error
        setError(error.message || 'Unknown error');
        return;
      }

      if (!data) {
        console.warn('[Balance Health] No data returned');
        setError('No data returned from balance health check');
        return;
      }

      console.log('[Balance Health] Success! Data:', data);
      setHealth(data);
    } catch (error: any) {
      console.error('[Balance Health] Failed to fetch:', error);
      setError(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
  };

  const handleRunReconciliation = async () => {
    if (!confirm('Run daily balance reconciliation now?')) return;

    setRunningReconciliation(true);
    try {
      const { data, error } = await supabase.rpc('daily_balance_reconciliation');
      if (error) throw error;

      alert(`Reconciliation complete! Status: ${data.health_status}`);
      fetchHealthData();
    } catch (error: any) {
      console.error('Error running reconciliation:', error);
      alert(error.message || 'Failed to run reconciliation');
    } finally {
      setRunningReconciliation(false);
    }
  };

  const handleExpireReservations = async () => {
    if (!confirm('Expire all old reservations now?')) return;

    try {
      const { data, error } = await supabase.rpc('expire_old_reservations');
      if (error) throw error;

      alert(`Expired ${data} reservations`);
      fetchHealthData();
    } catch (error: any) {
      console.error('Error expiring reservations:', error);
      alert(error.message || 'Failed to expire reservations');
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

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-900 mb-2">Failed to Load Balance Health</h2>

                {error === 'schema_cache' && (
                  <div className="space-y-4">
                    <p className="text-red-800">
                      The function exists in the database but PostgREST hasn't detected it yet (schema cache issue).
                    </p>
                    <div className="bg-white rounded border border-red-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Quick Fix:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Go to <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                        <li>Run this command: <code className="bg-gray-100 px-2 py-1 rounded">NOTIFY pgrst, 'reload schema';</code></li>
                        <li>Refresh this page</li>
                      </ol>
                      <p className="text-xs text-gray-500 mt-3">Or wait 5 minutes for automatic cache refresh</p>
                    </div>
                  </div>
                )}

                {error === 'function_missing' && (
                  <div className="space-y-4">
                    <p className="text-red-800">
                      The function does not exist in the database.
                    </p>
                    <div className="bg-white rounded border border-red-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Fix:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Go to <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                        <li>Copy and run the entire file: <code className="bg-gray-100 px-2 py-1 rounded text-xs">supabase/migrations/20251103120000_add_admin_balance_controls.sql</code></li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </div>
                )}

                {error === 'permission_denied' && (
                  <div className="space-y-4">
                    <p className="text-red-800">
                      You don't have admin permissions.
                    </p>
                    <div className="bg-white rounded border border-red-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Fix:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Go to <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                        <li>Run: <code className="bg-gray-100 px-2 py-1 rounded text-xs">UPDATE users SET role='admin', is_admin=true WHERE email='admin@mumbies.com';</code></li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </div>
                )}

                {error !== 'schema_cache' && error !== 'function_missing' && error !== 'permission_denied' && (
                  <div className="space-y-4">
                    <p className="text-red-800 font-mono text-sm">{error}</p>
                    {errorCode && (
                      <p className="text-xs text-red-600">Error Code: {errorCode}</p>
                    )}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={fetchHealthData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!health) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      </AdminLayout>
    );
  }

  const healthScore =
    health.health_status.mismatched_accounts === 0 &&
    health.health_status.expired_reservations_pending_cleanup === 0 &&
    health.health_status.failed_webhooks_last_24h === 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Balance Health Monitor</h1>
            <p className="text-gray-600 mt-1">System-wide Mumbies Cash balance monitoring</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleRunReconciliation}
              disabled={runningReconciliation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Run Reconciliation
            </button>
          </div>
        </div>

        {/* Overall Health Status */}
        <div className={`rounded-lg border-2 p-6 ${
          healthScore
            ? 'bg-green-50 border-green-300'
            : health.health_status.mismatched_accounts > 0
            ? 'bg-red-50 border-red-300'
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-center gap-4">
            {healthScore ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : health.health_status.mismatched_accounts > 0 ? (
              <AlertTriangle className="w-12 h-12 text-red-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {healthScore
                  ? 'System Healthy'
                  : health.health_status.mismatched_accounts > 0
                  ? 'Critical Issues Detected'
                  : 'Minor Issues Detected'}
              </h2>
              <p className="text-gray-700 mt-1">
                {healthScore
                  ? 'All balances are synced and no issues detected'
                  : health.health_status.mismatched_accounts > 0
                  ? `${health.health_status.mismatched_accounts} account(s) have balance mismatches`
                  : 'Some cleanup tasks are pending'}
              </p>
            </div>
            {health.last_reconciliation && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Reconciliation</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(health.last_reconciliation.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Totals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Partners"
            value={health.system_totals.total_partners}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Total Mumbies Cash"
            value={`$${health.system_totals.total_mumbies_cash.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <MetricCard
            title="Pending Reservations"
            value={`$${health.system_totals.total_pending_reservations.toFixed(2)}`}
            icon={Clock}
            color="yellow"
          />
          <MetricCard
            title="Available Balance"
            value={`$${(health.system_totals.total_mumbies_cash - health.system_totals.total_pending_reservations).toFixed(2)}`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthMetric
            title="Balance Mismatches"
            value={health.health_status.mismatched_accounts}
            healthy={health.health_status.mismatched_accounts === 0}
            description="Accounts where user and partner balances don't match"
          />
          <HealthMetric
            title="Expired Reservations"
            value={health.health_status.expired_reservations_pending_cleanup}
            healthy={health.health_status.expired_reservations_pending_cleanup === 0}
            description="Old reservations that need cleanup"
            action={
              health.health_status.expired_reservations_pending_cleanup > 0
                ? { label: 'Clean Up Now', onClick: handleExpireReservations }
                : undefined
            }
          />
          <HealthMetric
            title="Failed Webhooks (24h)"
            value={health.health_status.failed_webhooks_last_24h}
            healthy={health.health_status.failed_webhooks_last_24h === 0}
            description="Webhook failures in the last 24 hours"
          />
        </div>

        {/* Mismatched Accounts */}
        {health.mismatched_partners.length > 0 && (
          <div className="bg-white rounded-lg border border-red-200">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">
                  Accounts with Balance Mismatches ({health.mismatched_partners.length})
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Partner
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        User Balance
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Partner Balance
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Difference
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {health.mismatched_partners.map((partner) => (
                      <tr key={partner.partner_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link
                            to={`/partners/${partner.partner_id}`}
                            className="text-sm font-medium text-green-600 hover:text-green-700"
                          >
                            {partner.organization_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          ${partner.user_balance.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          ${partner.partner_balance.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 text-right text-sm font-semibold ${
                          partner.difference > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {partner.difference > 0 ? '+' : ''}${partner.difference.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <Link
                            to={`/partners/${partner.partner_id}`}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Fix →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Last Reconciliation Details */}
        {health.last_reconciliation && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Reconciliation Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(health.last_reconciliation.audit_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users Checked</p>
                <p className="text-sm font-medium text-gray-900">
                  {health.last_reconciliation.total_users}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mismatched Accounts</p>
                <p className="text-sm font-medium text-gray-900">
                  {health.last_reconciliation.mismatched_accounts}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
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

function HealthMetric({ title, value, healthy, description, action }: any) {
  return (
    <div className={`rounded-lg border p-6 ${
      healthy
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
        </div>
        {healthy ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600" />
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}
