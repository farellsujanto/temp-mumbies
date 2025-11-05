import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  DollarSign,
  TrendingUp,
  Users,
  Gift,
  Download,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  nonprofit_id: string;
  transaction_type: string;
  balance_type: string;
  amount: number;
  description: string;
  created_at: string;
  partner_name?: string;
  partner_email?: string;
}

interface PartnerStats {
  partner_id: string;
  partner_name: string;
  mumbies_cash: number;
  gift_credit: number;
  total_commissions: number;
  total_gifts_sent: number;
  total_conversions: number;
  lead_count: number;
}

export default function AdminPayoutsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [partnerStats, setPartnerStats] = useState<PartnerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBalance, setFilterBalance] = useState('all');

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    setLoading(true);

    let startDate: Date | null = null;
    const now = new Date();

    if (timeframe === '7days') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeframe === '30days') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (timeframe === '90days') {
      startDate = new Date(now.setDate(now.getDate() - 90));
    }

    let query = supabase
      .from('partner_transactions')
      .select(`
        *,
        nonprofit:nonprofits!partner_transactions_nonprofit_id_fkey(
          organization_name,
          contact_email
        )
      `)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data: txData } = await query;

    if (txData) {
      const formatted = txData.map((tx: any) => ({
        ...tx,
        partner_name: tx.nonprofit?.organization_name || 'Unknown',
        partner_email: tx.nonprofit?.contact_email || ''
      }));
      setTransactions(formatted);
    }

    const { data: statsData } = await supabase
      .from('nonprofits')
      .select(`
        id,
        organization_name,
        mumbies_cash_balance,
        gift_credit_balance,
        total_sales
      `)
      .eq('status', 'active');

    if (statsData) {
      const stats = await Promise.all(
        statsData.map(async (partner: any) => {
          const { data: commissions } = await supabase
            .from('partner_transactions')
            .select('amount')
            .eq('nonprofit_id', partner.id)
            .eq('transaction_type', 'commission');

          const { data: gifts } = await supabase
            .from('partner_transactions')
            .select('amount')
            .eq('nonprofit_id', partner.id)
            .eq('transaction_type', 'gift_sent');

          const { data: conversions } = await supabase
            .from('partner_transactions')
            .select('amount')
            .eq('nonprofit_id', partner.id)
            .eq('transaction_type', 'conversion');

          const { count: leadCount } = await supabase
            .from('partner_leads')
            .select('*', { count: 'exact', head: true })
            .eq('partner_id', partner.id);

          return {
            partner_id: partner.id,
            partner_name: partner.organization_name,
            mumbies_cash: partner.mumbies_cash_balance || 0,
            gift_credit: partner.gift_credit_balance || 0,
            total_commissions: commissions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0,
            total_gifts_sent: Math.abs(gifts?.reduce((sum, g) => sum + parseFloat(g.amount), 0) || 0),
            total_conversions: conversions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0,
            lead_count: leadCount || 0
          };
        })
      );

      setPartnerStats(stats.sort((a, b) => b.total_commissions - a.total_commissions));
    }

    setLoading(false);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (searchTerm && !tx.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !tx.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && tx.transaction_type !== filterType) {
      return false;
    }
    if (filterBalance !== 'all' && tx.balance_type !== filterBalance) {
      return false;
    }
    return true;
  });

  const totalCommissions = partnerStats.reduce((sum, p) => sum + p.total_commissions, 0);
  const totalGiftsSent = partnerStats.reduce((sum, p) => sum + p.total_gifts_sent, 0);
  const totalMumbiesCash = partnerStats.reduce((sum, p) => sum + p.mumbies_cash, 0);
  const totalGiftCredit = partnerStats.reduce((sum, p) => sum + p.gift_credit, 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'gift_sent':
        return <Gift className="h-4 w-4 text-purple-600" />;
      case 'conversion':
        return <ArrowDownRight className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBalanceTypeColor = (type: string) => {
    return type === 'mumbies_cash' ? 'text-green-600' : 'text-purple-600';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Ledger</h1>
            <p className="text-gray-600 mt-1">Complete transaction history and partner performance tracking</p>
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Total Commissions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalCommissions.toFixed(2)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Gifts Sent</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalGiftsSent.toFixed(2)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Mumbies Cash</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalMumbiesCash.toFixed(2)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Gift Credit</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalGiftCredit.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                    <th className="pb-3 font-medium">Partner</th>
                    <th className="pb-3 font-medium text-right">Leads</th>
                    <th className="pb-3 font-medium text-right">Commissions</th>
                    <th className="pb-3 font-medium text-right">Gifts Sent</th>
                    <th className="pb-3 font-medium text-right">Mumbies Cash</th>
                    <th className="pb-3 font-medium text-right">Gift Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerStats.slice(0, 10).map((stat) => (
                    <tr key={stat.partner_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{stat.partner_name}</p>
                      </td>
                      <td className="py-3 text-right text-gray-900">{stat.lead_count}</td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-green-600">${stat.total_commissions.toFixed(2)}</span>
                      </td>
                      <td className="py-3 text-right text-gray-900">${stat.total_gifts_sent.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-green-600">${stat.mumbies_cash.toFixed(2)}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-purple-600">${stat.gift_credit.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Transaction Ledger</h2>
              <span className="text-sm text-gray-600">{filteredTransactions.length} transactions</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search partner or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="commission">Commissions</option>
                <option value="gift_sent">Gifts Sent</option>
                <option value="conversion">Conversions</option>
                <option value="redemption">Redemptions</option>
              </select>

              <select
                value={filterBalance}
                onChange={(e) => setFilterBalance(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Balances</option>
                <option value="mumbies_cash">Mumbies Cash</option>
                <option value="gift_credit">Gift Credit</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-6 font-medium">Date</th>
                  <th className="py-3 px-6 font-medium">Partner</th>
                  <th className="py-3 px-6 font-medium">Type</th>
                  <th className="py-3 px-6 font-medium">Balance</th>
                  <th className="py-3 px-6 font-medium">Description</th>
                  <th className="py-3 px-6 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-6 text-sm text-gray-600">
                        {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-medium text-gray-900">{tx.partner_name}</p>
                        <p className="text-xs text-gray-500">{tx.partner_email}</p>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.transaction_type)}
                          <span className="text-sm capitalize text-gray-700">{tx.transaction_type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`text-sm font-medium capitalize ${getBalanceTypeColor(tx.balance_type)}`}>
                          {tx.balance_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700 max-w-xs truncate">{tx.description}</td>
                      <td className="py-3 px-6 text-right">
                        <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
