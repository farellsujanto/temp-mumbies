import { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  tags: string[];
  category: string | null;
  brand: { id: string; name: string } | null;
}

interface Brand {
  id: string;
  name: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    brandIds: [] as string[],
    minPrice: '',
    maxPrice: '',
    tags: [] as string[],
  });

  const [sortBy, setSortBy] = useState('name');

  const categories = ['food', 'treats', 'toys', 'accessories'];
  const availableTags = [
    'made_in_usa',
    'organic',
    'b_corp',
    'donates_to_rescues',
    'family_owned',
    'woman_owned',
    'veteran_owned',
    'small_business',
    'sustainable',
  ];

  useEffect(() => {
    loadBrands();
    loadProducts();
  }, [filters, sortBy]);

  const loadBrands = async () => {
    const { data } = await supabase
      .from('brands')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    if (data) setBrands(data);
  };

  const loadProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        tags,
        category,
        brand:brands(id, name)
      `)
      .eq('is_active', true);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.brandIds.length > 0) {
      query = query.in('brand_id', filters.brandIds);
    }

    if (filters.minPrice) {
      query = query.gte('price', parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      query = query.lte('price', parseFloat(filters.maxPrice));
    }

    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('name');
    }

    const { data } = await query;

    if (data) {
      let filtered = data as any;

      if (filters.tags.length > 0) {
        filtered = filtered.filter((product: any) =>
          filters.tags.some((tag) => product.tags.includes(tag))
        );
      }

      setProducts(filtered);
    }
    setLoading(false);
  };

  const toggleBrand = (brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(brandId)
        ? prev.brandIds.filter((id) => id !== brandId)
        : [...prev.brandIds, brandId],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brandIds: [],
      minPrice: '',
      maxPrice: '',
      tags: [],
    });
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.brandIds.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    filters.tags.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shop All Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 text-green-600 font-medium"
        >
          <Filter className="h-5 w-5" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`${
            showFilters ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden'
          } md:block md:static md:w-64 flex-shrink-0`}
        >
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" fullWidth onClick={clearFilters} className="mb-4">
              Clear All Filters
            </Button>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: prev.category === category ? '' : category,
                        }))
                      }
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brandIds.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      className="text-green-600 focus:ring-green-500 rounded"
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Attributes</h3>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm capitalize">{tag.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${products.length} products`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Name: A-Z</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    brand_name: product.brand?.name,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
