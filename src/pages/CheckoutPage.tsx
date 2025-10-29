import { useState } from 'react';
import { CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function CheckoutPage() {
  const { items, subtotal, sliderValue, setSliderValue, updateQuantity, removeFromCart } = useCart();
  const { userProfile } = useAuth();
  const [isEditingSlider, setIsEditingSlider] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(sliderValue);
  const [showSuccess, setShowSuccess] = useState(false);

  if (items.length === 0 && !showSuccess) {
    window.location.href = '/cart';
    return null;
  }

  const currentSliderValue = isEditingSlider ? localSliderValue : sliderValue;
  const sliderPercentage = currentSliderValue / 5;
  const cashbackAmount = subtotal * (currentSliderValue / 100);
  const generalDonationAmount = subtotal * ((5 - currentSliderValue) / 100);
  const rescueDonationAmount = userProfile?.attributed_rescue_id ? subtotal * 0.05 : 0;

  const handleSaveSlider = () => {
    setSliderValue(localSliderValue);
    setIsEditingSlider(false);
  };

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
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Rescue Donation</span>
                <span className="font-semibold">${generalDonationAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Cash Back</span>
                <span className="font-semibold">${cashbackAmount.toFixed(2)}</span>
              </div>
            </div>

            {userProfile?.attributed_rescue_id && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                <div key={item.product_id} className="flex items-start gap-3">
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
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-green-600 mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Your Impact Split</h3>
                {!isEditingSlider && (
                  <button
                    onClick={() => setIsEditingSlider(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditingSlider ? (
                <>
                  <div className="mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-gray-400 rounded-full"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-gray-400 rounded-full"></div>
                    <div className="px-3">
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
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mb-4">
                    <span>{currentSliderValue}% Cash Back</span>
                    <span>{(5 - currentSliderValue)}% Rescue Donation</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleSaveSlider}
                  >
                    Save Preference
                  </Button>
                </>
              ) : (
                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>{currentSliderValue}% Cash Back</span>
                  <span>{(5 - currentSliderValue)}% Rescue Donation</span>
                </div>
              )}

              <div className="space-y-2 text-sm mt-4">
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">Cash Back ({currentSliderValue}%):</span>
                  <span className="text-blue-600 font-bold">${cashbackAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Rescue Donation ({(5 - currentSliderValue)}%):</span>
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

            <Button fullWidth size="lg" onClick={handleCheckout}>
              Place Demo Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
