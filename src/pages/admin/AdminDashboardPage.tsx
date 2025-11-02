import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, DollarSign, UserCheck, UserX, Wallet, TrendingUp, AlertCircle, Gift } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface DashboardStats {
  totalPartners: number;
  activePartners: number;
  pendingApplications: number;
  suspendedPartners: number;
  totalMumbiesCash: number;
  pendingPayouts: number;
  leadsLast30Days: number;
  activeGiveaways: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: totalPartners },
        { count: activePartners },
        { count: pendingApplications },
        { count: suspendedPartners },
        { data: nonprofits },
        { data: transactions },
        { count: recentLeads },
        { count: activeGiveaways }
      ] = await Promise.all([
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }),
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
        supabase.from('nonprofits').select('mumbies_cash_balance'),
        supabase
          .from('partner_transactions')
          .select('amount')
          .eq('transaction_type', 'commission')
          .or('payout_status.is.null,payout_status.eq.pending'),
        supabase
          .from('partner_leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('partner_giveaways').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const totalMumbiesCash = nonprofits?.reduce((sum, n) => sum + parseFloat(n.mumbies_cash_balance?.toString() || '0'), 0) || 0;
      const pendingPayouts = transactions?.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0) || 0;

      setStats({
        totalPartners: totalPartners || 0,
        activePartners: activePartners || 0,
        pendingApplications: pendingApplications || 0,
        suspendedPartners: suspendedPartners || 0,
        totalMumbiesCash,
        pendingPayouts,
        leadsLast30Days: recentLeads || 0,
        activeGiveaways: activeGiveaways || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
          <p className="text-gray-600 mt-1">Overview and key metrics</p>
        </div>

        {/* Pending Actions Alert */}
        {stats && stats.pendingApplications > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 text-sm">Action Required</h4>
              <p className="text-red-700 text-sm mt-1">
                You have {stats.pendingApplications} pending partner application{stats.pendingApplications > 1 ? 's' : ''} awaiting review
              </p>
            </div>
            <Link
              to="/admin/partners?status=pending"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Review Now
            </Link>
          </div>
        )}

        {/* Partner Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Partners"
            value={stats?.totalPartners || 0}
            icon={Users}
            iconColor="text-gray-600"
            bgColor="bg-gray-50"
            link="/admin/partners?status=all"
          />
          <MetricCard
            title="Active Partners"
            value={stats?.activePartners || 0}
            icon={UserCheck}
            iconColor="text-green-600"
            bgColor="bg-green-50"
            link="/admin/partners?status=active"
          />
          <MetricCard
            title="Pending Applications"
            value={stats?.pendingApplications || 0}
            icon={AlertCircle}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-50"
            link="/admin/partners?status=pending"
            highlight={stats && stats.pendingApplications > 0}
          />
          <MetricCard
            title="Suspended"
            value={stats?.suspendedPartners || 0}
            icon={UserX}
            iconColor="text-red-600"
            bgColor="bg-red-50"
            link="/admin/partners?status=suspended"
          />
        </div>

        {/* Financial Statistics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Total Mumbies Cash (All Partners)"
              value={`$${(stats?.totalMumbiesCash || 0).toFixed(2)}`}
              icon={Wallet}
              iconColor="text-purple-600"
              bgColor="bg-purple-50"
            />
            <MetricCard
              title="Pending Payouts"
              value={`$${(stats?.pendingPayouts || 0).toFixed(2)}`}
              icon={DollarSign}
              iconColor="text-green-600"
              bgColor="bg-green-50"
              action={
                stats && stats.pendingPayouts > 0
                  ? { label: 'Process Payouts', to: '/admin/payouts' }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Activity Statistics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity (30 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="New Leads Generated"
              value={stats?.leadsLast30Days || 0}
              icon={TrendingUp}
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
            />
            <MetricCard
              title="Active Giveaways"
              value={stats?.activeGiveaways || 0}
              icon={Gift}
              iconColor="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Partner Applications</h2>
            <RecentApplications />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Admin Activity</h2>
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  iconColor: string;
  bgColor: string;
  action?: { label: string; to: string };
  link?: string;
  highlight?: boolean;
}

function MetricCard({ title, value, icon: Icon, iconColor, bgColor, action, link, highlight }: MetricCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {action && (
        <Link
          to={action.to}
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center"
        >
          {action.label} →
        </Link>
      )}
    </>
  );

  const cardClass = `bg-white rounded-lg border ${
    highlight ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'
  } p-6 ${link ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`;

  if (link) {
    return (
      <Link to={link} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

function RecentApplications() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentApplications();
  }, []);

  const fetchRecentApplications = async () => {
    const { data } = await supabase
      .from('nonprofits')
      .select('id, organization_name, contact_email, created_at, status')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setApplications(data);
  };

  if (applications.length === 0) {
    return <p className="text-sm text-gray-500">No pending applications</p>;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <Link
          key={app.id}
          to={`/admin/partners?status=pending`}
          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <p className="text-sm font-medium text-gray-900">{app.organization_name}</p>
          <p className="text-xs text-gray-500 mt-1">{app.contact_email}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
        </Link>
      ))}
    </div>
  );
}

function RecentActivity() {
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from('admin_activity_log')
      .select('id, action_type, entity_type, created_at, notes')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setActivity(data);
  };

  if (activity.length === 0) {
    return <p className="text-sm text-gray-500">No recent activity</p>;
  }

  const formatAction = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-3">
      {activity.map((item) => (
        <div key={item.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{formatAction(item.action_type)}</p>
          <p className="text-xs text-gray-500 mt-1">{item.notes || `${item.entity_type} modified`}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
