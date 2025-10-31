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
  product_images?: string[];
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
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);

  const gradients = [
    'linear-gradient(135deg, #059669 0%, #10b981 20%, #34d399 40%, #6ee7b7 60%, #a7f3d0 80%, #d1fae5 100%)',
    'linear-gradient(135deg, #1e40af 0%, #3b82f6 20%, #60a5fa 40%, #93c5fd 60%, #bfdbfe 80%, #dbeafe 100%)',
    'linear-gradient(135deg, #b91c1c 0%, #ef4444 20%, #f87171 40%, #fca5a5 60%, #fecaca 80%, #fee2e2 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #ea580c 20%, #fb923c 40%, #fdba74 60%, #fed7aa 80%, #ffedd5 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 20%, #a78bfa 40%, #c4b5fd 60%, #ddd6fe 80%, #ede9fe 100%)',
  ];

  useEffect(() => {
    loadBanners();
    loadFeaturedBrands();
    loadCategoryProducts();
    loadNewArrivals();
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

    if (data) {
      const bannersWithProducts = data.map((banner) => {
        let product_image = '';

        if (banner.title.toLowerCase().includes('mumbies')) {
          product_image = 'https://mumbies.com/cdn/shop/files/Mumbies_ProductListing_Variety-Welcome_Box_NoBackground.png?v=1761567120&width=800';
        }

        return {
          ...banner,
          product_images: product_image ? [product_image] : []
        };
      });
      setBanners(bannersWithProducts);
    }
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
      const { data, error } = await supabase
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

      if (error) {
        console.error(`Error loading ${category} products:`, error);
      } else if (data) {
        console.log(`Loaded ${data.length} ${category} products`);
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        results[category] = shuffled.slice(0, 8) as any;
      }
    }

    setCategoryProducts(results);
  };

  const loadNewArrivals = async () => {
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
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(2);

    if (data) {
      setNewArrivalProducts(data as any);
    }
  };

  return (
    <div>
      {banners.length > 0 && (
        <div className="relative overflow-hidden w-full">
          <div className="relative w-full" style={{ minHeight: '600px' }}>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="relative overflow-hidden w-full" style={{
                  background: gradients[index % gradients.length],
                }}>
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  }}></div>

                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  }}></div>

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center py-16 md:py-20 min-h-[600px]">
                      <div className="text-white z-10 order-2 md:order-1 space-y-6">
                        <div className="inline-block">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                            {banner.subtitle || "Limited Time Offer"}
                          </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                          {banner.title}
                        </h1>
                        {banner.cta_text && banner.cta_link && (
                          <>
                            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-xl">
                              Shop sustainable, eco-friendly products that make a difference for pets and the planet.
                            </p>
                            <div className="pt-4">
                              <Button
                                onClick={() => window.location.href = banner.cta_link!}
                                size="lg"
                                className="bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4"
                              >
                                {banner.cta_text}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative z-10 order-1 md:order-2 flex items-center justify-center">
                        {banner.product_images && banner.product_images.length > 0 ? (
                          <div className="relative w-full px-8" style={{ maxHeight: '300px' }}>
                            <img
                              src={banner.product_images[0]}
                              alt={banner.title}
                              className="relative w-full h-auto object-contain drop-shadow-2xl"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform scale-110"></div>
                            <img
                              src={banner.image_url}
                              alt={banner.title}
                              className="relative w-full max-w-lg h-auto object-contain drop-shadow-2xl"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                </div>
              </div>
            ))}

            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-gray-800 p-3 rounded-full shadow-xl"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-gray-800 p-3 rounded-full shadow-xl"
                  aria-label="Next banner"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      aria-label={`Go to banner ${index + 1}`}
                      className={`h-3 rounded-full transition-all ${
                        index === currentBanner ? 'w-12 bg-white shadow-lg' : 'w-3 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
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
                {newArrivalProducts.length >= 2 ? (
                  <>
                    <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[-5deg]">
                      <img
                        src={newArrivalProducts[0].image_url || ''}
                        alt={newArrivalProducts[0].name}
                        className="w-32 h-32 object-contain rounded-lg mb-2"
                      />
                      <p className="text-sm font-semibold truncate">{newArrivalProducts[0].name}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[5deg] mt-8">
                      <img
                        src={newArrivalProducts[1].image_url || ''}
                        alt={newArrivalProducts[1].name}
                        className="w-32 h-32 object-contain rounded-lg mb-2"
                      />
                      <p className="text-sm font-semibold truncate">{newArrivalProducts[1].name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[-5deg]">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
                      <p className="text-sm font-semibold">New Product</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-[5deg] mt-8">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
                      <p className="text-sm font-semibold">Hot Deal</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/rescues"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <img
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Rescue Stories"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-4 left-4">
                  <Heart className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  Rescue Stories
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Meet our partner rescues and discover the incredible work they do to save and care for animals in need.
                </p>
              </div>
            </a>

            <a
              href="/brands/mumbies"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <img
                  src="https://mumbies.com/cdn/shop/files/Mumbies_ProductListing_Variety-Welcome_Box.jpg?v=1761567120&width=1440"
                  alt="Mumbies Essentials"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-4 left-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                  Mumbies Essentials
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our curated line of high-quality, value-driven pet essentials. Premium products at prices that make sense.
                </p>
              </div>
            </a>

            <a
              href="/shop?filter=new"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <img
                  src="https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Emerging Brands"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-4 left-4">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
                  Emerging Brands
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover innovative pet brands pushing boundaries. Be the first to try the latest and greatest products.
                </p>
              </div>
            </a>
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
