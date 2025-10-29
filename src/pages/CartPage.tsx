import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  brand: { name: string } | null;
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, sliderValue, setSliderValue } = useCart();
  const { user, userProfile } = useAuth();
  const [localSliderValue, setLocalSliderValue] = useState(sliderValue);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const sliderPercentage = localSliderValue / 5;
  const cashbackAmount = subtotal * (localSliderValue / 100);
  const generalDonationAmount = subtotal * ((5 - localSliderValue) / 100);
  const rescueDonationAmount = userProfile?.attributed_rescue_id ? subtotal * 0.05 : 0;

  useEffect(() => {
    loadSuggestedProducts();
  }, [items]);

  const loadSuggestedProducts = async () => {
    const cartProductIds = items.map(item => item.product_id);

    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        brand:brands(name)
      `)
      .eq('is_active', true)
      .not('id', 'in', `(${cartProductIds.join(',')})`)
      .limit(4);

    if (data) setSuggestedProducts(data as any);
  };

  const handleCheckout = () => {
    setSliderValue(localSliderValue);
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button onClick={() => window.location.href = '/shop'}>
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg divide-y">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="p-3 flex gap-3 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{item.brand_name}</p>
                  <h3 className="font-medium text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-base font-bold text-green-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 text-sm"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {suggestedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      brand_name: product.brand?.name,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Items</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4 text-center">Choose Your Impact</h3>

              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={localSliderValue}
                  onChange={(e) => setLocalSliderValue(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localSliderValue - 1) / 3) * 100}%, #10b981 ${((localSliderValue - 1) / 3) * 100}%, #10b981 100%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span>{localSliderValue}% Cash Back (min 1%)</span>
                <span>{(5 - localSliderValue)}% Rescue Donation (min 1%)</span>
              </div>

              <p className="text-xs text-gray-600 mb-4 text-center">
                Minimum 1% for both ensures your cashback keeps growing and rescues always get support
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">Cash Back ({localSliderValue}%):</span>
                  <span className="text-blue-600 font-bold">${cashbackAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Rescue Donation ({(5 - localSliderValue)}%):</span>
                  <span className="text-green-600 font-bold">${generalDonationAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {userProfile?.attributed_rescue_id && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://vldnyagcdfirhmgwqhfy.supabase.co/storage/v1/object/public/Wisconsin%20Humane%20Society%20Assets/WHS%20Logo_Stacked.png"
                      alt="Wisconsin Humane Society"
                      className="w-10 h-10 rounded-full object-cover bg-white"
                    />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Wisconsin Humane Society</p>
                      <p className="text-xs text-green-700">+5% Extra Impact</p>
                    </div>
                  </div>
                  <span className="text-green-700 font-bold text-lg">${rescueDonationAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <Button
                fullWidth
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <div>
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In to Checkout
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  New to Mumbies? Create an account during checkout
                </p>
              </div>
            )}

            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => window.location.href = '/shop'}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
