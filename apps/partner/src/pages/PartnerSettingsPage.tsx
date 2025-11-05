import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut, Save } from 'lucide-react';
import { useAuth, supabase } from '@mumbies/shared';

export default function PartnerSettingsPage() {
  const { userProfile, partnerProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {partnerProfile?.organization_name || 'Partner Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{userProfile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Leads
            </button>
            <button
              onClick={() => navigate('/giveaways')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Giveaways
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-4 text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={partnerProfile?.organization_name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partner Type
              </label>
              <input
                type="text"
                value={partnerProfile?.partner_type || 'N/A'}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 capitalize"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  partnerProfile?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {partnerProfile?.status || 'N/A'}
              </span>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes('Error')
                    ? 'bg-red-50 text-red-800'
                    : 'bg-green-50 text-green-800'
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-sm text-gray-600">
              To update your account information, please contact support at{' '}
              <a href="mailto:support@mumbies.com" className="text-blue-600 hover:underline">
                support@mumbies.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
