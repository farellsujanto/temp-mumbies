import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  tags: string[];
  brand: { name: string } | null;
}

type Category = 'food' | 'treats' | 'toys' | 'accessories';

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('food');
  const [categoryProducts, setCategoryProducts] = useState<Record<Category, Product[]>>({
    food: [],
    treats: [],
    toys: [],
    accessories: [],
  });

  useEffect(() => {
    loadBanners();
    loadFeaturedBrands();
    loadCategoryProducts();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const loadBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (data) setBanners(data);
  };

  const loadFeaturedBrands = async () => {
    const { data } = await supabase
      .from('brands')
      .select('id, name, slug, logo_url, description')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('name')
      .limit(4);
    if (data) setFeaturedBrands(data);
  };

  const loadCategoryProducts = async () => {
    const categories: Category[] = ['food', 'treats', 'toys', 'accessories'];
    const results: Record<Category, Product[]> = {
      food: [],
      treats: [],
      toys: [],
      accessories: [],
    };

    for (const category of categories) {
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
          promotional_deal,
          brand:brands(name)
        `)
        .eq('is_active', true)
        .eq('category', category)
        .limit(20);

      if (data) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        results[category] = shuffled.slice(0, 8) as any;
      }
    }

    setCategoryProducts(results);
  };

  return (
    <div>
      {banners.length > 0 && (
        <div className="relative overflow-hidden my-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ minHeight: '430px' }}>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="relative rounded-3xl overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #ec4899 50%, #8b5cf6 75%, #1e3a8a 100%)',
                  backgroundSize: '200% 200%',
                }}>
                  <div className="absolute inset-0" style={{
                    background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)',
                  }}></div>

                  <div className="absolute inset-0" style={{
                    background: 'repeating-linear-gradient(0deg, rgba(16,185,129,0.15) 0px, rgba(16,185,129,0.15) 8px, rgba(59,130,246,0.15) 8px, rgba(59,130,246,0.15) 16px, rgba(236,72,153,0.15) 16px, rgba(236,72,153,0.15) 24px)',
                    backgroundSize: '100% 24px',
                  }}></div>

                  <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 h-[500px]">
                    <div className="text-white z-10 order-2 md:order-1">
                      <p className="text-sm md:text-base font-medium mb-2 opacity-90">
                        {banner.subtitle || "This deal won't last"}
                      </p>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {banner.title}
                      </h1>
                      {banner.cta_text && banner.cta_link && (
                        <>
                          <p className="text-lg md:text-xl mb-6 opacity-90">
                            Shop sustainable, eco-friendly products.
                          </p>
                          <Button
                            onClick={() => window.location.href = banner.cta_link!}
                            size="lg"
                            className="bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg"
                          >
                            {banner.cta_text}
                          </Button>
                          <p className="text-sm mt-3 opacity-75">Terms apply.</p>
                        </>
                      )}
                    </div>

                    <div className="relative z-10 order-1 md:order-2 flex items-center justify-center">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    aria-label={`Go to banner ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 py-12 mb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Support Rescues</h3>
                <p className="text-gray-600 text-sm">
                  5% of every purchase goes directly to your chosen animal rescue organization
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Quality Products</h3>
                <p className="text-gray-600 text-sm">
                  Curated selection of natural, sustainable, and premium pet products
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Track Your Impact</h3>
                <p className="text-gray-600 text-sm">
                  See exactly how your purchases are making a difference for animals in need
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Products</h2>
            <Button variant="outline" onClick={() => window.location.href = '/shop'}>
              View All
            </Button>
          </div>

          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              {(['food', 'treats', 'toys', 'accessories'] as Category[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`pb-4 px-1 text-lg font-medium border-b-2 transition-colors ${
                    activeCategory === category
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {categoryProducts[activeCategory].length > 0 ? (
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {categoryProducts[activeCategory].slice(0, 8).map((product) => (
                  <div key={product.id} className="w-64 flex-shrink-0">
                    <ProductCard
                      product={{
                        ...product,
                        brand_name: product.brand?.name,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No products available in this category yet.</p>
            </div>
          )}
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Ends Tonight</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The New Arrivals Sale</h2>
              <p className="text-xl text-gray-700 mb-6">
                Find a new favorite with up to EXTRA 25% off 200+ of our latest launches
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/shop?filter=new'}
              >
                Start Saving
              </Button>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[-5deg]">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
                  <p className="text-sm font-semibold">New Product</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[5deg] mt-8">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
                  <p className="text-sm font-semibold">Hot Deal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {featuredBrands.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredBrands.map((brand) => (
                <a
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-full h-24 object-contain mb-4"
                    />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded mb-4">
                      <span className="text-2xl font-bold text-gray-400">{brand.name[0]}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-center">{brand.name}</h3>
                  {brand.description && (
                    <p className="text-sm text-gray-600 text-center mt-2 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Partner Rescues</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Is your organization passionate about animal welfare? Partner with Mumbies and start earning 5% on every purchase made by your supporters.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/partner/apply'}
          >
            Apply to Partner
          </Button>
        </section>
      </div>
    </div>
  );
}
