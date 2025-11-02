import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, DollarSign, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface DashboardStats {
  activePartners: number;
  pendingApplications: number;
  pendingPayouts: number;
  activeGiveaways: number;
  totalGMV30Days: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: activePartners },
        { count: pendingApplications },
        { data: transactions },
        { count: activeGiveaways },
        { data: recentOrders }
      ] = await Promise.all([
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('nonprofits').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('partner_transactions')
          .select('amount')
          .eq('transaction_type', 'commission')
          .is('payout_status', null)
          .or('payout_status.eq.pending'),
        supabase.from('partner_giveaways').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const pendingPayouts = transactions?.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0) || 0;
      const totalGMV30Days = recentOrders?.reduce((sum, o) => sum + parseFloat(o.total_amount.toString()), 0) || 0;

      setStats({
        activePartners: activePartners || 0,
        pendingApplications: pendingApplications || 0,
        pendingPayouts,
        activeGiveaways: activeGiveaways || 0,
        totalGMV30Days,
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Partners"
            value={stats?.activePartners || 0}
            icon={Users}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
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
          <MetricCard
            title="Active Giveaways"
            value={stats?.activeGiveaways || 0}
            icon={Gift}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
          />
          <MetricCard
            title="30-Day GMV"
            value={`$${(stats?.totalGMV30Days || 0).toFixed(2)}`}
            icon={TrendingUp}
            iconColor="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Partner Applications</h2>
            <RecentApplications />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction to="/admin/partners?status=pending" label="Review Applications" icon={Users} />
            <QuickAction to="/admin/payouts" label="Process Payouts" icon={DollarSign} />
            <QuickAction to="/admin/content/hero" label="Manage Content" icon="🎨" />
            <QuickAction to="/admin/settings" label="System Settings" icon="⚙️" />
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
}

function MetricCard({ title, value, icon: Icon, iconColor, bgColor, action }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
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
    </div>
  );
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
          to={`/admin/partners/${app.id}`}
          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
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

  return (
    <div className="space-y-3">
      {activity.map((item) => (
        <div key={item.id} className="p-3 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-900">
            {item.action_type.replace(/_/g, ' ')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{item.notes || `${item.entity_type} modified`}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

interface QuickActionProps {
  to: string;
  label: string;
  icon: any;
}

function QuickAction({ to, label, icon }: QuickActionProps) {
  const Icon = typeof icon === 'string' ? null : icon;

  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
    >
      {Icon ? (
        <Icon className="h-6 w-6 text-gray-600 mb-2" />
      ) : (
        <span className="text-2xl mb-2">{icon}</span>
      )}
      <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
    </Link>
  );
}
