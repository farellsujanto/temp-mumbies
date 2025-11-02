import { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else if (data.user) {
      // Check user role and redirect accordingly
      const { data: userProfile } = await supabase
        .from('users')
        .select('is_admin, is_partner')
        .eq('id', data.user.id)
        .single();

      if (userProfile?.is_admin) {
        window.location.href = '/admin';
      } else if (userProfile?.is_partner) {
        window.location.href = '/partner/dashboard';
      } else {
        window.location.href = '/account';
      }
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Mumbies</h2>
          <p className="text-gray-600">Sign in to track your impact and manage your account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">👤 Customer Account</p>
              <p className="text-xs text-blue-700">Email: customer@mumbies.com</p>
              <p className="text-xs text-blue-700">Password: customer123</p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-900 mb-2">🤝 Partner Account</p>
              <p className="text-xs text-green-700">Email: partner@mumbies.com</p>
              <p className="text-xs text-green-700">Password: partner123</p>
              <p className="text-xs text-green-600 mt-1">Access to Partner Dashboard</p>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-900 mb-2">🛡️ Admin Account</p>
              <p className="text-xs text-red-700">Email: admin@mumbies.com</p>
              <p className="text-xs text-red-700">Password: admin123</p>
              <p className="text-xs text-red-600 mt-1">Full admin portal access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
