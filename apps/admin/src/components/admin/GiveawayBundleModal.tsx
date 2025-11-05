import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import ProductSelectionModal from './ProductSelectionModal';
import { X, Upload, Image as ImageIcon, AlertCircle, Plus, Trash2, Package } from 'lucide-react';

interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  total_value: number;
  featured_image_url: string | null;
  unlock_requirement_type: string;
  unlock_requirement_value: number;
  is_universal: boolean;
  allow_reuse: boolean;
  cooldown_days: number;
  assigned_partner_ids: string[];
  is_active: boolean;
  products_description: string | null;
}

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

interface GiveawayBundleModalProps {
  bundle: GiveawayBundle | null;
  onClose: () => void;
  onSave: () => void;
}

interface Partner {
  id: string;
  organization_name: string;
}

export default function GiveawayBundleModal({ bundle, onClose, onSave }: GiveawayBundleModalProps) {
  const isEdit = Boolean(bundle);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formData, setFormData] = useState({
    name: bundle?.name || '',
    description: bundle?.description || '',
    total_value: bundle?.total_value || 0,
    featured_image_url: bundle?.featured_image_url || '',
    unlock_requirement_type: bundle?.unlock_requirement_type || 'mumbies_cash',
    unlock_requirement_value: bundle?.unlock_requirement_value || 500,
    is_universal: bundle?.is_universal ?? true,
    allow_reuse: bundle?.allow_reuse ?? false,
    cooldown_days: bundle?.cooldown_days || 0,
    assigned_partner_ids: bundle?.assigned_partner_ids || [],
    is_active: bundle?.is_active ?? false,
    products_description: bundle?.products_description || ''
  });

  useEffect(() => {
    loadPartners();
    loadProducts();
    if (isEdit && bundle) {
      loadBundleProducts();
    }
  }, []);

  const loadPartners = async () => {
    const { data } = await supabase
      .from('nonprofits')
      .select('id, organization_name')
      .eq('status', 'active')
      .order('organization_name');

    if (data) setPartners(data);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('shopify_products')
      .select('*')
      .eq('status', 'active')
      .order('title');

    if (data) setProducts(data);
  };

  const loadBundleProducts = async () => {
    if (!bundle) return;

    const { data } = await supabase
      .from('giveaway_bundle_products')
      .select(`
        *,
        product:shopify_products(*)
      `)
      .eq('bundle_id', bundle.id)
      .order('display_order');

    if (data) {
      const selected: SelectedProduct[] = data.map(item => ({
        product: item.product as Product,
        variant_id: item.variant_id || undefined,
        variant_title: item.variant_title || undefined,
        quantity: item.quantity || 1
      }));
      setSelectedProducts(selected);
    }
  };

  const handleProductsSelected = (newProducts: SelectedProduct[]) => {
    setSelectedProducts(newProducts);
    const totalValue = newProducts.reduce((sum, sp) => sum + (sp.product.price * sp.quantity), 0);
    setFormData({ ...formData, total_value: totalValue });
  };

  const removeProduct = (index: number) => {
    const newProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newProducts);
    const totalValue = newProducts.reduce((sum, sp) => sum + (sp.product.price * sp.quantity), 0);
    setFormData({ ...formData, total_value: totalValue });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `bundle-${Date.now()}.${fileExt}`;
      const filePath = `bundles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image_url: data.publicUrl });
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a giveaway name');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    if (formData.unlock_requirement_value <= 0) {
      alert('Threshold must be greater than 0');
      return;
    }

    if (!formData.is_universal && formData.assigned_partner_ids.length === 0) {
      alert('Please select at least one partner for partner-specific giveaways');
      return;
    }

    setSaving(true);

    try {
      const bundleData = {
        ...formData,
        assigned_partner_ids: formData.is_universal ? [] : formData.assigned_partner_ids
      };

      let bundleId: string;

      if (isEdit) {
        const { error } = await supabase
          .from('giveaway_bundles')
          .update(bundleData)
          .eq('id', bundle.id);

        if (error) throw error;
        bundleId = bundle.id;

        // Delete existing products
        await supabase
          .from('giveaway_bundle_products')
          .delete()
          .eq('bundle_id', bundleId);
      } else {
        const { data, error } = await supabase
          .from('giveaway_bundles')
          .insert(bundleData)
          .select()
          .single();

        if (error) throw error;
        bundleId = data.id;
      }

      // Insert new products
      const productInserts = selectedProducts.map((sp, index) => ({
        bundle_id: bundleId,
        shopify_product_id: sp.product.id,
        quantity: sp.quantity,
        variant_id: sp.variant_id || null,
        variant_title: sp.variant_title || null,
        display_order: index
      }));

      const { error: productsError } = await supabase
        .from('giveaway_bundle_products')
        .insert(productInserts);

      if (productsError) throw productsError;

      onSave();
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const thresholdPresets = [500, 1000, 2500, 5000, 10000, 25000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit' : 'Create'} Giveaway Bundle
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bundle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Starter Bundle, Premium Package"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Describe what's included in this bundle"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            {formData.featured_image_url ? (
              <div className="space-y-3">
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={formData.featured_image_url}
                    alt="Featured"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, featured_image_url: '' })}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          {uploading ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 800x600px • Max: 2MB
                    </p>
                  </div>
                </div>
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Included Products *</label>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                <Plus className="h-3 w-3" />
                Add Products
              </button>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No products selected</p>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Select Products from Shopify
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedProducts.map((sp, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <img
                      src={sp.product.featured_image}
                      alt={sp.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{sp.product.title}</p>
                      {sp.variant_title && (
                        <p className="text-sm text-gray-600">{sp.variant_title}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Quantity: {sp.quantity} × ${sp.product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Retail Value ($) *</label>
            <input
              type="number"
              value={formData.total_value}
              onChange={(e) => setFormData({ ...formData, total_value: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {/* Unlock Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unlock Threshold ($) *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {thresholdPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormData({ ...formData, unlock_requirement_value: preset })}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.unlock_requirement_value === preset
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={formData.unlock_requirement_value}
              onChange={(e) => setFormData({ ...formData, unlock_requirement_value: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="100"
            />
          </div>

          {/* Bundle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bundle Type *</label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={formData.is_universal}
                  onChange={() => setFormData({ ...formData, is_universal: true, assigned_partner_ids: [] })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Universal</p>
                  <p className="text-sm text-gray-600">Any partner can use this bundle once they hit the threshold</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={!formData.is_universal}
                  onChange={() => setFormData({ ...formData, is_universal: false })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Partner-Specific</p>
                  <p className="text-sm text-gray-600">Only selected partners can access this bundle</p>
                </div>
              </label>
            </div>
          </div>

          {/* Partner Selection (if partner-specific) */}
          {!formData.is_universal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Partners *</label>
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto p-3 space-y-2">
                {partners.map(partner => (
                  <label key={partner.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.assigned_partner_ids.includes(partner.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assigned_partner_ids: [...formData.assigned_partner_ids, partner.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assigned_partner_ids: formData.assigned_partner_ids.filter(id => id !== partner.id)
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-gray-900">{partner.organization_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Reusability (only for universal) */}
          {formData.is_universal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reusability Settings</label>
              <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.allow_reuse}
                  onChange={(e) => setFormData({ ...formData, allow_reuse: e.target.checked, cooldown_days: e.target.checked ? 30 : 0 })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Allow partners to reuse this bundle</p>
                  <p className="text-sm text-gray-600 mb-2">Partners can run multiple giveaways with the same bundle</p>

                  {formData.allow_reuse && (
                    <div className="mt-3">
                      <label className="block text-sm text-gray-700 mb-1">Cooldown Period (days)</label>
                      <input
                        type="number"
                        value={formData.cooldown_days}
                        onChange={(e) => setFormData({ ...formData, cooldown_days: parseInt(e.target.value) || 0 })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Days required between using the same bundle again</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <div>
                <p className="font-medium text-gray-900">Active</p>
                <p className="text-sm text-gray-600">Bundle is visible to partners and can be used</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Bundle' : 'Create Bundle')}
          </button>
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <ProductSelectionModal
          products={products}
          selectedProducts={selectedProducts}
          onClose={() => setShowProductModal(false)}
          onSave={handleProductsSelected}
        />
      )}
    </div>
  );
}
