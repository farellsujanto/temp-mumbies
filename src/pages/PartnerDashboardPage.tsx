import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Link as LinkIcon,
  Settings,
  Package,
  LogOut,
  Heart,
  Copy,
  CheckCircle,
  Gift,
  Send,
  CreditCard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

interface NonprofitData {
  id: string;
  organization_name: string;
  slug: string;
  logo_url: string | null;
  referral_code: string | null;
  referral_link: string | null;
  total_attributed_customers: number;
  total_sales: number;
  total_commissions_earned: number;
  total_referral_earnings: number;
  active_referrals_count: number;
  qualified_referrals_count: number;
  status: string;
  location_city: string | null;
  location_state: string | null;
  payout_method: string | null;
  payout_email: string | null;
  bank_account_name: string | null;
  bank_routing_number: string | null;
  bank_account_number: string | null;
  mailing_address_line1: string | null;
  mailing_address_line2: string | null;
  mailing_address_city: string | null;
  mailing_address_state: string | null;
  mailing_address_zip: string | null;
}

interface Referral {
  id: string;
  referred_email: string;
  referral_code: string;
  status: string;
  signup_date: string | null;
  qualification_date: string | null;
  total_sales: number;
  bounty_amount: number;
  created_at: string;
}

interface Activity {
  id: string;
  type: 'order' | 'referral';
  amount: number;
  commission?: number;
  description: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  brand: { name: string } | null;
}

