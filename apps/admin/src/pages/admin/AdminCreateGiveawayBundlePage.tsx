import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductSelectionModal from '../../components/admin/ProductSelectionModal';
import {
  Gift,
  Package,
  Plus,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';

interface Product {
  id: string;
  shopify_id: string;
  title: string;
  description: string;
  vendor: string;
  price: number;
  featured_image: string;
  images: any[];
  variants: any[];
  has_variants: boolean;
}

interface SelectedProduct {
  product: Product;
  variant_id?: string;
  variant_title?: string;
  quantity: number;
}

interface BundleFormData {
  name: string;
  description: string;
  featured_image_url: string;
  total_value: number;
  unlock_requirement_type: string;
  unlock_requirement_value: number;
  is_active: boolean;
}

export default function AdminCreateGiveawayBundlePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<BundleFormData>({
    name: '',
    description: '',
    featured_image_url: '',
    total_value: 0,
    unlock_requirement_type: 'mumbies_cash',
    unlock_requirement_value: 100,
    is_active: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const totalValue = selectedProducts.reduce(
      (sum, sp) => sum + (sp.product.price * sp.quantity),
      0
    );
    setFormData(prev => ({ ...prev, total_value: totalValue }));
  }, [selectedProducts]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('shopify_products')
      .select('*')
      .eq('status', 'active')
      .order('title');

    if (data) {
      setProducts(data);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `giveaway-bundles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }));
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = (selectedProduct: SelectedProduct) => {
    setSelectedProducts(prev => [...prev, selectedProduct]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveBundle = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Bundle name is required' });
      return;
    }

    if (selectedProducts.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one product' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { data: bundle, error: bundleError } = await supabase
        .from('giveaway_bundles')
        .insert([formData])
        .select()
        .single();

      if (bundleError) throw bundleError;

      const bundleProducts = selectedProducts.map((sp, index) => ({
        bundle_id: bundle.id,
        shopify_product_id: sp.product.id,
        quantity: sp.quantity,
        variant_id: sp.variant_id,
        variant_title: sp.variant_title,
        display_order: index
      }));

      const { error: productsError } = await supabase
        .from('giveaway_bundle_products')
        .insert(bundleProducts);

      if (productsError) throw productsError;

      setMessage({ type: 'success', text: 'Giveaway bundle created successfully!' });

      setTimeout(() => {
        navigate('/giveaways');
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="h-7 w-7 text-purple-600" />
            Create Giveaway Bundle
          </h1>
          <p className="text-gray-600 mt-1">
            Build a product bundle that partners can unlock and give away
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Bundle Details Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Bundle Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bundle Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Ultimate Dog Treat Bundle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what's included in this bundle..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              {formData.featured_image_url && (
                <img
                  src={formData.featured_image_url}
                  alt="Bundle"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unlock Requirement
              </label>
              <select
                value={formData.unlock_requirement_type}
                onChange={(e) => setFormData({ ...formData, unlock_requirement_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="mumbies_cash">Mumbies Cash Balance</option>
                <option value="leads">Number of Leads</option>
                <option value="referrals">Number of Referrals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Amount
              </label>
              <input
                type="number"
                min="0"
                value={formData.unlock_requirement_value}
                onChange={(e) => setFormData({ ...formData, unlock_requirement_value: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Active (available for partners to unlock)</span>
            </label>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bundle Products</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total Value: <span className="font-bold text-green-600">${formData.total_value.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Products
            </button>
          </div>

          {selectedProducts.length > 0 ? (
            <div className="space-y-3">
              {selectedProducts.map((sp, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {sp.product.featured_image && (
                    <img
                      src={sp.product.featured_image}
                      alt={sp.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{sp.product.title}</h3>
                    {sp.variant_title && sp.variant_title !== 'Default' && (
                      <p className="text-sm text-gray-600">Variant: {sp.variant_title}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {sp.quantity}</p>
                    <p className="text-sm font-bold text-green-600 mt-1">
                      ${(sp.product.price * sp.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No products added yet. Click "Add Products" to get started.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <button
            onClick={() => navigate('/giveaways')}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBundle}
            disabled={saving || !formData.name || selectedProducts.length === 0}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Creating...' : 'Create Bundle'}
          </button>
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <ProductSelectionModal
          products={products}
          selectedProducts={selectedProducts}
          onAddProduct={handleAddProduct}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </AdminLayout>
  );
}
