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

interface TemplateOffer {
  id: string;
  title: string;
  description: string;
  product_id?: string | null;
  image_url: string;
  badge: string | null;
  badge_color: 'red' | 'amber' | 'green' | 'blue';
  price_display: string;
  price_subtext: string;
  discount_type: 'free' | 'percentage' | 'fixed';
  discount_value: string;
  button_color: 'red' | 'amber' | 'green' | 'blue';
}

interface LandingPageTemplate {
  id: string;
  slug: string;
  header_gradient_from: string;
  header_gradient_to: string;
  show_partner_logo: boolean;
  main_headline: string;
  sub_headline: string;
  offer_section_title: string;
  offer_section_description: string;
  offers: TemplateOffer[];
  email_placeholder: string;
  submit_button_text: string;
  success_title: string;
  success_message: string;
}

export default function LeadRegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get('ref');
  const templateSlug = searchParams.get('template') || 'adoption-offer';

  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [template, setTemplate] = useState<LandingPageTemplate | null>(null);
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

    // Load nonprofit data
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

    // Load landing page template
    const { data: templateData } = await supabase
      .from('landing_page_templates')
      .select('*')
      .eq('slug', templateSlug)
      .eq('is_active', true)
      .maybeSingle();

    if (templateData) {
      setTemplate(templateData);
    }

    // Load curated products
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
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        setError('This email is already registered. Please try a different email address or sign in to your existing account.');
        setSubmitting(false);
        return;
      }

      // Check if lead already exists for this partner
      const { data: existingLead } = await supabase
        .from('partner_leads')
        .select('id, email, status')
        .eq('email', email.toLowerCase())
        .eq('partner_id', nonprofit.id)
        .maybeSingle();

      if (existingLead) {
        setError('This email has already claimed an offer from this organization. Please try a different email address.');
        setSubmitting(false);
        return;
      }

      // Store current session BEFORE creating new user
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Stored current session before signup:', currentSession?.user?.email);

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
        console.error('Sign up error:', signUpError);
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          setError('This email is already registered. Please try a different email address or sign in to your existing account.');
        } else {
          setError('Unable to register. Please try again or use a different email address.');
        }
        setSubmitting(false);
        return;
      }

      // CRITICAL: Restore original session immediately after signup
      // signUp() automatically logs in the new user, but we want to keep the partner logged in
      if (currentSession) {
        console.log('Restoring original session:', currentSession.user.email);
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        });
      }

      // Calculate 90-day expiration
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);

      const { error: leadError } = await supabase
        .from('partner_leads')
        .insert({
          partner_id: nonprofit.id,
          email: email.toLowerCase(),
          registered_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          status: 'active',
          lead_source: 'landing_page',
          landing_page_url: window.location.href,
          full_name: null,
          phone: null,
          gift_sent: false,
          notes: `Selected offer: ${selectedOffer || 'unknown'}`
        });

      if (leadError) {
        console.error('Error creating lead:', leadError);
        setError('Your account was created but we had trouble recording your offer selection. Please contact support.');
        setSubmitting(false);
        return;
      }

      console.log('Lead created successfully for email:', email.toLowerCase());
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
            <h1 className="text-4xl font-bold mb-4">{template?.success_title || 'Success! 🎉'}</h1>
            <p className="text-xl text-gray-700 mb-6">
              {template?.success_message || 'Your offer has been claimed! Check your email to complete your registration.'}
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
          <div
            className="px-8 py-12 text-white text-center"
            style={{
              background: template
                ? `linear-gradient(to right, ${template.header_gradient_from}, ${template.header_gradient_to})`
                : 'linear-gradient(to right, #16a34a, #15803d)'
            }}
          >
            {(template?.show_partner_logo !== false) && (
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
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {template?.main_headline || 'Shop for Your Pet Essentials at Mumbies'}
            </h1>
            <p className="text-green-100 text-xl mb-2">
              {template?.sub_headline || '& Automatically Donate for Life to'}
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  {template?.offer_section_title || 'Pick an Offer Below'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {template?.offer_section_description || 'Choose your deal and start shopping premium natural pet products'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {(template?.offers || []).map((offer) => {
                  const badgeColorMap = {
                    red: 'bg-red-500',
                    amber: 'bg-amber-500',
                    green: 'bg-green-500',
                    blue: 'bg-blue-500'
                  };

                  const buttonColorMap = {
                    red: { bg: 'bg-red-100', text: 'text-red-800', subtext: 'text-red-700' },
                    amber: { bg: 'bg-amber-100', text: 'text-amber-800', subtext: 'text-amber-700' },
                    green: { bg: 'bg-green-100', text: 'text-green-800', subtext: 'text-green-700' },
                    blue: { bg: 'bg-blue-100', text: 'text-blue-800', subtext: 'text-blue-700' }
                  };

                  const colors = buttonColorMap[offer.button_color];

                  return (
                    <button
                      key={offer.id}
                      type="button"
                      onClick={() => {
                        setSelectedOffer(offer.id);
                        setShowEmailField(true);
                      }}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedOffer === offer.id
                          ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                          : 'border-gray-300 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      {selectedOffer === offer.id && (
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                      {offer.badge && (
                        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${badgeColorMap[offer.badge_color]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                          {offer.badge}
                        </div>
                      )}
                      <h3 className="font-bold text-xl mb-2">{offer.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {offer.description}
                      </p>
                      <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3">
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`${colors.bg} rounded-lg px-3 py-2`}>
                        <p className={`${colors.text} font-bold`}>{offer.price_display}</p>
                        {offer.price_subtext && (
                          <p className={`text-xs ${colors.subtext}`}>{offer.price_subtext}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
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
                    placeholder={template?.email_placeholder || 'Enter your email address'}
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
                    {submitting ? 'Claiming Offer...' : (template?.submit_button_text || 'Claim My Offer')}
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
