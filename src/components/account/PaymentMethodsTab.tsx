import { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface PaymentMethod {
  id: string;
  type: string;
  is_default: boolean;
  last_four: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

export default function PaymentMethodsTab() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPaymentMethods();
  }, [user]);

  const loadPaymentMethods = async () => {
    const { data } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (data) setPaymentMethods(data);
    setLoading(false);
  };

  const getBrandIcon = (brand: string) => {
    // In production, you'd use actual card brand icons
    return brand.toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Add Card
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Security:</strong> Your payment information is encrypted and securely stored. We never see or store your full card numbers.
        </p>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Saved Payment Methods</h3>
          <p className="text-gray-600 mb-6">Add a card for faster, more secure checkout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <CreditCard className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold">{getBrandIcon(method.brand)}</span>
                    <span className="text-gray-600">•••• {method.last_four}</span>
                    {method.is_default && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.is_default && (
                  <Button variant="outline" size="sm">
                    Set as Default
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
