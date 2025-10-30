import { useState, useEffect } from 'react';
import { Package, Heart, Star, Gift, Plus, X, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  brand?: {
    name: string;
  };
}

interface ProductManagementTabProps {
  partnerId: string;
}

export default function ProductManagementTab({ partnerId }: ProductManagementTabProps) {
  const [activeSection, setActiveSection] = useState<'wishlist' | 'recommended' | 'bundle'>('wishlist');
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [bundleConfig, setBundleConfig] = useState({
    name: 'New Pet Parent Starter Bundle',
    description: 'Everything a new pet parent needs to get started!',
    isActive: true
  });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [partnerId]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadWishlistProducts(),
      loadRecommendedProducts(),
      loadBundleProducts(),
      loadBundleConfig(),
      loadAvailableProducts()
    ]);
    setLoading(false);
  };

  const loadWishlistProducts = async () => {
    const { data } = await supabase
      .from('partner_product_lists')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          brand:brand_id (name)
        )
      `)
      .eq('partner_id', partnerId)
      .eq('list_type', 'wishlist')
      .order('sort_order');

    if (data) {
      setWishlistProducts(data.map((item: any) => item.products).filter(Boolean));
    }
  };

  const loadRecommendedProducts = async () => {
    const { data } = await supabase
      .from('partner_product_lists')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          brand:brand_id (name)
        )
      `)
      .eq('partner_id', partnerId)
      .eq('list_type', 'recommended')
      .order('sort_order');

    if (data) {
      setRecommendedProducts(data.map((item: any) => item.products).filter(Boolean));
    }
  };

  const loadBundleProducts = async () => {
    const { data } = await supabase
      .from('partner_product_lists')
      .select(`
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          brand:brand_id (name)
        )
      `)
      .eq('partner_id', partnerId)
      .eq('list_type', 'bundle')
      .order('sort_order');

    if (data) {
      setBundleProducts(data.map((item: any) => item.products).filter(Boolean));
    }
  };

  const loadBundleConfig = async () => {
    const { data } = await supabase
      .from('partner_bundles')
      .select('*')
      .eq('partner_id', partnerId)
      .maybeSingle();

    if (data) {
      setBundleConfig({
        name: data.bundle_name,
        description: data.bundle_description || '',
        isActive: data.is_active
      });
    }
  };

  const loadAvailableProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        brand:brand_id (name)
      `)
      .eq('status', 'active')
      .order('name');

    if (data) {
      setAvailableProducts(data);
    }
  };

  const addToList = async (product: Product, listType: string) => {
    const currentList = listType === 'wishlist' ? wishlistProducts :
                        listType === 'recommended' ? recommendedProducts : bundleProducts;

    if (listType === 'bundle' && currentList.length >= 5) {
      alert('Bundle can only contain 5 products');
      return;
    }

    const { error } = await supabase
      .from('partner_product_lists')
      .insert({
        partner_id: partnerId,
        product_id: product.id,
        list_type: listType,
        sort_order: currentList.length
      });

    if (!error) {
      if (listType === 'wishlist') loadWishlistProducts();
      else if (listType === 'recommended') loadRecommendedProducts();
      else loadBundleProducts();
    }
  };

  const removeFromList = async (productId: string, listType: string) => {
    const { error } = await supabase
      .from('partner_product_lists')
      .delete()
      .eq('partner_id', partnerId)
      .eq('product_id', productId)
      .eq('list_type', listType);

    if (!error) {
      if (listType === 'wishlist') loadWishlistProducts();
      else if (listType === 'recommended') loadRecommendedProducts();
      else loadBundleProducts();
    }
  };

  const saveBundleConfig = async () => {
    const { data: existing } = await supabase
      .from('partner_bundles')
      .select('id')
      .eq('partner_id', partnerId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('partner_bundles')
        .update({
          bundle_name: bundleConfig.name,
          bundle_description: bundleConfig.description,
          is_active: bundleConfig.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('partner_id', partnerId);
    } else {
      await supabase
        .from('partner_bundles')
        .insert({
          partner_id: partnerId,
          bundle_name: bundleConfig.name,
          bundle_description: bundleConfig.description,
          is_active: bundleConfig.isActive
        });
    }

    alert('Bundle configuration saved!');
  };

  const renderProductGrid = (products: Product[], listType: string, maxItems?: number) => {
    const isInList = (productId: string) => products.some(p => p.id === productId);
    const canAdd = !maxItems || products.length < maxItems;

    return (
      <div className="grid md:grid-cols-4 gap-4">
        {availableProducts
          .filter(p =>
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => {
            const added = isInList(product.id);
            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 ${
                  added ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <img
                  src={product.image_url || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <p className="font-medium text-sm line-clamp-2 mb-1">{product.name}</p>
                {product.brand && (
                  <p className="text-xs text-gray-600 mb-1">{product.brand.name}</p>
                )}
                <p className="text-sm font-bold text-green-600 mb-3">${product.price}</p>
                {added ? (
                  <button
                    onClick={() => removeFromList(product.id, listType)}
                    className="w-full bg-red-100 text-red-700 py-2 rounded text-sm font-medium hover:bg-red-200"
                  >
                    Remove
                  </button>
                ) : canAdd ? (
                  <button
                    onClick={() => addToList(product, listType)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 py-2 rounded text-sm font-medium cursor-not-allowed"
                  >
                    Limit Reached
                  </button>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Package className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Product Management</h2>
              <p className="text-sm text-green-100">
                Manage your wishlist, recommended products, and create a special bundle for new pet parents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('wishlist')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === 'wishlist'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart className="h-4 w-4 inline mr-2" />
          Shelter Wishlist
        </button>
        <button
          onClick={() => setActiveSection('recommended')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === 'recommended'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Star className="h-4 w-4 inline mr-2" />
          Recommended Products
        </button>
        <button
          onClick={() => setActiveSection('bundle')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === 'bundle'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gift className="h-4 w-4 inline mr-2" />
          New Pet Parent Bundle
        </button>
      </div>

      {/* Wishlist Section */}
      {activeSection === 'wishlist' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Shelter Wishlist</h3>
            <p className="text-sm text-gray-700">
              Add products your shelter needs. Supporters can buy these items as gifts directly for your shelter!
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Current Wishlist ({wishlistProducts.length} items)</h3>
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="border border-green-300 bg-green-50 rounded-lg p-3 relative">
                    <button
                      onClick={() => removeFromList(product.id, 'wishlist')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                    >
                      ×
                    </button>
                    <img src={product.image_url || ''} alt={product.name} className="w-full h-20 object-cover rounded mb-2" />
                    <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-600">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold mb-4">Add Products to Wishlist</h3>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {renderProductGrid(wishlistProducts, 'wishlist')}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Section */}
      {activeSection === 'recommended' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Recommended Products</h3>
            <p className="text-sm text-gray-700">
              Products you recommend for pet parents. These will be featured on your profile page for supporters to purchase.
            </p>
          </div>

          {recommendedProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Current Recommendations ({recommendedProducts.length} items)</h3>
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="border border-green-300 bg-green-50 rounded-lg p-3 relative">
                    <button
                      onClick={() => removeFromList(product.id, 'recommended')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                    >
                      ×
                    </button>
                    <img src={product.image_url || ''} alt={product.name} className="w-full h-20 object-cover rounded mb-2" />
                    <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-600">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold mb-4">Add Recommended Products</h3>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {renderProductGrid(recommendedProducts, 'recommended')}
            </div>
          </div>
        </div>
      )}

      {/* Bundle Section */}
      {activeSection === 'bundle' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">New Pet Parent Bundle</h3>
            <p className="text-sm text-gray-700">
              Create a special bundle of 5 products for new pet parents. First-time customers get 20% off this bundle when they shop through your page!
            </p>
          </div>

          {/* Bundle Configuration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Bundle Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bundle Name</label>
                <input
                  type="text"
                  value={bundleConfig.name}
                  onChange={(e) => setBundleConfig({ ...bundleConfig, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bundle Description</label>
                <textarea
                  value={bundleConfig.description}
                  onChange={(e) => setBundleConfig({ ...bundleConfig, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bundleConfig.isActive}
                  onChange={(e) => setBundleConfig({ ...bundleConfig, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Active (show on profile page)</label>
              </div>
              <Button onClick={saveBundleConfig}>
                Save Bundle Configuration
              </Button>
            </div>
          </div>

          {bundleProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Bundle Products ({bundleProducts.length}/5)</h3>
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                {bundleProducts.map((product) => (
                  <div key={product.id} className="border border-amber-300 bg-amber-50 rounded-lg p-3 relative">
                    <button
                      onClick={() => removeFromList(product.id, 'bundle')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                    >
                      ×
                    </button>
                    <img src={product.image_url || ''} alt={product.name} className="w-full h-20 object-cover rounded mb-2" />
                    <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-600">${product.price}</p>
                  </div>
                ))}
              </div>
              {bundleProducts.length === 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    Bundle complete! Total value: ${bundleProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                    {' '}(20% off: ${(bundleProducts.reduce((sum, p) => sum + p.price, 0) * 0.8).toFixed(2)})
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold mb-4">Select 5 Products for Bundle</h3>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {renderProductGrid(bundleProducts, 'bundle', 5)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
