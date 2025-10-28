import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Globe, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

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

export default function RescueProfilePage() {
  const { slug } = useParams();
  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadNonprofit();
      loadCuratedProducts();
    }
  }, [slug]);

  const loadNonprofit = async () => {
    const { data } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('slug', slug)
      .in('status', ['active', 'approved'])
      .maybeSingle();

    if (data) setNonprofit(data);
    setLoading(false);
  };

  const loadCuratedProducts = async () => {
    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!nonprofitData) return;

    const { data: curatedData } = await supabase
      .from('nonprofit_curated_products')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          tags,
          brand:brands(name)
        )
      `)
      .eq('nonprofit_id', nonprofitData.id)
      .order('sort_order');

    if (curatedData) {
      const products = curatedData
        .map((item: any) => item.products)
        .filter(Boolean);
      setCuratedProducts(products);
    }
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
        <Button onClick={() => window.location.href = '/rescues'}>
          View All Rescues
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <Button onClick={() => window.location.href = `/shop?rescue=${nonprofit.slug}`}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {curatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">
            {nonprofit.organization_name}'s Recommendations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {curatedProducts.map((product) => (
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
    </div>
  );
}
