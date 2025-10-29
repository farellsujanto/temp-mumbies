import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Sparkles, RefreshCw, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ProductCard from '../components/ProductCard';

interface ProductVariant {
  id: string;
  variant_name: string;
  variant_type: string;
  price: number;
  sku: string | null;
  image_url: string | null;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  base_price: number | null;
  has_variants: boolean;
  is_subscription_available: boolean;
  subscription_discount: number;
  image_url: string | null;
  additional_images: string[];
  tags: string[];
  category: string | null;
  inventory_status: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    mission: string | null;
  } | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  tags: string[];
  brand: { name: string } | null;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [sameBrandProducts, setSameBrandProducts] = useState<RelatedProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<RelatedProduct[]>([]);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'bimonthly'>('monthly');
  const [sameBrandPage, setSameBrandPage] = useState(0);
  const [sameBrandHasMore, setSameBrandHasMore] = useState(true);
  const [sameBrandLoading, setSameBrandLoading] = useState(false);
  const sameBrandObserverRef = useRef<IntersectionObserver | null>(null);
  const sameBrandSentinelRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      setSameBrandPage(0);
      setSameBrandHasMore(true);
      setSameBrandProducts([]);
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (!sameBrandSentinelRef.current) return;

    sameBrandObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && sameBrandHasMore && !sameBrandLoading) {
          loadMoreSameBrand();
        }
      },
      { threshold: 0.1 }
    );

    sameBrandObserverRef.current.observe(sameBrandSentinelRef.current);

    return () => {
      if (sameBrandObserverRef.current) {
        sameBrandObserverRef.current.disconnect();
      }
    };
  }, [loadMoreSameBrand, sameBrandHasMore, sameBrandLoading]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug, description, mission)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading product:', error);
    } else {
      setProduct(data);

      if (data?.has_variants) {
        loadVariants();
      }

      if (data) {
        loadSameBrandProducts(data.brand?.id, data.id);
        loadRecommendedProducts(data.category, data.tags, data.id);
      }
    }
    setLoading(false);
  };

  const loadVariants = async () => {
    const { data } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
      .eq('is_active', true)
      .order('sort_order');

    if (data && data.length > 0) {
      setVariants(data);
      setSelectedVariant(data[0]);
    }
  };

  const loadSameBrandProducts = async (brandId: string | undefined, currentProductId: string, page = 0, append = false) => {
    if (!brandId) return;
    if (sameBrandLoading) return;

    setSameBrandLoading(true);
    const pageSize = 8;

    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        tags,
        brand:brands(name)
      `)
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .neq('id', currentProductId)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (data) {
      if (append) {
        setSameBrandProducts(prev => [...prev, ...(data as any)]);
      } else {
        setSameBrandProducts(data as any);
      }
      setSameBrandHasMore(data.length === pageSize);
    }
    setSameBrandLoading(false);
  };

  const loadMoreSameBrand = useCallback(() => {
    if (!product?.brand?.id || !sameBrandHasMore || sameBrandLoading) return;
    const nextPage = sameBrandPage + 1;
    setSameBrandPage(nextPage);
    loadSameBrandProducts(product.brand.id, product.id, nextPage, true);
  }, [product, sameBrandPage, sameBrandHasMore, sameBrandLoading]);

  const loadRecommendedProducts = async (category: string | null, tags: string[], currentProductId: string) => {
    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        tags,
        category,
        brand:brands(name)
      `)
      .eq('is_active', true)
      .neq('id', currentProductId)
      .limit(20);

    if (data) {
      const scored = data.map((p: any) => {
        let score = 0;
        if (category && p.category === category) score += 3;
        const commonTags = tags.filter(tag => p.tags?.includes(tag)).length;
        score += commonTags * 2;
        return { ...p, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const shuffled = scored.slice(0, 12).sort(() => Math.random() - 0.5);
      setRecommendedProducts(shuffled.slice(0, 4) as any);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const price = product.has_variants && selectedVariant ? selectedVariant.price : product.price;
      const variantName = selectedVariant ? selectedVariant.variant_name : null;
      const productName = variantName ? `${product.name} - ${variantName}` : product.name;

      addToCart(
        {
          id: selectedVariant?.id || product.id,
          product_id: product.id,
          name: productName,
          brand_name: product.brand?.name || 'Unknown',
          price: price,
          image_url: selectedVariant?.image_url || product.image_url,
        },
        quantity
      );
      window.location.href = '/cart';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => window.location.href = '/shop'}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {(selectedVariant?.image_url || product.image_url) ? (
              <img
                src={selectedVariant?.image_url || product.image_url}
                alt={selectedVariant ? `${product.name} - ${selectedVariant.variant_name}` : product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <a
              href={`/brands/${product.brand.slug}`}
              className="text-green-600 hover:text-green-700 font-medium mb-2 inline-block"
            >
              {product.brand.name}
            </a>
          )}

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} type={tag} />
              ))}
            </div>
          )}

          <div className="text-4xl font-bold text-green-600 mb-6">
            {product.has_variants && selectedVariant ? (
              <>${selectedVariant.price.toFixed(2)}</>
            ) : product.has_variants && product.base_price ? (
              <>From ${product.base_price.toFixed(2)}</>
            ) : (
              <>${product.price.toFixed(2)}</>
            )}
          </div>

          {product.has_variants && variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {variants[0].variant_type}
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.inventory_status === 'low_stock' && (
            <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg mb-6">
              Only a few left in stock!
            </div>
          )}

          {product.is_subscription_available && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Subscribe & Save {product.subscription_discount}%</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setPurchaseType('one-time')}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      purchaseType === 'one-time'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm">One-time Purchase</div>
                    <div className="text-lg font-bold mt-1">
                      ${(product.has_variants && selectedVariant ? selectedVariant.price : product.price).toFixed(2)}
                    </div>
                  </button>

                  <button
                    onClick={() => setPurchaseType('subscription')}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-all relative ${
                      purchaseType === 'subscription'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      SAVE {product.subscription_discount}%
                    </div>
                    <div className="text-sm">Subscribe & Save</div>
                    <div className="text-lg font-bold mt-1">
                      ${((product.has_variants && selectedVariant ? selectedVariant.price : product.price) * (1 - product.subscription_discount / 100)).toFixed(2)}
                    </div>
                  </button>
                </div>

                {purchaseType === 'subscription' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Delivery Frequency
                    </label>
                    <select
                      value={subscriptionFrequency}
                      onChange={(e) => setSubscriptionFrequency(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium"
                    >
                      <option value="weekly">Every Week</option>
                      <option value="biweekly">Every 2 Weeks</option>
                      <option value="monthly">Every Month</option>
                      <option value="bimonthly">Every 2 Months</option>
                    </select>
                    <p className="text-xs text-gray-600 mt-2">
                      Cancel or modify anytime from your account. Skip or pause deliveries when needed.
                    </p>
                  </div>
                )}

                {purchaseType === 'subscription' && (
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Regular Price:</span>
                      <span className="text-sm line-through text-gray-500">
                        ${(product.has_variants && selectedVariant ? selectedVariant.price : product.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Subscription Discount:</span>
                      <span className="text-sm font-semibold text-blue-600">
                        -${((product.has_variants && selectedVariant ? selectedVariant.price : product.price) * (product.subscription_discount / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Your Price:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${((product.has_variants && selectedVariant ? selectedVariant.price : product.price) * (1 - product.subscription_discount / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {purchaseType === 'subscription' ? 'Subscribe Now' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {product.description && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.brand && (product.brand.description || product.brand.mission) && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-bold mb-3">About {product.brand.name}</h2>
              {product.brand.description && (
                <p className="text-gray-700 mb-3">{product.brand.description}</p>
              )}
              {product.brand.mission && (
                <p className="text-gray-600 italic">{product.brand.mission}</p>
              )}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.href = `/brands/${product.brand!.slug}`}
              >
                View Brand Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {sameBrandProducts.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">More from {product.brand?.name}</h2>
              <p className="text-gray-600">Discover other products from this brand</p>
            </div>
            {product.brand && (
              <Button
                variant="outline"
                onClick={() => window.location.href = `/brands/${product.brand!.slug}`}
              >
                View All Products
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sameBrandProducts.map((relatedProduct, index) => (
              <ProductCard
                key={`${relatedProduct.id}-${index}`}
                product={{
                  ...relatedProduct,
                  brand_name: relatedProduct.brand?.name,
                }}
              />
            ))}
          </div>
          <div ref={sameBrandSentinelRef} className="h-10 flex items-center justify-center mt-4">
            {sameBrandLoading && (
              <div className="text-gray-500">Loading more products...</div>
            )}
          </div>
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-amber-500" />
              <h2 className="text-3xl font-bold">You May Also Like</h2>
            </div>
            <p className="text-gray-600">Handpicked recommendations based on this product</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={{
                  ...relatedProduct,
                  brand_name: relatedProduct.brand?.name,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Shopping supports animal rescues</h2>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          5% of every purchase goes directly to animal rescue organizations. Your purchases make a real difference!
        </p>
        <Button
          size="lg"
          onClick={() => window.location.href = '/rescues'}
        >
          Learn More About Our Rescues
        </Button>
      </div>
    </div>
  );
}
