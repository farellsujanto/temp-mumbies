import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, CheckCircle } from 'lucide-react';
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
          source: 'lead_registration_page'
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
            <h1 className="text-4xl font-bold mb-4">Welcome to Mumbies!</h1>
            <p className="text-xl text-gray-700 mb-6">
              Check your email to complete your registration and start shopping.
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
          </div>

          {curatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">
                Start Shopping {nonprofit.organization_name}'s Recommended Products
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {curatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button
                  onClick={() => navigate('/shop')}
                  size="lg"
                  className="px-12"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse All Products
                </Button>
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
              {nonprofit.organization_name} Invites You
            </h1>
            {nonprofit.location_city && nonprofit.location_state && (
              <p className="text-green-100 text-lg mb-2">
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
                <h2 className="text-2xl font-bold mb-4">
                  Save on All Your Natural Pet Essentials at Mumbies
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Register now and automatically donate back to {nonprofit.organization_name} with every purchase you make, for life!
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Register Free</h3>
                  <p className="text-sm text-gray-600">Quick and easy signup</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Shop Natural</h3>
                  <p className="text-sm text-gray-600">Premium pet products</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Give Back</h3>
                  <p className="text-sm text-gray-600">Auto-donate for life</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
                  {submitting ? 'Registering...' : 'Register & Start Shopping'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By registering, you agree to receive emails from Mumbies and {nonprofit.organization_name}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
