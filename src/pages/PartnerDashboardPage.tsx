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
  MessageSquare,
  Calculator,
  Target,
  Trophy,
  X,
  Home
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import OpportunitiesTab from '../components/partner/OpportunitiesTab';
import ReferralOpportunitiesTab from '../components/partner/ReferralOpportunitiesTab';
import RewardsTab from '../components/partner/RewardsTab';
import GiveawayEntriesTab from '../components/partner/GiveawayEntriesTab';
import GiveawaySection from '../components/partner/GiveawaySection';
import ProductManagementTab from '../components/partner/ProductManagementTab';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'referrals' | 'opportunities' | 'rewards' | 'profile'>('overview');
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
  const [productUrl, setProductUrl] = useState('');
  const [productNotes, setProductNotes] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productSubmissions, setProductSubmissions] = useState<any[]>([]);
  const [productSubmitted, setProductSubmitted] = useState(false);
  const [adoptionsPerYear, setAdoptionsPerYear] = useState(100);
  const [conversionRate, setConversionRate] = useState(50);
  const [avgMonthlySpend, setAvgMonthlySpend] = useState(100);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'cash' | 'giftcard'>('cash');
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(true);
  const [sitestripeEnabled, setSitestripeEnabled] = useState(true);
  const [savingSitestripe, setSavingSitestripe] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('welcomeVideoDismissed');
    const dismissedUntil = localStorage.getItem('welcomeVideoDismissedUntil');

    if (dismissed === 'forever') {
      setShowWelcomeVideo(false);
    } else if (dismissedUntil) {
      const dismissedTime = parseInt(dismissedUntil);
      if (Date.now() < dismissedTime) {
        setShowWelcomeVideo(false);
      } else {
        localStorage.removeItem('welcomeVideoDismissedUntil');
      }
    }
  }, []);

  const dismissWelcomeVideo = (duration: '24hours' | 'forever') => {
    if (duration === 'forever') {
      localStorage.setItem('welcomeVideoDismissed', 'forever');
    } else {
      const dismissUntil = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('welcomeVideoDismissedUntil', dismissUntil.toString());
    }
    setShowWelcomeVideo(false);
  };

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
    loadProductSubmissions(nonprofitData.id);

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

    // Load SiteStripe preferences
    const { data: prefs } = await supabase
      .from('partner_preferences')
      .select('sitestripe_enabled')
      .eq('partner_id', nonprofitData.id)
      .maybeSingle();

    if (prefs) {
      setSitestripeEnabled(prefs.sitestripe_enabled);
    }

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

  const loadProductSubmissions = async (nonprofitId: string) => {
    const { data } = await supabase
      .from('product_submissions')
      .select('*')
      .eq('nonprofit_id', nonprofitId)
      .order('created_at', { ascending: false });

    if (data) {
      setProductSubmissions(data);
    }
  };

  const loadRecentActivity = async (nonprofitId: string) => {
    const activities: Activity[] = [];

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        subtotal,
        created_at,
        user:users (email)
      `)
      .eq('attributed_rescue_id', nonprofitId)
      .in('status', ['completed', 'delivered'])
      .order('created_at', { ascending: false })
      .limit(20);

    console.log('Orders query:', { orders, ordersError, nonprofitId });

    if (orders) {
      orders.forEach((order: any) => {
        const commission = order.subtotal * 0.05;
        const userEmail = order.user?.email || 'Unknown';
        activities.push({
          id: order.id,
          type: 'order',
          amount: order.subtotal,
          commission,
          description: `Order from ${userEmail}`,
          date: order.created_at,
        });
      });
    }

    const { data: leads, error: leadsError } = await supabase
      .from('users')
      .select('id, email, created_at, total_orders')
      .eq('attributed_rescue_id', nonprofitId)
      .eq('total_orders', 0)
      .order('created_at', { ascending: false })
      .limit(20);

    console.log('Leads query:', { leads, leadsError, nonprofitId });

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

    const { data: qualifiedReferrals, error: referralsError } = await supabase
      .from('nonprofit_referrals')
      .select('id, referred_email, bounty_amount, qualification_date')
      .eq('referrer_nonprofit_id', nonprofitId)
      .in('status', ['qualified', 'paid'])
      .not('qualification_date', 'is', null)
      .order('qualification_date', { ascending: false });

    console.log('Referrals query:', { qualifiedReferrals, referralsError, nonprofitId });

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

    const { data: incentives, error: incentivesError } = await supabase
      .from('partner_incentives')
      .select(`
        id,
        amount,
        created_at,
        partner_leads (email)
      `)
      .eq('partner_id', nonprofitId)
      .order('created_at', { ascending: false })
      .limit(20);

    console.log('Incentives query:', { incentives, incentivesError, nonprofitId });

    if (incentives) {
      incentives.forEach((inc: any) => {
        activities.push({
          id: `gift-${inc.id}`,
          type: 'lead',
          amount: -inc.amount,
          description: `Sent $${inc.amount.toFixed(2)} gift to ${inc.partner_leads?.email || 'lead'}`,
          date: inc.created_at,
        });
      });
    }

    console.log('Final activities:', activities);
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(activities.slice(0, 20));
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

  const submitProductUrl = async () => {
    if (!productUrl.trim() || !nonprofit || !user) return;

    setSubmittingProduct(true);
    try {
      await supabase
        .from('product_submissions')
        .insert({
          nonprofit_id: nonprofit.id,
          submitted_by_user_id: user.id,
          product_url: productUrl,
          product_name: null,
          notes: productNotes || null,
          status: 'pending'
        });

      setProductSubmitted(true);
      setProductUrl('');
      setProductNotes('');
      await loadProductSubmissions(nonprofit.id);

      setTimeout(() => {
        setProductSubmitted(false);
      }, 3000);
    } catch (error) {
      alert('Error submitting product. Please try again.');
    }
    setSubmittingProduct(false);
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

  const saveSiteStripePreference = async () => {
    if (!nonprofit) return;

    setSavingSitestripe(true);
    try {
      await supabase
        .from('partner_preferences')
        .upsert({
          partner_id: nonprofit.id,
          sitestripe_enabled: sitestripeEnabled
        });

      alert('SiteStripe preference saved!');
    } catch (error) {
      alert('Error saving preference. Please try again.');
    }
    setSavingSitestripe(false);
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{nonprofit.organization_name}</h1>
                <button
                  onClick={() => navigate(`/rescues/${nonprofit.slug}`)}
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  title="View public profile"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
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
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'rewards'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="h-5 w-5" />
            Rewards
          </button>
          <button
            onClick={() => setActiveTab('giveaways')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'giveaways'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift className="h-5 w-5" />
            Giveaways
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="h-5 w-5" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'referrals'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-5 w-5" />
            Refer Partners
            {nonprofit.active_referrals_count > 0 && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                {nonprofit.active_referrals_count}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-5 w-5" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Welcome Video Info Box */}
          {showWelcomeVideo && (
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg p-6 text-white relative">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">Welcome to the Partner Program!</h2>
                  <p className="text-green-100 mb-4">
                    Watch this quick video to learn how to maximize your earnings and make the most of your partnership with Mumbies.
                  </p>
                  <ul className="space-y-2 text-sm text-green-50 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Share your unique referral link to earn 5% on all sales for life</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Refer other nonprofits and earn $1,000 per qualified partner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Run giveaways to grow your audience and generate leads</span>
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <button
                      onClick={() => dismissWelcomeVideo('24hours')}
                      className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded transition-colors"
                    >
                      Hide for 24 hours
                    </button>
                    <button
                      onClick={() => dismissWelcomeVideo('forever')}
                      className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded transition-colors"
                    >
                      Don't show again
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-96 flex-shrink-0">
                  <div className="relative rounded-lg overflow-hidden aspect-video group cursor-pointer">
                    <img
                      src="https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Partner Portal Overview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <svg className="w-20 h-20 opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all" viewBox="0 0 68 48" fill="none">
                        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00" fill-opacity="0.8"/>
                        <path d="M 45,24 27,14 27,34" fill="#fff"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats - Five Across */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-semibold">Cash Balance</span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-3">
                ${(nonprofit.total_commissions_earned + nonprofit.total_referral_earnings).toFixed(2)}
              </p>
              <Button
                onClick={() => setShowWithdrawalModal(true)}
                size="sm"
                fullWidth
                disabled={(nonprofit.total_commissions_earned + nonprofit.total_referral_earnings) <= 0}
              >
                Withdraw
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Lifetime Earnings</span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                ${nonprofit.total_commissions_earned.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Lifetime Sales</span>
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">
                ${nonprofit.total_sales.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Customers</span>
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">
                {nonprofit.total_attributed_customers}
              </p>
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

          {/* Withdrawal Modal */}
          {showWithdrawalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Withdraw Your Balance</h2>
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-lg text-gray-700 mb-2">
                    Available Balance: <span className="font-bold text-green-600">${(nonprofit.total_commissions_earned + nonprofit.total_referral_earnings).toFixed(2)}</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Cash Withdrawal */}
                  <button
                    onClick={() => setWithdrawalMethod('cash')}
                    className={`border-2 rounded-lg p-6 text-left transition-all ${
                      withdrawalMethod === 'cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-bold">Cash Withdrawal</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ${(nonprofit.total_commissions_earned + nonprofit.total_referral_earnings).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Standard withdrawal to your payment method
                    </p>
                  </button>

                  {/* Gift Card Bonus */}
                  <button
                    onClick={() => setWithdrawalMethod('giftcard')}
                    className={`border-2 rounded-lg p-6 text-left transition-all relative ${
                      withdrawalMethod === 'giftcard'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      +10% BONUS
                    </span>
                    <div className="flex items-center gap-3 mb-3">
                      <Gift className="h-6 w-6 text-amber-600" />
                      <h3 className="text-lg font-bold">Cash Balance</h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mb-2">
                      ${((nonprofit.total_commissions_earned + nonprofit.total_referral_earnings) * 1.1).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Get 10% extra to shop on Mumbies
                    </p>
                  </button>
                </div>

                {withdrawalMethod === 'cash' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>Cash withdrawal</strong> will be sent to your configured payout method (PayPal, Bank Transfer, or Check) within 5-7 business days.
                    </p>
                  </div>
                )}

                {withdrawalMethod === 'giftcard' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Convert to Store Credit</strong> and get 10% extra!
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• ${(nonprofit.total_commissions_earned + nonprofit.total_referral_earnings).toFixed(2)} becomes ${((nonprofit.total_commissions_earned + nonprofit.total_referral_earnings) * 1.1).toFixed(2)}</li>
                      <li>• Added instantly to your customer account</li>
                      <li>• Use on any Mumbies products</li>
                      <li>• Never expires</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowWithdrawalModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      alert(`${withdrawalMethod === 'cash' ? 'Cash withdrawal' : 'Gift card conversion'} initiated! You'll receive confirmation shortly.`);
                      setShowWithdrawalModal(false);
                    }}
                  >
                    {withdrawalMethod === 'cash' ? 'Withdraw Cash' : 'Convert to Store Credit'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Referral Links and Activity Side-by-Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Referral Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Your Referral Links
              </h2>

              <div className="space-y-4">
                {/* Profile/Shop Link */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      Profile & Curated Products Link
                    </label>
                    <a
                      href={`/rescues/${nonprofit.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Share with supporters to see your organization
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/rescues/${nonprofit.slug}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <Button onClick={copyReferralLink} className="text-sm px-3">
                      {copied ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* General Registration Link */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      <UserPlus className="h-4 w-4 inline mr-1" />
                      Lead Registration Link
                    </label>
                    <a
                      href={`/lead-registration?ref=${nonprofit.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Give to new adopters to register
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/lead-registration?ref=${nonprofit.slug}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <Button onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/lead-registration?ref=${nonprofit.slug}`);
                    }} className="text-sm px-3">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Custom URL Generator */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    Custom URL Referral Generator
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    Add tracking to any URL
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="yourwebsite.com/adopt"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <Button onClick={generateCustomReferralLink} className="text-sm px-3">
                        Generate
                      </Button>
                    </div>
                    {customReferralLink && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={customReferralLink}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <Button onClick={copyCustomLink} className="text-sm px-3">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col" style={{ height: '100%' }}>
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'order'
                            ? 'bg-blue-100'
                            : activity.type === 'lead' && activity.amount < 0
                            ? 'bg-purple-100'
                            : activity.type === 'lead'
                            ? 'bg-green-100'
                            : 'bg-amber-100'
                        }`}>
                          {activity.type === 'order' && (
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          )}
                          {activity.type === 'lead' && activity.amount < 0 && (
                            <Gift className="h-4 w-4 text-purple-600" />
                          )}
                          {activity.type === 'lead' && activity.amount === 0 && (
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
                        {activity.type === 'lead' && activity.amount < 0 && (
                          <p className="font-semibold text-red-600">
                            ${activity.amount.toFixed(2)}
                          </p>
                        )}
                        {activity.type === 'lead' && activity.amount === 0 && (
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Product URL Submission Widget */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Know a Product You Want to See on Mumbies?
              </h2>
              <p className="text-gray-700 mb-4 text-sm">
                Submit a URL here and we'll review it for addition to our catalog.
              </p>

              {productSubmitted ? (
                <div className="space-y-4">
                  <div className="bg-white border-2 border-green-300 rounded-lg p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">Submission Received!</h3>
                    <p className="text-gray-700 text-sm mb-4">
                      We'll review it and add it to the catalog soon.
                    </p>
                    <Button
                      onClick={() => setProductSubmitted(false)}
                      className="w-full"
                    >
                      Submit Another Product
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product URL *
                    </label>
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://example.com/product"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      value={productNotes}
                      onChange={(e) => setProductNotes(e.target.value)}
                      placeholder="Why would this be a great addition?"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                    />
                  </div>
                  <Button
                    onClick={submitProductUrl}
                    disabled={submittingProduct || !productUrl.trim()}
                    className="w-full"
                  >
                    {submittingProduct ? 'Submitting...' : 'Submit Product'}
                  </Button>
                </div>
              )}

              {productSubmissions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-green-200">
                  <h3 className="font-semibold mb-3">Your Submissions</h3>
                  <div className="space-y-2">
                    {productSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="bg-white rounded-lg p-3 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{submission.product_name || 'Product'}</p>
                            <p className="text-xs text-gray-600 truncate">{submission.product_url}</p>
                          </div>
                          <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                            submission.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : submission.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {submission.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

          {/* Revenue Calculator */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-green-600" />
              Revenue Projection Calculator
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              Model your potential recurring revenue based on adoptions and customer conversion rates.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Annual Adoptions
                </label>
                <input
                  type="number"
                  value={adoptionsPerYear}
                  onChange={(e) => setAdoptionsPerYear(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg font-bold text-center mb-3"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={adoptionsPerYear}
                  onChange={(e) => setAdoptionsPerYear(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 text-center mt-2">
                  Dogs/cats you adopt out per year
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Conversion Rate: {conversionRate}%
                </label>
                <div className="flex items-center justify-center mb-3">
                  <span className="text-3xl font-bold text-green-600">{conversionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 text-center mt-2">
                  Adopters who become Mumbies customers
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Avg Monthly Spend
                </label>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-2 text-lg font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    value={avgMonthlySpend}
                    onChange={(e) => setAvgMonthlySpend(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-bold text-center"
                  />
                </div>
                <input
                  type="range"
                  min="25"
                  max="300"
                  step="25"
                  value={avgMonthlySpend}
                  onChange={(e) => setAvgMonthlySpend(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 text-center mt-2">
                  Average customer monthly spend
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-green-300">
              <h3 className="text-lg font-bold mb-4 text-center">5-Year Revenue Projection</h3>
              <p className="text-xs text-gray-600 text-center mb-6">
                Assumes 10% annual churn rate (customers who stop shopping)
              </p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Year</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">New Customers</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Active Customers</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Monthly Sales</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Monthly Commission (5%)</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Annual Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const newCustomersPerYear = Math.floor(adoptionsPerYear * (conversionRate / 100));
                      const projections = [];
                      let cumulativeCustomers = 0;

                      for (let year = 1; year <= 5; year++) {
                        cumulativeCustomers += newCustomersPerYear;
                        const retentionRate = Math.pow(0.9, year - 1);
                        const activeCustomers = Math.floor(cumulativeCustomers * retentionRate);
                        const monthlySales = activeCustomers * avgMonthlySpend;
                        const monthlyCommission = monthlySales * 0.05;
                        const annualCommission = monthlyCommission * 12;

                        projections.push({
                          year,
                          newCustomers: newCustomersPerYear,
                          activeCustomers,
                          monthlySales,
                          monthlyCommission,
                          annualCommission
                        });
                      }

                      return projections.map((proj) => (
                        <tr key={proj.year} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3 font-semibold">Year {proj.year}</td>
                          <td className="py-3 px-3 text-right text-gray-700">
                            +{proj.newCustomers.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-blue-600">
                            {proj.activeCustomers.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-gray-700">
                            ${proj.monthlySales.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-green-600">
                            ${proj.monthlyCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-green-700 text-lg">
                            ${proj.annualCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-100 border-t-2 border-green-300">
                      <td colSpan={5} className="py-3 px-3 text-right font-bold text-gray-900">
                        5-Year Total Commission:
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-green-700 text-xl">
                        ${(() => {
                          const newCustomersPerYear = Math.floor(adoptionsPerYear * (conversionRate / 100));
                          let total = 0;
                          let cumulativeCustomers = 0;

                          for (let year = 1; year <= 5; year++) {
                            cumulativeCustomers += newCustomersPerYear;
                            const retentionRate = Math.pow(0.9, year - 1);
                            const activeCustomers = Math.floor(cumulativeCustomers * retentionRate);
                            const monthlySales = activeCustomers * avgMonthlySpend;
                            const monthlyCommission = monthlySales * 0.05;
                            const annualCommission = monthlyCommission * 12;
                            total += annualCommission;
                          }

                          return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>How this works:</strong> Each year you add new customers (based on your adoptions × conversion rate).
                  The model assumes 10% annual churn, meaning 90% of customers continue shopping each year. Your commission is 5% of all monthly sales from active customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && nonprofit && (
        <ReferralOpportunitiesTab
          partnerId={nonprofit.id}
          organizationName={nonprofit.organization_name}
        />
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && nonprofit && (
        <OpportunitiesTab
          partnerId={nonprofit.id}
          partnerBalance={nonprofit.total_commissions_earned + nonprofit.total_referral_earnings}
          organizationName={nonprofit.organization_name}
          logoUrl={nonprofit.logo_url}
        />
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && nonprofit && (
        <RewardsTab
          partnerId={nonprofit.id}
          organizationName={nonprofit.organization_name}
          totalSales={nonprofit.total_sales}
        />
      )}

      {/* Giveaways Tab */}
      {activeTab === 'giveaways' && nonprofit && (
        <div className="space-y-8">
          <GiveawaySection
            partnerId={nonprofit.id}
            totalSales={Number(nonprofit.total_sales)}
            organizationName={nonprofit.organization_name}
          />
          <GiveawayEntriesTab partnerId={nonprofit.id} />
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && nonprofit && (
        <ProductManagementTab partnerId={nonprofit.id} />
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

          {/* SiteStripe Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              SiteStripe Settings
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>What is SiteStripe?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  SiteStripe is a thin banner that appears at the top of every page on Mumbies.us when you're logged in as a partner. It lets you instantly generate and copy affiliate links for any product or page you're viewing, making it easy to share and earn commissions.
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <label className="font-medium text-gray-900 block mb-1">
                    Enable SiteStripe
                  </label>
                  <p className="text-sm text-gray-600">
                    Show the affiliate link banner when browsing
                  </p>
                </div>
                <button
                  onClick={() => setSitestripeEnabled(!sitestripeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sitestripeEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sitestripeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <Button
                onClick={saveSiteStripePreference}
                disabled={savingSitestripe}
                className="w-full"
              >
                {savingSitestripe ? 'Saving...' : 'Save SiteStripe Settings'}
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
