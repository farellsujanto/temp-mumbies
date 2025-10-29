import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, MapPin, Factory, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Badge from '../components/Badge';
import Button from '../components/Button';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  story: string | null;
  mission: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  headquarters_state: string | null;
  manufacturing_location: string | null;
  website: string | null;
  attributes: string[];
  is_mumbies_brand: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  base_price: number | null;
  has_variants: boolean;
  image_url: string | null;
  tags: string[];
  brand: { name: string };
}

export default function BrandProfilePage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      setPage(0);
      setHasMore(true);
      setProducts([]);
      loadBrand();
    }
  }, [slug]);

  const loadBrand = async () => {
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (brandError) {
      console.error('Error loading brand:', brandError);
    } else if (brandData) {
      setBrand(brandData);
      loadProducts(brandData.id);
    }
    setLoading(false);
  };

  const loadProducts = async (brandId: string, page = 0, append = false) => {
    if (productsLoading) return;

    setProductsLoading(true);
    const pageSize = 12;

    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        base_price,
        has_variants,
        image_url,
        tags,
        brand:brands(name)
      `)
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (data) {
      if (append) {
        setProducts(prev => [...prev, ...(data as any)]);
      } else {
        setProducts(data as any);
      }
      setHasMore(data.length === pageSize);
    }
    setProductsLoading(false);
  };

  const loadMore = useCallback(() => {
    if (!brand?.id || !hasMore || productsLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(brand.id, nextPage, true);
  }, [brand, page, hasMore, productsLoading]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !productsLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, productsLoading]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Brand not found</h2>
        <Button onClick={() => window.location.href = '/shop'}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {brand.hero_image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${brand.hero_image_url})` }}
          ></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-green-200 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          <div className="flex items-start gap-8">
            {brand.logo_url && (
              <div className="bg-white rounded-lg p-4 w-32 h-32 flex items-center justify-center flex-shrink-0">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{brand.name}</h1>
              {brand.description && (
                <p className="text-xl text-green-50 mb-4">{brand.description}</p>
              )}
              {brand.attributes && brand.attributes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {brand.attributes.map((attr) => (
                    <Badge key={attr} type={attr} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            {brand.story && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-gray-700 leading-relaxed">{brand.story}</p>
              </div>
            )}

            {brand.mission && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">{brand.mission}</p>
              </div>
            )}

            {brand.is_mumbies_brand && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Supporting Animal Rescue
                </h3>
                <p className="text-green-700">
                  10% of proceeds from every purchase go directly to local rescuers and
                  shelters, helping us work towards our goal of building a self-sustaining
                  dog sanctuary.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {brand.headquarters_state && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Headquarters</h3>
                </div>
                <p className="text-gray-700">{brand.headquarters_state}</p>
              </div>
            )}

            {brand.manufacturing_location && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Factory className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Manufacturing</h3>
                </div>
                <p className="text-gray-700">{brand.manufacturing_location}</p>
              </div>
            )}

            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <ExternalLink className="h-5 w-5" />
                Visit Website
              </a>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Products from {brand.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={{
                    ...product,
                    brand_name: brand.name,
                  }}
                />
              ))}
            </div>
            <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-6">
              {productsLoading && (
                <div className="text-gray-500">Loading more products...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
