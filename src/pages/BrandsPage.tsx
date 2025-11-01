import { useState, useEffect } from 'react';
import { Search, Shield, Users, Leaf, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  attributes: any;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const { data } = await supabase
      .from('brands')
      .select('id, name, slug, description, logo_url, attributes')
      .eq('is_active', true)
      .order('name');

    if (data) {
      const normalizedBrands = data.map(brand => ({
        ...brand,
        attributes: Array.isArray(brand.attributes) ? brand.attributes : []
      }));
      setBrands(normalizedBrands);
    }
    setLoading(false);
  };

  const filteredBrands = brands.filter((brand) => {
    const attrs = Array.isArray(brand.attributes) ? brand.attributes : [];
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttribute = selectedAttribute === 'all' || attrs.includes(selectedAttribute);
    return matchesSearch && matchesAttribute;
  });

  const allAttributes = Array.from(
    new Set(brands.flatMap((brand) => Array.isArray(brand.attributes) ? brand.attributes : []))
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Brand Partners</h1>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Choose Our Brands</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Every brand we feature is carefully selected to ensure they align with our mission of supporting
            animal welfare while providing exceptional products for your pets. We partner with companies that
            demonstrate:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 flex-shrink-0">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality & Safety</h3>
                  <p className="text-gray-600 text-sm">
                    Premium ingredients, rigorous testing, and transparent manufacturing processes that prioritize
                    your pet's health and wellbeing.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-4 flex-shrink-0">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ethical Practices</h3>
                  <p className="text-gray-600 text-sm">
                    Commitment to sustainability, humane sourcing, and responsible business practices that reflect
                    our values.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl p-4 flex-shrink-0">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Impact</h3>
                  <p className="text-gray-600 text-sm">
                    Partners who actively give back to animal welfare causes and support rescue organizations
                    through their business.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl p-4 flex-shrink-0">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation & Care</h3>
                  <p className="text-gray-600 text-sm">
                    Brands that continuously improve their products based on pet health research and customer
                    feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Our Brands</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Attributes</option>
            {allAttributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <a
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
              >
                {brand.logo_url ? (
                  <div className="aspect-square mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="aspect-square mb-4 flex items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-4xl font-bold text-gray-300">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {brand.description}
                </p>
                {Array.isArray(brand.attributes) && brand.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {brand.attributes.slice(0, 2).map((attr: string) => (
                      <span
                        key={attr}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                      >
                        {attr}
                      </span>
                    ))}
                    {brand.attributes.length > 2 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{brand.attributes.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
