import { useAuth } from '../../contexts/AuthContext';
import { Mail, Calendar, Gift, Building2, Copy, Lock } from 'lucide-react';
import { useState } from 'react';
import Button from '../Button';

export default function AccountInfoTab() {
  const { user, userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const memberSince = userProfile?.member_since
    ? new Date(userProfile.member_since).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Account Information</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Account Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-3xl font-bold text-gray-900">{userProfile?.total_orders || 0}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-3xl font-bold text-gray-900">${(userProfile?.total_spent || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-3xl font-bold text-green-600">${(userProfile?.total_cashback_earned || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Cashback Earned</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Referral Programs</h3>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Refer a Friend</h4>
                <p className="text-gray-700 mb-4">Give $40, Get $40 cashback</p>
                {userProfile?.referral_code ? (
                  <>
                    <div className="bg-white rounded-lg p-4 mb-3 font-mono text-sm">
                      {window.location.origin}?ref={userProfile.referral_code}
                    </div>
                    <Button variant="outline" onClick={handleCopyReferralCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy Referral Link'}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Generating your referral code...</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Refer a Nonprofit</h4>
                {userProfile?.nonprofit_referral_access ? (
                  <>
                    <p className="text-gray-700 mb-4">Earn $1,000 per qualified nonprofit referral</p>
                    <Button variant="outline">View Referral Dashboard</Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">
                      Earn $1,000 for every qualified animal rescue or nonprofit you refer
                    </p>
                    <Button variant="ghost">
                      <Lock className="h-4 w-4 mr-2" />
                      Request Access
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
