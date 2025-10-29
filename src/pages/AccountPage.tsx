import { useEffect, useState } from 'react';
import { Package, DollarSign, Heart, TrendingUp, Copy, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [attributedRescue, setAttributedRescue] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userProfile?.attributed_rescue_id) {
      loadAttributedRescue();
    }
  }, [userProfile]);

  const loadAttributedRescue = async () => {
    if (!userProfile?.attributed_rescue_id) return;

    const { data } = await supabase
      .from('nonprofits')
      .select('organization_name, slug')
      .eq('id', userProfile.attributed_rescue_id)
      .maybeSingle();

    if (data) setAttributedRescue(data);
  };

  const handleCopyReferralCode = () => {
    if (userProfile?.referral_code) {
      const referralLink = `${window.location.origin}?ref=${userProfile.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const memberSince = userProfile?.member_since
    ? new Date(userProfile.member_since).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user.email?.split('@')[0] || 'Friend'}!</h1>
          <p className="text-gray-600">Member since {memberSince}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{userProfile?.total_orders || 0}</p>
          <p className="text-sm text-gray-600">Orders Placed</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${(userProfile?.total_spent || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${(userProfile?.total_rescue_donations || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Rescue Impact</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${(userProfile?.total_cashback_earned || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Cash Back Earned</p>
        </div>
      </div>

      {attributedRescue && (
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full p-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Attributed Rescue
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>{attributedRescue.organization_name}</strong> receives 5% of all your
                purchases for life!
              </p>
              <p className="text-2xl font-bold text-green-600 mb-4">
                ${(userProfile?.total_rescue_donations || 0).toFixed(2)} donated to date
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/rescues/${attributedRescue.slug}`}
              >
                View Rescue Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Community Impact</h3>
          <p className="text-gray-600 mb-4">
            Your general donations through the checkout slider
          </p>
          <p className="text-3xl font-bold text-green-600 mb-2">
            ${(userProfile?.total_general_donations || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Distributed to all partner rescues
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Latest Order</h3>
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Button variant="outline" onClick={() => window.location.href = '/shop'}>
            Start Shopping
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => window.location.href = '/account/settings'}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="text-2xl mb-2">⚙️</div>
          <h3 className="font-bold mb-1 text-sm">Account Settings</h3>
          <p className="text-xs text-gray-600">Manage your personal details</p>
        </button>

        <button
          onClick={() => window.location.href = '/account/orders'}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-bold mb-1 text-sm">Order History</h3>
          <p className="text-xs text-gray-600">Review previous orders</p>
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-bold mb-1 text-sm">Refer a Friend</h3>
          <p className="text-xs text-gray-600 mb-3">Give $40, Get $40</p>
          {userProfile?.referral_code ? (
            <Button variant="outline" size="sm" onClick={handleCopyReferralCode} fullWidth>
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          ) : (
            <p className="text-xs text-gray-500">Code generating...</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl mb-2">🏢</div>
          <h3 className="font-bold mb-1 text-sm">Refer a Nonprofit</h3>
          {userProfile?.nonprofit_referral_access ? (
            <>
              <p className="text-xs text-gray-600 mb-3">Earn $1000 per qualified referral</p>
              <Button variant="outline" size="sm" fullWidth>
                View Details
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-3">Earn $1000</p>
              <Button variant="ghost" size="sm" fullWidth>
                <Lock className="h-3 w-3 mr-1" />
                Request Access
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Make More Impact?</h2>
        <p className="text-lg mb-6 opacity-90">
          Browse our curated collection of premium pet products
        </p>
        <Button variant="secondary" size="lg" onClick={() => window.location.href = '/shop'}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
