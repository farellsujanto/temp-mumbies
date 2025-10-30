import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Globe, Heart, Gift, Star, ShoppingCart, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Nonprofit {
  id: string;
  organization_name: string;
  slug: string;
  mission_statement: string | null;
  location_city: string | null;
  location_state: string | null;
  website: string | null;
  logo_url: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  tags: string[];
  brand: { name: string } | null;
}

interface Bundle {
  id: string;
  bundle_name: string;
  bundle_description: string | null;
  discount_percentage: number;
  is_active: boolean;
}

export default function RescueProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'wishlist' | 'recommended' | 'bundle'>('recommended');
  const [hasExistingOrders, setHasExistingOrders] = useState(false);

  useEffect(() => {
    if (slug) {
      loadAllData();
    }
  }, [slug, user]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadNonprofit(),
      loadWishlist(),
      loadRecommended(),
      loadBundle(),
      checkExistingOrders()
    ]);
    setLoading(false);
  };

  const loadNonprofit = async () => {
    const { data } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('slug', slug)
      .in('status', ['active', 'approved'])
      .maybeSingle();

    if (data) setNonprofit(data);
  };

  const checkExistingOrders = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    setHasExistingOrders(!!data);
  };

  const loadWishlist = async () => {
    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!nonprofitData) return;

    const { data } = await supabase
      .from('partner_product_lists')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          tags,
          brand:brand_id(name)
        )
      `)
      .eq('partner_id', nonprofitData.id)
      .eq('list_type', 'wishlist')
      .order('sort_order');

    if (data) {
      setWishlistProducts(data.map((item: any) => item.products).filter(Boolean));
    }
  };

  const loadRecommended = async () => {
    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!nonprofitData) return;

    const { data } = await supabase
      .from('partner_product_lists')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          tags,
          brand:brand_id(name)
        )
      `)
      .eq('partner_id', nonprofitData.id)
      .eq('list_type', 'recommended')
      .order('sort_order');

    if (data) {
      setRecommendedProducts(data.map((item: any) => item.products).filter(Boolean));
    }
  };

  const loadBundle = async () => {
    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!nonprofitData) return;

    const { data: bundleData } = await supabase
      .from('partner_bundles')
      .select('*')
      .eq('partner_id', nonprofitData.id)
      .eq('is_active', true)
      .maybeSingle();

    if (bundleData) {
      setBundle(bundleData);

      const { data: productsData } = await supabase
        .from('partner_product_lists')
        .select(`
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            tags,
            brand:brand_id(name)
          )
        `)
        .eq('partner_id', nonprofitData.id)
        .eq('list_type', 'bundle')
        .order('sort_order');

      if (productsData) {
        setBundleProducts(productsData.map((item: any) => item.products).filter(Boolean));
      }
    }
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url || undefined,
      attributedRescueId: nonprofit?.id
    });
  };

  const buyAsGift = (product: Product) => {
    if (!nonprofit) return;
    navigate('/checkout', {
      state: {
        giftPurchase: true,
        giftRecipient: nonprofit.organization_name,
        giftRecipientId: nonprofit.id,
        products: [{ ...product, quantity: 1 }]
      }
    });
  };

  const buyBundle = () => {
    if (!bundleProducts.length || !nonprofit) return;

    const isFirstTime = !hasExistingOrders;
    const discount = isFirstTime ? (bundle?.discount_percentage || 20) : 0;

    bundleProducts.forEach(product => {
      const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
      addItem({
        id: product.id,
        name: product.name,
        price: discountedPrice,
        quantity: 1,
        image_url: product.image_url || undefined,
        attributedRescueId: nonprofit.id
      });
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!nonprofit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Rescue not found</h2>
        <Button onClick={() => navigate('/rescues')}>
          View All Rescues
        </Button>
      </div>
    );
  }

  const bundleTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountedTotal = bundleTotal * (1 - (bundle?.discount_percentage || 20) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {nonprofit.logo_url ? (
            <img
              src={nonprofit.logo_url}
              alt={nonprofit.organization_name}
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-6xl text-gray-400">
                {nonprofit.organization_name[0]}
              </span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{nonprofit.organization_name}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {(nonprofit.location_city || nonprofit.location_state) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {nonprofit.location_city && `${nonprofit.location_city}, `}
                    {nonprofit.location_state}
                  </span>
                </div>
              )}

              {nonprofit.website && (
                <a
                  href={nonprofit.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <Globe className="h-5 w-5" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>

            {nonprofit.mission_statement && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">{nonprofit.mission_statement}</p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Support This Organization</h3>
                  <p className="text-gray-700 mb-4">
                    Shop products below and 5% of your purchase will go directly to{' '}
                    {nonprofit.organization_name}. Plus, you'll be attributed to this rescue for life!
                  </p>
                  <Button onClick={() => navigate(`/shop?rescue=${nonprofit.slug}`)}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 mb-8">
        {recommendedProducts.length > 0 && (
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'recommended'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star className="h-4 w-4 inline mr-2" />
            Recommended Products
          </button>
        )}
        {wishlistProducts.length > 0 && (
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'wishlist'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Shelter Wishlist
          </button>
        )}
        {bundle && bundleProducts.length === 5 && (
          <button
            onClick={() => setActiveTab('bundle')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'bundle'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift className="h-4 w-4 inline mr-2" />
            New Pet Parent Bundle
            {!hasExistingOrders && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">
                20% OFF
              </span>
            )}
          </button>
        )}
      </div>

      {/* Recommended Products */}
      {activeTab === 'recommended' && recommendedProducts.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {nonprofit.organization_name}'s Recommendations
            </h2>
            <p className="text-gray-600">
              Products recommended by {nonprofit.organization_name} for pet parents
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">{product.brand.name}</p>
                  )}
                  <p className="text-lg font-bold text-green-600 mb-4">${product.price}</p>
                  <Button fullWidth onClick={() => addToCart(product)}>
                    <ShoppingCart className="h-4 w-4 inline mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wishlist */}
      {activeTab === 'wishlist' && wishlistProducts.length > 0 && (
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-600" />
              Shelter Wishlist
            </h2>
            <p className="text-gray-700">
              Help {nonprofit.organization_name} by purchasing these items as gifts! Your purchase will be sent directly to the shelter.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="border border-blue-200 bg-blue-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">{product.brand.name}</p>
                  )}
                  <p className="text-lg font-bold text-blue-600 mb-4">${product.price}</p>
                  <div className="space-y-2">
                    <Button fullWidth variant="outline" onClick={() => buyAsGift(product)}>
                      <Gift className="h-4 w-4 inline mr-2" />
                      Buy as Gift for Shelter
                    </Button>
                    <Button fullWidth onClick={() => addToCart(product)}>
                      <ShoppingCart className="h-4 w-4 inline mr-2" />
                      Add to My Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bundle */}
      {activeTab === 'bundle' && bundle && bundleProducts.length === 5 && (
        <section>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-8 mb-6">
            <div className="flex items-start gap-4">
              <Gift className="h-12 w-12 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{bundle.bundle_name}</h2>
                <p className="text-gray-700 mb-4">{bundle.bundle_description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <span className="text-3xl font-bold text-amber-600">
                      {!hasExistingOrders ? `$${bundleDiscountedTotal.toFixed(2)}` : `$${bundleTotal.toFixed(2)}`}
                    </span>
                    {!hasExistingOrders && (
                      <span className="ml-3 text-lg text-gray-500 line-through">${bundleTotal.toFixed(2)}</span>
                    )}
                  </div>
                  {!hasExistingOrders && (
                    <span className="px-4 py-2 bg-amber-500 text-white font-bold rounded-full">
                      20% OFF FOR NEW CUSTOMERS!
                    </span>
                  )}
                </div>
                <Button size="lg" onClick={buyBundle}>
                  <Package className="h-5 w-5 inline mr-2" />
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">Bundle Includes:</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {bundleProducts.map((product, index) => (
              <div key={product.id} className="border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h4>
                  {product.brand && (
                    <p className="text-xs text-gray-600 mb-1">{product.brand.name}</p>
                  )}
                  <p className="text-sm font-bold text-amber-600">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
