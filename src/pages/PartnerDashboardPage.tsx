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
  CreditCard,
  UserPlus,
  ExternalLink,
  MessageSquare
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
  mission_statement: string | null;
  contact_name: string | null;
  contact_email: string | null;
  website: string | null;
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
  type: 'order' | 'referral' | 'lead';
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
  category?: string | null;
}

interface AvailableProduct extends Product {
  brand_id: string | null;
}

export default function PartnerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [leadCount, setLeadCount] = useState(0);
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
  const [customUrl, setCustomUrl] = useState('');
  const [customReferralLink, setCustomReferralLink] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savingProducts, setSavingProducts] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

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

    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('attributed_rescue_id', nonprofitData.id)
      .eq('total_orders', 0);

    setLeadCount(count || 0);

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
    setOrganizationName(nonprofitData.organization_name || '');
    setMissionStatement(nonprofitData.mission_statement || '');
    setContactName(nonprofitData.contact_name || '');
    setContactEmail(nonprofitData.contact_email || '');
    setWebsite(nonprofitData.website || '');

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
          category,
          brand:brands (
            name
          )
        )
      `)
      .eq('nonprofit_id', nonprofitId)
      .order('sort_order', { ascending: true });

    if (data) {
      const products = data
        .map((item: any) => item.products)
        .filter((p: any) => p !== null);
      setCuratedProducts(products);
    }
  };

  const loadAvailableProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        category,
        brand_id,
        brand:brands (
          name
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (data) {
      setAvailableProducts(data);
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
      .in('status', ['completed', 'delivered'])
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

    const { data: leads } = await supabase
      .from('users')
      .select('id, email, created_at, total_orders')
      .eq('attributed_rescue_id', nonprofitId)
      .eq('total_orders', 0)
      .order('created_at', { ascending: false })
      .limit(10);

    if (leads) {
      leads.forEach((lead) => {
        activities.push({
          id: lead.id,
          type: 'lead',
          amount: 0,
          description: `New lead registered: ${lead.email}`,
          date: lead.created_at,
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
          amount: 1000,
          description: `Referral partner earnings for ${referral.referred_email}`,
          date: referral.qualification_date!,
        });
      });
    }

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(activities.slice(0, 15));
  };

  const copyReferralLink = () => {
    if (!nonprofit) return;
    navigator.clipboard.writeText(`${window.location.origin}/rescues/${nonprofit.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralCode = () => {
    if (!nonprofit?.referral_code) return;
    navigator.clipboard.writeText(nonprofit.referral_code);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const sendReferralEmail = async () => {
    if (!referralEmail || !nonprofit) return;

    setSendingReferral(true);
    try {
      alert('Referral invitation sent!');
      setReferralEmail('');
    } catch (error) {
      alert('Error sending referral. Please try again.');
    }
    setSendingReferral(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/partner/login');
  };

  const savePayoutInformation = async () => {
    if (!nonprofit) return;

    setSavingPayout(true);
    try {
      await supabase
        .from('nonprofits')
        .update({
          payout_method: payoutMethod,
          payout_email: payoutEmail,
          bank_account_name: bankAccountName,
          bank_routing_number: bankRoutingNumber,
          bank_account_number: bankAccountNumber,
          mailing_address_line1: mailingLine1,
          mailing_address_line2: mailingLine2,
          mailing_address_city: mailingCity,
          mailing_address_state: mailingState,
          mailing_address_zip: mailingZip,
        })
        .eq('id', nonprofit.id);

      alert('Payout information saved successfully!');
    } catch (error) {
      alert('Error saving payout information. Please try again.');
    }
    setSavingPayout(false);
  };

  const generateCustomReferralLink = () => {
    if (!customUrl.trim()) return;
    const baseUrl = customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
    const separator = baseUrl.includes('?') ? '&' : '?';
    const link = `${baseUrl}${separator}ref=${nonprofit?.slug || ''}`;
    setCustomReferralLink(link);
  };

  const copyCustomLink = () => {
    if (!customReferralLink) return;
    navigator.clipboard.writeText(customReferralLink);
  };

  const submitFeedback = async () => {
    if (!feedbackMessage.trim() || !nonprofit) return;

    setSendingFeedback(true);
    try {
      alert('Thank you for your feedback! We\'ll review it shortly.');
      setFeedbackMessage('');
    } catch (error) {
      alert('Error sending feedback. Please try again.');
    }
    setSendingFeedback(false);
  };

  const addCuratedProduct = async (product: AvailableProduct) => {
    if (!nonprofit || curatedProducts.length >= 10) return;

    try {
      await supabase
        .from('nonprofit_curated_products')
        .insert({
          nonprofit_id: nonprofit.id,
          product_id: product.id,
          sort_order: curatedProducts.length
        });

      await loadCuratedProducts(nonprofit.id);
    } catch (error) {
      alert('Error adding product. Please try again.');
    }
  };

  const removeCuratedProduct = async (productId: string) => {
    if (!nonprofit) return;

    try {
      await supabase
        .from('nonprofit_curated_products')
        .delete()
        .eq('nonprofit_id', nonprofit.id)
        .eq('product_id', productId);

      await loadCuratedProducts(nonprofit.id);
    } catch (error) {
      alert('Error removing product. Please try again.');
    }
  };

  const saveProfileInformation = async () => {
    if (!nonprofit) return;

    setSavingProfile(true);
    try {
      await supabase
        .from('nonprofits')
        .update({
          organization_name: organizationName,
          mission_statement: missionStatement,
          contact_name: contactName,
          contact_email: contactEmail,
          website: website
        })
        .eq('id', nonprofit.id);

      alert('Profile information saved successfully!');
      await loadPartnerData();
    } catch (error) {
      alert('Error saving profile information. Please try again.');
    }
    setSavingProfile(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <div className="grid md:grid-cols-6 gap-6">
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
                <span className="text-gray-600 text-sm">Lead Registrations</span>
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">
                {leadCount}
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

          {/* Referral Links and Activity Side-by-Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Referral Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Your Referral Links
              </h2>

              <div className="space-y-6">
                {/* Profile/Shop Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile & Curated Products Link
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Share with supporters to see your organization and recommended products
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/rescues/${nonprofit.slug}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
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
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* General Registration Link */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <UserPlus className="h-4 w-4 inline mr-1" />
                    Lead Registration Link
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Give to new adopters so they register and get attributed to your organization
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/?ref=${nonprofit.slug}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <Button onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?ref=${nonprofit.slug}`);
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Custom URL Generator */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    Custom URL Referral Generator
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Add tracking to any URL (your website, social media, etc.)
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="yourwebsite.com/adopt"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <Button onClick={generateCustomReferralLink}>
                        Generate
                      </Button>
                    </div>
                    {customReferralLink && (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          readOnly
                          value={customReferralLink}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <Button onClick={copyCustomLink}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream */}
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
                            : activity.type === 'lead'
                            ? 'bg-green-100'
                            : 'bg-amber-100'
                        }`}>
                          {activity.type === 'order' && (
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          )}
                          {activity.type === 'lead' && (
                            <UserPlus className="h-4 w-4 text-green-600" />
                          )}
                          {activity.type === 'referral' && (
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
                        {activity.type === 'order' && (
                          <>
                            <p className="font-semibold text-green-600">
                              +${activity.commission?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${activity.amount.toFixed(2)} order
                            </p>
                          </>
                        )}
                        {activity.type === 'lead' && (
                          <p className="text-sm font-medium text-green-600">
                            New Lead
                          </p>
                        )}
                        {activity.type === 'referral' && (
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

          {/* Quick Feedback Widget */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Request Features or Report Bugs
            </h2>
            <p className="text-gray-700 mb-4 text-sm">
              We build fast! Tell us what you need and we'll make it happen.
            </p>
            <div className="space-y-3">
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Describe a feature you'd like or a bug you found..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              />
              <Button
                onClick={submitFeedback}
                disabled={sendingFeedback || !feedbackMessage.trim()}
                className="w-full"
              >
                {sendingFeedback ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Referral Program Banner */}
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

          {/* Referral Tools */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Referral Link */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Your Referral Link
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Share this link with other nonprofits
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  readOnly
                  value={nonprofit.referral_link || `${window.location.origin}/partner/apply?ref=${nonprofit.referral_code}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button onClick={copyReferralCode}>
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

            {/* Send Email Invite */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Email Invite
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Invite a nonprofit directly via email
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  placeholder="nonprofit@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <Button
                  onClick={sendReferralEmail}
                  disabled={sendingReferral || !referralEmail}
                >
                  {sendingReferral ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{referral.referred_email}</p>
                      <p className="text-sm text-gray-600">
                        Status: {referral.status === 'pending' && 'Pending signup'}
                        {referral.status === 'active' && 'Active - tracking sales'}
                        {referral.status === 'qualified' && 'Qualified for bounty!'}
                        {referral.status === 'paid' && 'Bounty paid'}
                      </p>
                      {referral.status === 'active' && (
                        <p className="text-sm text-gray-600">
                          Sales: ${referral.total_sales.toFixed(2)} / $500
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {referral.status === 'qualified' || referral.status === 'paid' ? (
                        <p className="text-lg font-bold text-amber-600">
                          ${referral.bounty_amount.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No referrals yet</p>
                <p className="text-sm">Start referring nonprofits to earn bounties!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Your Curated Products (10 slots) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Curated Products (Top 10)</h2>
            <p className="text-gray-600 mb-6">
              Select up to 10 products to feature on your profile page. These products will be highlighted when supporters visit your profile.
            </p>
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {[...Array(10)].map((_, index) => {
                const product = curatedProducts[index];
                return (
                  <div
                    key={index}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 aspect-square flex flex-col items-center justify-center relative"
                  >
                    {product ? (
                      <>
                        <button
                          onClick={() => removeCuratedProduct(product.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
                        >
                          ×
                        </button>
                        <img
                          src={product.image_url || 'https://via.placeholder.com/150'}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <p className="text-xs font-medium text-center line-clamp-2">{product.name}</p>
                        <p className="text-xs text-gray-600">${product.price}</p>
                      </>
                    ) : (
                      <>
                        <Package className="h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 text-center">Slot {index + 1}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browse All Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Browse Products</h2>
            <p className="text-gray-600 mb-4">
              Search and select products to add to your curated list.
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {availableProducts.length === 0 && (
              <div className="text-center py-4">
                <Button onClick={loadAvailableProducts}>
                  Load Available Products
                </Button>
              </div>
            )}

            {availableProducts.length > 0 && (
              <div className="grid md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
                {availableProducts
                  .filter(p =>
                    !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => {
                    const isAlreadyAdded = curatedProducts.some(cp => cp.id === product.id);
                    const canAdd = curatedProducts.length < 10 && !isAlreadyAdded;

                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-4 ${
                          isAlreadyAdded ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={product.image_url || 'https://via.placeholder.com/150'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <p className="font-medium text-sm line-clamp-2 mb-1">{product.name}</p>
                        {product.brand && (
                          <p className="text-xs text-gray-600 mb-1">{product.brand.name}</p>
                        )}
                        <p className="text-sm font-bold text-green-600 mb-3">${product.price}</p>
                        {isAlreadyAdded ? (
                          <button
                            disabled
                            className="w-full bg-green-100 text-green-700 py-2 rounded text-sm font-medium"
                          >
                            Added
                          </button>
                        ) : canAdd ? (
                          <button
                            onClick={() => addCuratedProduct(product)}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Add to Profile
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 py-2 rounded text-sm font-medium cursor-not-allowed"
                          >
                            Limit Reached
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile/Settings Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Your organization name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  value={missionStatement}
                  onChange={(e) => setMissionStatement(e.target.value)}
                  placeholder="Tell supporters about your mission..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Primary contact name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@organization.org"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.org"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <Button
                onClick={saveProfileInformation}
                disabled={savingProfile}
                className="w-full"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Information'}
              </Button>
            </div>
          </div>

          {/* Payout Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payout Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a method</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer (ACH)</option>
                  <option value="check">Check (Mailed)</option>
                </select>
              </div>

              {payoutMethod === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    value={payoutEmail}
                    onChange={(e) => setPayoutEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              {payoutMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Account holder name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankRoutingNumber}
                      onChange={(e) => setBankRoutingNumber(e.target.value)}
                      placeholder="9-digit routing number"
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
                </>
              )}

              {payoutMethod === 'check' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mailing Address Line 1
                    </label>
                    <input
                      type="text"
                      value={mailingLine1}
                      onChange={(e) => setMailingLine1(e.target.value)}
                      placeholder="Street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mailing Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={mailingLine2}
                      onChange={(e) => setMailingLine2(e.target.value)}
                      placeholder="Apt, suite, etc."
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={savePayoutInformation}
                disabled={savingPayout || !payoutMethod}
                className="w-full"
              >
                {savingPayout ? 'Saving...' : 'Save Payout Information'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
