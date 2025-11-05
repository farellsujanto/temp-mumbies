import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, Gift, TrendingUp, LogOut } from 'lucide-react';
import { useAuth, supabase } from '@mumbies/shared';

interface DashboardStats {
  balance: number;
  totalLeads: number;
  activeGiveaways: number;
  totalEarnings: number;
}

interface RecentActivity {
  id: string;
  transaction_type: string;
  description: string;
  amount: number;
  created_at: string;
}

export default function PartnerDashboardPage() {
  const { userProfile, partnerProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    totalLeads: 0,
    activeGiveaways: 0,
    totalEarnings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.nonprofit_id) return;

    const fetchDashboardData = async () => {
      try {
        const [leadsResult, giveawaysResult, transactionsResult] = await Promise.all([
          supabase
            .from('partner_leads')
            .select('id', { count: 'exact', head: true })
            .eq('partner_id', userProfile.nonprofit_id),

          supabase
            .from('partner_giveaways')
            .select('id', { count: 'exact', head: true })
            .eq('partner_id', userProfile.nonprofit_id)
            .eq('status', 'active'),

          supabase
            .from('partner_transactions')
            .select('id, transaction_type, amount, description, created_at')
            .eq('partner_id', userProfile.nonprofit_id)
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        const totalEarnings = await supabase
          .from('partner_transactions')
          .select('amount')
          .eq('partner_id', userProfile.nonprofit_id)
          .eq('transaction_type', 'credit');

        const earningsSum = totalEarnings.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        setStats({
          balance: partnerProfile?.mumbies_cash_balance || 0,
          totalLeads: leadsResult.count || 0,
          activeGiveaways: giveawaysResult.count || 0,
          totalEarnings: earningsSum,
        });

        setRecentActivity(transactionsResult.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userProfile?.nonprofit_id, partnerProfile?.mumbies_cash_balance]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {partnerProfile?.organization_name || 'Partner Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{userProfile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-4 text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Leads
            </button>
            <button
              onClick={() => navigate('/giveaways')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Giveaways
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Balance</h3>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.balance.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Available to spend</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Giveaways</h3>
              <Gift className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeGiveaways}</p>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.totalEarnings.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No recent activity
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description || activity.transaction_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      activity.transaction_type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {activity.transaction_type === 'credit' ? '+' : '-'}$
                    {Math.abs(activity.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
