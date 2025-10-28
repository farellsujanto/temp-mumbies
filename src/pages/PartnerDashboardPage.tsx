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
  CheckCircle
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
  total_attributed_customers: number;
  total_sales: number;
  total_commissions_earned: number;
  status: string;
  location_city: string | null;
  location_state: string | null;
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'profile'>('overview');
  const [copied, setCopied] = useState(false);

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
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-5 w-5 inline mr-2" />
            Profile Settings
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
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

          {/* Recent Activity Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity yet</p>
              <p className="text-sm">Share your referral link to start earning!</p>
            </div>
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
      )}
    </div>
  );
}
