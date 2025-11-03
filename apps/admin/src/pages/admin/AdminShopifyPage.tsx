import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  ShoppingBag,
  Settings,
  RefreshCw,
  Package,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ShopifySettings {
  id?: string;
  shop_url: string;
  access_token: string;
  api_version: string;
  auto_sync_enabled: boolean;
  sync_frequency_hours: number;
  last_sync_at?: string;
  send_customer_notifications: boolean;
}

interface ShopifyProduct {
  id: string;
  shopify_id: string;
  title: string;
  vendor: string;
  price: number;
  featured_image: string;
  status: string;
  last_synced_at: string;
}

export default function AdminShopifyPage() {
  const [settings, setSettings] = useState<ShopifySettings>({
    shop_url: '',
    access_token: '',
    api_version: '2024-01',
    auto_sync_enabled: false,
    sync_frequency_hours: 24,
    send_customer_notifications: true
  });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
    loadProducts();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('shopify_settings')
      .select('*')
      .maybeSingle();

    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

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

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = settings.id
        ? await supabase
            .from('shopify_settings')
            .update(settings)
            .eq('id', settings.id)
        : await supabase
            .from('shopify_settings')
            .insert([settings]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      loadSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const syncProducts = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      // Call Shopify product sync Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-product-sync`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Synced ${result.products_synced} products successfully!`
        });
        loadProducts();
        loadSettings();
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-green-600" />
              Shopify Integration
            </h1>
            <p className="text-gray-600 mt-1">
              Connect your Shopify store to sync products and automate giveaway orders
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Shopify Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop URL *
              </label>
              <input
                type="text"
                value={settings.shop_url}
                onChange={(e) => setSettings({ ...settings, shop_url: e.target.value })}
                placeholder="your-store.myshopify.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Your Shopify store URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin API Access Token *
              </label>
              <input
                type="password"
                value={settings.access_token}
                onChange={(e) => setSettings({ ...settings, access_token: e.target.value })}
                placeholder="shpat_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from your Shopify Admin API settings
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Version
                </label>
                <select
                  value={settings.api_version}
                  onChange={(e) => setSettings({ ...settings, api_version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="2024-10">2024-10 (Latest)</option>
                  <option value="2024-07">2024-07</option>
                  <option value="2024-04">2024-04</option>
                  <option value="2024-01">2024-01</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Frequency (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.sync_frequency_hours}
                  onChange={(e) => setSettings({ ...settings, sync_frequency_hours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_sync_enabled}
                  onChange={(e) => setSettings({ ...settings, auto_sync_enabled: e.target.checked })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable automatic product sync</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.send_customer_notifications}
                  onChange={(e) => setSettings({ ...settings, send_customer_notifications: e.target.checked })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Send customer notifications for orders</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={saveSettings}
                disabled={saving || !settings.shop_url || !settings.access_token}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>

              {settings.id && (
                <a
                  href={`https://${settings.shop_url}/admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Shopify Admin
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Product Sync */}
        {settings.id && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Sync
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} products synced
                  {settings.last_sync_at && ` • Last synced: ${new Date(settings.last_sync_at).toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={syncProducts}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 inline-flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Products Now'}
              </button>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {products.slice(0, 12).map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    {product.featured_image && (
                      <img
                        src={product.featured_image}
                        alt={product.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {product.title}
                    </h3>
                    {product.vendor && (
                      <p className="text-xs text-gray-500 mt-1">{product.vendor}</p>
                    )}
                    <p className="text-sm font-bold text-green-600 mt-2">
                      ${product.price?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No products synced yet. Click "Sync Products Now" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
