import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();

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
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
            >
              <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-600">{item.brand_name}</p>
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-lg font-bold text-green-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                onClick={() => window.location.href = '/checkout'}
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
