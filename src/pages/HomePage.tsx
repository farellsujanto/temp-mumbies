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
      .order('is_mumbies_brand', { ascending: false })
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
          brand:brands(name)
        `)
        .eq('is_active', true)
        .eq('category', category)
        .limit(4);

      if (data) {
        results[category] = data as any;
      }
    }

    setCategoryProducts(results);
  };

  return (
    <div>
      {banners.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`relative transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="relative rounded-3xl overflow-hidden my-6" style={{
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

                  <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 min-h-[400px]">
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
                            className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg"
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
          </div>

          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 transition-all shadow-lg z-20"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
              <button
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 transition-all shadow-lg z-20"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white bg-opacity-60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Support Rescues</h3>
            <p className="text-gray-600">
              5% of every purchase goes directly to your chosen animal rescue organization
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Products</h3>
            <p className="text-gray-600">
              Curated selection of natural, sustainable, and premium pet products
            </p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Your Impact</h3>
            <p className="text-gray-600">
              See exactly how your purchases are making a difference for animals in need
            </p>
          </div>
        </div>

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoryProducts[activeCategory].map((product) => (
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
            <div className="text-center py-12 text-gray-500">
              <p>No products available in this category yet.</p>
            </div>
          )}
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
