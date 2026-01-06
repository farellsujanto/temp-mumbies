'use client';

import { useRouter } from 'next/navigation';
import { Home, Settings, User, TrendingUp, Users, LogOut } from 'lucide-react';

export default function AccountDashboard() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">Mumbies</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h2>
          <p className="text-gray-600">Track your sustainable eating journey</p>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Meals Tracked</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Referrals</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Impact Points</h3>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/partner-application"
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Become a Partner</h4>
                <p className="text-sm text-gray-600">Apply for referral program</p>
              </div>
            </a>

            <a 
              href="https://mumbies.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Shop at Mumbies</h4>
                <p className="text-sm text-gray-600">Visit mumbies.com to shop</p>
              </div>
            </a>

            {/* <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Profile Settings</h4>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Preferences</h4>
                <p className="text-sm text-gray-600">Customize your experience</p>
              </div>
            </button> */}
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> Currently, you can apply for our referral partner program. For shopping, please visit <a href="https://mumbies.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">mumbies.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
