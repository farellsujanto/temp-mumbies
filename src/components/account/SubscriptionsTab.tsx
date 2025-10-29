import { useEffect, useState } from 'react';
import { RefreshCw, Calendar, Package, Pause, Play, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface Subscription {
  id: string;
  frequency: string;
  quantity: number;
  unit_price: number;
  status: string;
  next_delivery_date: string;
  product_id: string;
  products?: {
    name: string;
    image_url: string;
  };
}

export default function SubscriptionsTab() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSubscriptions();
  }, [user]);

  const loadSubscriptions = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setSubscriptions(data);
    setLoading(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'Every Week',
      biweekly: 'Every 2 Weeks',
      monthly: 'Every Month',
      bimonthly: 'Every 2 Months',
    };
    return labels[frequency] || frequency;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No Active Subscriptions</h3>
        <p className="text-gray-600 mb-6">
          Save 10% and never run out by subscribing to your favorite products
        </p>
        <button
          onClick={() => window.location.href = '/shop'}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Subscriptions</h2>
        <p className="text-sm text-gray-600">{subscriptions.length} active</p>
      </div>

      <div className="grid gap-6">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex gap-6">
              {subscription.products?.image_url && (
                <img
                  src={subscription.products.image_url}
                  alt={subscription.products.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{subscription.products?.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {getFrequencyLabel(subscription.frequency)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Next delivery: {new Date(subscription.next_delivery_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Quantity: {subscription.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(subscription.unit_price * subscription.quantity).toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save 10%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {subscription.status === 'active' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
