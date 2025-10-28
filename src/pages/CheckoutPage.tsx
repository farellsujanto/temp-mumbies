import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { userProfile } = useAuth();
  const [sliderValue, setSliderValue] = useState(2.5);
  const [showSuccess, setShowSuccess] = useState(false);

  if (items.length === 0 && !showSuccess) {
    window.location.href = '/cart';
    return null;
  }

  const sliderPercentage = sliderValue / 5;
  const cashbackAmount = subtotal * (sliderValue / 100);
  const generalDonationAmount = subtotal * ((5 - sliderValue) / 100);
  const rescueDonationAmount = userProfile?.attributed_rescue_id ? subtotal * 0.05 : 0;

  const handleCheckout = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Demo Order Placed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            This is a prototype. No payment was processed.
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-left max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {userProfile?.attributed_rescue_id && (
                <div className="flex justify-between text-green-600">
                  <span>Rescue Impact (5%)</span>
                  <span className="font-semibold">${rescueDonationAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>General Donations</span>
                <span className="font-semibold">${generalDonationAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Your Cash Back</span>
                <span className="font-semibold">${cashbackAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/account'}>
              View Dashboard
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Address"
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="City"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="State"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-medium">
              This is a demo checkout. No payment will be processed.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4 text-center">Choose Your Impact</h3>

              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderPercentage * 100}%, #10b981 ${sliderPercentage * 100}%, #10b981 100%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span>{sliderValue}% Cash Back</span>
                <span>{(5 - sliderValue)}% to Rescues</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">Your Cash Back ({sliderValue}%):</span>
                  <span className="text-blue-600 font-bold">${cashbackAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">General Donation ({(5 - sliderValue)}%):</span>
                  <span className="text-green-600 font-bold">${generalDonationAmount.toFixed(2)}</span>
                </div>
                {userProfile?.attributed_rescue_id && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-green-700 font-medium">Rescue Impact (5%):</span>
                    <span className="text-green-700 font-bold">${rescueDonationAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <Button fullWidth size="lg" onClick={handleCheckout}>
              Place Demo Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