export default function PartnerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'referrals' | 'profile'>('overview');
  const [copied, setCopied] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');
  const [sendingReferral, setSendingReferral] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<string>('');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [mailingLine1, setMailingLine1] = useState('');
  const [mailingLine2, setMailingLine2] = useState('');
  const [mailingCity, setMailingCity] = useState('');
  const [mailingState, setMailingState] = useState('');
  const [mailingZip, setMailingZip] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/partner/login');
      return;
    }
    loadPartnerData();
  }, [user]);

  const loadPartnerData = async () => {
    if (!user) return;

    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!nonprofitData) {
      navigate('/partner/login');
      return;
    }

    if (nonprofitData.status !== 'active' && nonprofitData.status !== 'approved') {
      navigate('/partner/login');
      return;
    }

    setNonprofit(nonprofitData);
    loadCuratedProducts(nonprofitData.id);
    loadReferrals(nonprofitData.id);
    loadRecentActivity(nonprofitData.id);

    setPayoutMethod(nonprofitData.payout_method || '');
    setPayoutEmail(nonprofitData.payout_email || '');
    setBankAccountName(nonprofitData.bank_account_name || '');
    setBankRoutingNumber(nonprofitData.bank_routing_number || '');
    setBankAccountNumber(nonprofitData.bank_account_number || '');
    setMailingLine1(nonprofitData.mailing_address_line1 || '');
    setMailingLine2(nonprofitData.mailing_address_line2 || '');
    setMailingCity(nonprofitData.mailing_address_city || '');
    setMailingState(nonprofitData.mailing_address_state || '');
    setMailingZip(nonprofitData.mailing_address_zip || '');

    setLoading(false);
  };

  const loadCuratedProducts = async (nonprofitId: string) => {
    const { data } = await supabase
      .from('nonprofit_curated_products')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          brand:brands(name)
        )
      `)
      .eq('nonprofit_id', nonprofitId)
      .order('sort_order')
      .limit(8);

    if (data) {
      const products = data.map((item: any) => item.products).filter(Boolean);
      setCuratedProducts(products as any);
    }
  };

  const loadReferrals = async (nonprofitId: string) => {
    const { data } = await supabase
      .from('nonprofit_referrals')
      .select('*')
      .eq('referrer_nonprofit_id', nonprofitId)
      .order('created_at', { ascending: false });

    if (data) {
      setReferrals(data);
    }
  };

  const loadRecentActivity = async (nonprofitId: string) => {
    const activities: Activity[] = [];

    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, subtotal, created_at')
      .eq('attributed_rescue_id', nonprofitId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    if (orders) {
      orders.forEach((order) => {
        const commission = order.subtotal * 0.05;
        activities.push({
          id: order.id,
          type: 'order',
          amount: order.subtotal,
          commission,
          description: `Order ${order.order_number}`,
          date: order.created_at,
        });
      });
    }

    const { data: qualifiedReferrals } = await supabase
      .from('nonprofit_referrals')
      .select('id, referred_email, bounty_amount, qualification_date')
      .eq('referrer_nonprofit_id', nonprofitId)
      .in('status', ['qualified', 'paid'])
      .not('qualification_date', 'is', null)
      .order('qualification_date', { ascending: false });

    if (qualifiedReferrals) {
      qualifiedReferrals.forEach((referral) => {
        activities.push({
          id: referral.id,
          type: 'referral',
          amount: referral.bounty_amount,
          description: `Referral bounty for ${referral.referred_email}`,
          date: referral.qualification_date!,
        });
      });
    }

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(activities.slice(0, 10));
  };

  const sendReferralInvite = async () => {
    if (!nonprofit || !referralEmail.trim()) return;

    setSendingReferral(true);
    try {
      const { error } = await supabase
        .from('nonprofit_referrals')
        .insert({
          referrer_nonprofit_id: nonprofit.id,
          referred_email: referralEmail.trim(),
          referral_code: '',
        });

      if (!error) {
        setReferralEmail('');
        loadReferrals(nonprofit.id);
        loadPartnerData();
        alert('Referral invite sent!');
      } else {
        alert('Error sending referral. Please try again.');
      }
    } catch (error) {
      alert('Error sending referral. Please try again.');
    }
    setSendingReferral(false);
  };

  const copyPartnerReferralLink = () => {
    if (!nonprofit?.referral_link) return;
    const link = `${window.location.origin}/partner/apply?ref=${nonprofit.referral_link}`;
    navigator.clipboard.writeText(link);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const savePayoutInfo = async () => {
    if (!nonprofit) return;

    setSavingPayout(true);
    try {
      const updates: any = {
        payout_method: payoutMethod || null,
        payout_info_updated_at: new Date().toISOString(),
      };

      if (payoutMethod === 'paypal') {
        updates.payout_email = payoutEmail;
        updates.bank_account_name = null;
        updates.bank_routing_number = null;
        updates.bank_account_number = null;
        updates.mailing_address_line1 = null;
        updates.mailing_address_line2 = null;
        updates.mailing_address_city = null;
        updates.mailing_address_state = null;
        updates.mailing_address_zip = null;
      } else if (payoutMethod === 'bank_transfer') {
        updates.payout_email = payoutEmail;
        updates.bank_account_name = bankAccountName;
        updates.bank_routing_number = bankRoutingNumber;
        updates.bank_account_number = bankAccountNumber;
        updates.mailing_address_line1 = null;
        updates.mailing_address_line2 = null;
        updates.mailing_address_city = null;
        updates.mailing_address_state = null;
        updates.mailing_address_zip = null;
      } else if (payoutMethod === 'check') {
        updates.payout_email = payoutEmail;
        updates.bank_account_name = null;
        updates.bank_routing_number = null;
        updates.bank_account_number = null;
        updates.mailing_address_line1 = mailingLine1;
        updates.mailing_address_line2 = mailingLine2;
        updates.mailing_address_city = mailingCity;
        updates.mailing_address_state = mailingState;
        updates.mailing_address_zip = mailingZip;
      }

      const { error } = await supabase
        .from('nonprofits')
        .update(updates)
        .eq('id', nonprofit.id);

      if (!error) {
        alert('Payout information saved successfully!');
        loadPartnerData();
      } else {
        alert('Error saving payout information. Please try again.');
      }
    } catch (error) {
      alert('Error saving payout information. Please try again.');
    }
    setSavingPayout(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const copyReferralLink = () => {
    if (!nonprofit?.slug) return;
    const link = `${window.location.origin}/rescues/${nonprofit.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!nonprofit) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {nonprofit.logo_url ? (
              <img
                src={nonprofit.logo_url}
                alt={nonprofit.organization_name}
                className="w-16 h-16 object-contain rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{nonprofit.organization_name}</h1>
              <p className="text-gray-600">Partner Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-5 w-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-5 w-5 inline mr-2" />
            Curated Products
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'referrals'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift className="h-5 w-5 inline mr-2" />
            Refer Partners
            {nonprofit.active_referrals_count > 0 && (
              <span className="ml-2 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                {nonprofit.active_referrals_count}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-5 w-5 inline mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Earnings</span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                ${nonprofit.total_commissions_earned.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Sales</span>
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">
                ${nonprofit.total_sales.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Attributed Customers</span>
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">
                {nonprofit.total_attributed_customers}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Commission Rate</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">5%</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-900 text-sm font-medium">Referral Earnings</span>
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-amber-700">
                ${(nonprofit.total_referral_earnings || 0).toFixed(2)}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {nonprofit.qualified_referrals_count || 0} qualified
              </p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Your Referral Link
            </h2>
            <p className="text-gray-600 mb-4">
              Share this link with your supporters. When they shop through it, they'll be attributed to your
              organization for life, and you'll earn 5% on all their purchases.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/rescues/${nonprofit.slug}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button onClick={copyReferralLink}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'order'
                          ? 'bg-blue-100'
                          : 'bg-amber-100'
                      }`}>
                        {activity.type === 'order' ? (
                          <ShoppingBag className={`h-4 w-4 ${
                            activity.type === 'order'
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }`} />
                        ) : (
                          <Gift className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.type === 'order' ? (
                        <>
                          <p className="font-semibold text-green-600">
                            +${activity.commission?.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${activity.amount.toFixed(2)} order
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-amber-600">
                          +${activity.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity yet</p>
                <p className="text-sm">Share your referral link to start earning!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Referral Program Info */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <Gift className="h-6 w-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Earn $1,000 Per Referral</h2>
                <p className="text-gray-700 mb-4">
                  Refer other animal rescues and nonprofits to Mumbies. When they sign up and make $500 in sales within their first 6 months, you earn a $1,000 bounty!
                </p>
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-600 min-w-[20px]">1.</span>
                      <span>Share your unique referral link or send an email invite</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-600 min-w-[20px]">2.</span>
                      <span>They apply and get approved as a partner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-600 min-w-[20px]">3.</span>
                      <span>When they reach $500 in sales within 6 months, you get $1,000!</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Share Link */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Your Referral Link
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Share this link with other rescues and nonprofits
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/partner/apply?ref=${nonprofit.referral_link || ''}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <Button onClick={copyPartnerReferralLink}>
                  {referralCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Send Invite */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Invite
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Send a direct referral invite to an organization
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="partner@example.org"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <Button
                  onClick={sendReferralInvite}
                  disabled={sendingReferral || !referralEmail.trim()}
                >
                  {sendingReferral ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Total Referrals</div>
              <div className="text-3xl font-bold">{referrals.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Active Referrals</div>
              <div className="text-3xl font-bold text-blue-600">{nonprofit.active_referrals_count || 0}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Qualified & Paid</div>
              <div className="text-3xl font-bold text-green-600">{nonprofit.qualified_referrals_count || 0}</div>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Your Referrals</h3>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{referral.referred_email}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Code: {referral.referral_code} • Invited {new Date(referral.created_at).toLocaleDateString()}
                        </div>
                        {referral.signup_date && (
                          <div className="text-sm text-gray-600">
                            Signed up: {new Date(referral.signup_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="inline-block">
                          {referral.status === 'pending' && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              Pending
                            </span>
                          )}
                          {referral.status === 'signed_up' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              Signed Up
                            </span>
                          )}
                          {referral.status === 'qualified' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Qualified
                            </span>
                          )}
                          {referral.status === 'paid' && (
                            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                              Paid
                            </span>
                          )}
                        </div>
                        {referral.status !== 'pending' && (
                          <div className="text-sm text-gray-600 mt-1">
                            ${referral.total_sales.toFixed(2)} / $500
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No referrals yet</p>
                <p className="text-sm">Start referring other nonprofits to earn bounties!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Curated Products</h2>
            <p className="text-gray-600 mb-4">
              These are the products featured on your rescue profile page. Contact support to add or update products.
            </p>
          </div>

          {curatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {curatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    brand_name: product.brand?.name,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600">No curated products yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Contact support to add recommended products to your profile
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={nonprofit.organization_name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={nonprofit.location_city || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={nonprofit.location_state || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                  <strong>Need to update your profile?</strong> Contact support at{' '}
                  <a href="mailto:partners@mumbies.com" className="underline">
                    partners@mumbies.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Payout Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold">Payout Information</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Set up how you'd like to receive your commission and referral earnings.
            </p>

            <div className="space-y-6">
              {/* Payout Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payout Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payout_method"
                      value="paypal"
                      checked={payoutMethod === 'paypal'}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-600">Fast and easy payments to your PayPal account</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payout_method"
                      value="bank_transfer"
                      checked={payoutMethod === 'bank_transfer'}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Bank Transfer (ACH)</div>
                      <div className="text-sm text-gray-600">Direct deposit to your bank account</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payout_method"
                      value="check"
                      checked={payoutMethod === 'check'}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Check (Mail)</div>
                      <div className="text-sm text-gray-600">Physical check mailed to your address</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* PayPal Fields */}
              {payoutMethod === 'paypal' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email Address
                    </label>
                    <input
                      type="email"
                      value={payoutEmail}
                      onChange={(e) => setPayoutEmail(e.target.value)}
                      placeholder="your@paypal.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Fields */}
              {payoutMethod === 'bank_transfer' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={payoutEmail}
                      onChange={(e) => setPayoutEmail(e.target.value)}
                      placeholder="finance@organization.org"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Organization Legal Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        value={bankRoutingNumber}
                        onChange={(e) => setBankRoutingNumber(e.target.value)}
                        placeholder="123456789"
                        maxLength={9}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="Account number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Check Fields */}
              {payoutMethod === 'check' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={payoutEmail}
                      onChange={(e) => setPayoutEmail(e.target.value)}
                      placeholder="finance@organization.org"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mailing Address
                    </label>
                    <input
                      type="text"
                      value={mailingLine1}
                      onChange={(e) => setMailingLine1(e.target.value)}
                      placeholder="Street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    />
                    <input
                      type="text"
                      value={mailingLine2}
                      onChange={(e) => setMailingLine2(e.target.value)}
                      placeholder="Apt, Suite, etc. (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={mailingCity}
                        onChange={(e) => setMailingCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={mailingState}
                        onChange={(e) => setMailingState(e.target.value)}
                        placeholder="State"
                        maxLength={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={mailingZip}
                        onChange={(e) => setMailingZip(e.target.value)}
                        placeholder="ZIP"
                        maxLength={10}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {payoutMethod && (
                <div className="pt-4">
                  <Button
                    onClick={savePayoutInfo}
                    disabled={savingPayout}
                    className="w-full"
                  >
                    {savingPayout ? 'Saving...' : 'Save Payout Information'}
                  </Button>
                  {nonprofit.payout_method && (
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Current method: <strong>{nonprofit.payout_method.replace('_', ' ').toUpperCase()}</strong>
                    </p>
                  )}
                </div>
              )}

              {!payoutMethod && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    <strong>Important:</strong> You must set up payout information before you can receive earnings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
