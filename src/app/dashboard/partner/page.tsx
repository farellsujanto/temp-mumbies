'use client';

import { useRouter } from 'next/navigation';
import { Handshake, TrendingUp, DollarSign, Users, LogOut, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ReferredUser {
  id: number;
  name: string | null;
  email: string;
  joinedAt: string;
}

interface PartnerStats {
  referralCode: string;
  referralUrl: string;
  totalReferralEarnings: number;
  withdrawableBalance: number;
  totalReferredUsers: number;
  referredUsers: ReferredUser[];
}

export default function PartnerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPartnerStats();
  }, []);

  const fetchPartnerStats = async () => {
    try {
      const response = await fetch('/api/v1/partner/statistics');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching partner stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/authentication/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const copyReferralUrl = async () => {
    if (stats?.referralUrl) {
      await navigator.clipboard.writeText(stats.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mumbies Partner</h1>
                <p className="text-xs text-gray-500">Partner Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Partner Dashboard 🤝</h2>
          <p className="text-gray-600">Manage your business and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${loading ? '...' : stats?.totalReferralEarnings.toFixed(2) || '0.00'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
            <p className="text-xs text-gray-400 mt-1">From referrals</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                ${loading ? '...' : stats?.withdrawableBalance.toFixed(2) || '0.00'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Withdrawable Balance</h3>
            <p className="text-xs text-gray-400 mt-1">Available now</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {loading ? '...' : stats?.totalReferredUsers || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Referrals</h3>
            <p className="text-xs text-gray-400 mt-1">Users referred</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-orange-600">0%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Growth Rate</h3>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg">
          <h3 className="text-white text-lg font-bold mb-3">Your Referral Link 🔗</h3>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={loading ? 'Loading...' : stats?.referralUrl || ''}
              className="flex-1 bg-transparent text-gray-700 font-mono text-sm outline-none"
            />
            <button
              onClick={copyReferralUrl}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-white text-xs mt-3 opacity-90">
            Share this link with customers to earn commission on their purchases!
          </p>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Referred Users</h3>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : stats?.referredUsers && stats.referredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{user.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No referred users yet</p>
              <p className="text-sm text-gray-500 mt-2">Share your referral link to start earning!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
