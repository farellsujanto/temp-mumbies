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

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadBanners();
    loadFeaturedBrands();
    loadPopularProducts();
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
      .limit(4);
    if (data) setFeaturedBrands(data);
  };

  const loadPopularProducts = async () => {
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
      .eq('is_active', true)
      .limit(8);
    if (data) setPopularProducts(data as any);
  };

  return (
    <div>
      {banners.length > 0 && (
        <div className="relative bg-gray-900 h-96 md:h-[500px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
                  {banner.subtitle && (
                    <p className="text-xl md:text-2xl mb-6">{banner.subtitle}</p>
                  )}
                  {banner.cta_text && banner.cta_link && (
                    <Button
                      onClick={() => window.location.href = banner.cta_link!}
                      size="lg"
                    >
                      {banner.cta_text}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
              <button
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white bg-opacity-50'
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
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Your Impact</h3>
            <p className="text-gray-600">
              See exactly how your purchases are making a difference for animals in need
            </p>
          </div>
        </div>

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

        {popularProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Popular Products</h2>
              <Button variant="outline" onClick={() => window.location.href = '/shop'}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    brand_name: product.brand?.name,
                  }}
                />
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
