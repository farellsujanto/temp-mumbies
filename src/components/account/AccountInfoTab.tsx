import { useAuth } from '../../contexts/AuthContext';
import { Package, Heart, DollarSign, TrendingUp, Gift, Building2, Send, Copy } from 'lucide-react';
import { useState } from 'react';
import Button from '../Button';

export default function AccountInfoTab() {
  const { user, userProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const memberSince = userProfile?.member_since
    ? new Date(userProfile.member_since).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleCopyReferralCode = () => {
    if (userProfile?.referral_code) {
      const referralLink = `${window.location.origin}?ref=${userProfile.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendReferralEmail = async () => {
    if (!referralEmail) return;

    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setReferralEmail('');
    }, 3000);
  };

  const totalDonated = (userProfile?.total_rescue_donations || 0) + (userProfile?.total_general_donations || 0);
  const avgSavingsPerOrder = userProfile?.total_orders
    ? ((userProfile?.total_spent || 0) * 0.10) / userProfile.total_orders
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hi, {user?.email?.split('@')[0] || 'Friend'}</h1>
          <p className="text-gray-600">Member since {memberSince}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Mumbies Cash Balance</p>
          <p className="text-2xl font-bold text-green-600">
            ${(userProfile?.total_cashback_earned || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Savings</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {userProfile?.total_orders || 0}
            </div>
            <p className="text-sm text-gray-600">Orders Placed</p>
          </div>

          <button
            onClick={() => {
              const impactTab = document.querySelector('[data-tab="impact"]') as HTMLButtonElement;
              if (impactTab) impactTab.click();
            }}
            className="bg-green-50 rounded-lg p-6 text-center hover:bg-green-100 transition-colors cursor-pointer"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${totalDonated.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Total Donated</p>
          </button>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              ${avgSavingsPerOrder.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Avg Savings Per Order</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              ${((userProfile?.total_spent || 0) * 0.10 + (userProfile?.total_cashback_earned || 0)).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Total Savings Since {memberSince.split(' ')[1]}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Refer & Earn</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-600 rounded-full p-3">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Invite Your Friends</h3>
                <p className="text-gray-700 mb-1">Get $40 in Mumbies Cash</p>
                <p className="text-sm text-gray-600">Your friend gets $40 off their first order</p>
              </div>
            </div>

            {userProfile?.referral_code ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send invite via email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={referralEmail}
                      onChange={(e) => setReferralEmail(e.target.value)}
                      placeholder="friend@email.com"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleSendReferralEmail}
                      disabled={!referralEmail || emailSent}
                    >
                      {emailSent ? (
                        <>Sent!</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-blue-50 text-gray-500">or copy link</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 font-mono text-sm break-all">
                  {window.location.origin}?ref={userProfile.referral_code}
                </div>
                <Button variant="outline" onClick={handleCopyReferralCode} fullWidth>
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy Referral Link'}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Generating your referral code...</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-600 rounded-full p-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Refer a Nonprofit</h3>
                <p className="text-gray-700 mb-1">Earn $1,000 per qualified referral</p>
                <p className="text-sm text-gray-600">Help us partner with more rescues</p>
              </div>
            </div>

            {userProfile?.nonprofit_referral_access ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send nonprofit invite
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="rescue@email.com"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
                <Button variant="outline" fullWidth>
                  View Referral Dashboard
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">How it works:</strong><br />
                    Refer an animal rescue or nonprofit. When they become a qualified partner, you earn $1,000 in Mumbies Cash.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="outline" fullWidth>
                  Request Access
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Request access to our nonprofit referral program and start earning $1,000 for every qualified rescue you refer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const ordersTab = document.querySelector('[data-tab="orders"]') as HTMLButtonElement;
              if (ordersTab) ordersTab.click();
            }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold mb-1">Orders</h3>
            <p className="text-xs text-gray-600">Review previous orders</p>
          </button>

          <button
            onClick={() => window.location.href = '/shop'}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold mb-1">Buy It Again</h3>
            <p className="text-xs text-gray-600">Reorder past purchases</p>
          </button>

          <button
            onClick={() => {
              const impactTab = document.querySelector('[data-tab="impact"]') as HTMLButtonElement;
              if (impactTab) impactTab.click();
            }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold mb-1">My Impact</h3>
            <p className="text-xs text-gray-600">See how you're making a difference</p>
          </button>

          <button
            onClick={() => {
              const addressesTab = document.querySelector('[data-tab="addresses"]') as HTMLButtonElement;
              if (addressesTab) addressesTab.click();
            }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold mb-1">Shopping Preferences</h3>
            <p className="text-xs text-gray-600">Manage addresses & settings</p>
          </button>

          <button
            onClick={() => {
              const subscriptionsTab = document.querySelector('[data-tab="subscriptions"]') as HTMLButtonElement;
              if (subscriptionsTab) subscriptionsTab.click();
            }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold mb-1">Subscriptions</h3>
            <p className="text-xs text-gray-600">Save 10% with auto-delivery</p>
          </button>

          <button
            onClick={() => window.location.href = '/shop'}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <Gift className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold mb-1">Redeem Gift Card</h3>
            <p className="text-xs text-gray-600">Cash in membership gifts</p>
          </button>
        </div>
      </div>
    </div>
  );
}
