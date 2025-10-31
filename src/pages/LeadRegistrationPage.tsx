import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, CheckCircle, Gift, Package, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

interface Nonprofit {
  id: string;
  organization_name: string;
  slug: string;
  logo_url: string | null;
  mission_statement: string | null;
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

export default function LeadRegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get('ref');

  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [showEmailField, setShowEmailField] = useState(false);

  useEffect(() => {
    if (!ref) {
      navigate('/');
      return;
    }
    loadNonprofitData();
  }, [ref]);

  const loadNonprofitData = async () => {
    if (!ref) return;

    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id, organization_name, slug, logo_url, mission_statement, location_city, location_state')
      .eq('slug', ref)
      .eq('status', 'active')
      .maybeSingle();

    if (!nonprofitData) {
      navigate('/');
      return;
    }

    setNonprofit(nonprofitData);

    const { data: productsData } = await supabase
      .from('nonprofit_curated_products')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          brand:brands (
            name
          )
        )
      `)
      .eq('nonprofit_id', nonprofitData.id)
      .order('sort_order', { ascending: true })
      .limit(10);

    if (productsData) {
      const products = productsData
        .map((item: any) => item.products)
        .filter((p: any) => p !== null);
      setCuratedProducts(products);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nonprofit) return;

    setSubmitting(true);
    setError('');

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        setError('This email is already registered. Please sign in instead.');
        setSubmitting(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
        options: {
          data: {
            attributed_rescue_id: nonprofit.id,
            referred_by_rescue_slug: nonprofit.slug
          },
          emailRedirectTo: `${window.location.origin}/account`
        }
      });

      if (signUpError) {
        setError('Unable to register. Please try again.');
        setSubmitting(false);
        return;
      }

      await supabase
        .from('referral_leads')
        .insert({
          nonprofit_id: nonprofit.id,
          email: email.toLowerCase(),
          source: 'lead_registration_page',
          notes: `Selected offer: ${selectedOffer}`
        });

      setRegistered(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSubmitting(false);
    }
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

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Success! 🎉</h1>
            <p className="text-xl text-gray-700 mb-2">
              Your offer has been claimed!
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Check your email to complete your registration.
            </p>
            <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                {nonprofit.logo_url ? (
                  <img
                    src={nonprofit.logo_url}
                    alt={nonprofit.organization_name}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <Heart className="h-12 w-12 text-green-600" />
                )}
                <div className="text-left">
                  <p className="font-bold text-lg">{nonprofit.organization_name}</p>
                  {nonprofit.location_city && nonprofit.location_state && (
                    <p className="text-sm text-gray-600">
                      {nonprofit.location_city}, {nonprofit.location_state}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-700">
                Every purchase you make will automatically donate back to support {nonprofit.organization_name} for life!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => navigate('/shop')}
                size="lg"
                className="px-8"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping Now
              </Button>
              <Button
                onClick={() => window.location.href = `mailto:?subject=Check out Mumbies&body=I just found this awesome pet supply store that donates to ${nonprofit.organization_name}! Check it out: ${window.location.origin}/lead-registration?ref=${nonprofit.slug}`}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <Heart className="h-5 w-5 mr-2" />
                Share with Friends
              </Button>
            </div>
          </div>

          {curatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">
                {nonprofit.organization_name}'s Recommended Products
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {curatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-white text-center">
            <div className="flex items-center justify-center mb-6">
              {nonprofit.logo_url ? (
                <img
                  src={nonprofit.logo_url}
                  alt={nonprofit.organization_name}
                  className="h-24 w-24 object-contain bg-white rounded-lg p-2"
                />
              ) : (
                <div className="bg-white rounded-lg p-4">
                  <Heart className="h-16 w-16 text-green-600" />
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Shop for Your Pet Essentials at Mumbies
            </h1>
            <p className="text-green-100 text-xl mb-2">
              & Automatically Donate for Life to
            </p>
            <p className="text-2xl font-bold">
              {nonprofit.organization_name}
            </p>
            {nonprofit.location_city && nonprofit.location_state && (
              <p className="text-green-100 text-lg mt-2">
                {nonprofit.location_city}, {nonprofit.location_state}
              </p>
            )}
          </div>

          <div className="px-8 py-10">
            <div className="max-w-2xl mx-auto">
              {nonprofit.mission_statement && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 text-center italic">
                    "{nonprofit.mission_statement}"
                  </p>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  🎁 Claim Your Free Offer!
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Choose your deal below and start shopping premium natural pet products
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer('free-chew');
                    setShowEmailField(true);
                  }}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    selectedOffer === 'free-chew'
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-300 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  {selectedOffer === 'free-chew' && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  <Gift className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">FREE Original Chew</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Just pay shipping
                  </p>
                  <div className="bg-amber-100 rounded-lg px-3 py-2">
                    <p className="text-amber-800 font-bold">$0.00</p>
                    <p className="text-xs text-amber-700">+ shipping</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer('starter-pack');
                    setShowEmailField(true);
                  }}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    selectedOffer === 'starter-pack'
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-300 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  {selectedOffer === 'starter-pack' && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                  <Package className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">50% OFF Starter Pack</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Try our best sellers
                  </p>
                  <div className="bg-green-100 rounded-lg px-3 py-2">
                    <p className="text-green-800 font-bold">50% OFF</p>
                    <p className="text-xs text-green-700">Limited time</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer('bundle-discount');
                    setShowEmailField(true);
                  }}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    selectedOffer === 'bundle-discount'
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-300 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  {selectedOffer === 'bundle-discount' && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  <Sparkles className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">20% OFF Any Bundle</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Stock up and save
                  </p>
                  <div className="bg-blue-100 rounded-lg px-3 py-2">
                    <p className="text-blue-800 font-bold">20% OFF</p>
                    <p className="text-xs text-blue-700">Best value</p>
                  </div>
                </button>
              </div>

              {showEmailField && selectedOffer && (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fadeIn">
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                  <Button
                    type="submit"
                    disabled={submitting || !email}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? 'Claiming Offer...' : 'Claim My Offer'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By claiming this offer, you agree to receive emails from Mumbies and {nonprofit.organization_name}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
