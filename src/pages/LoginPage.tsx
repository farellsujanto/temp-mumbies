import { useState } from 'react';
import { Mail, CheckCircle, TestTube } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await signInWithEmail(email);

    if (authError) {
      setError('Failed to send login link. Please try again.');
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    const demoEmail = 'demo@mumbies.com';
    const demoPassword = 'demo123456';

    let authResult = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (authResult.error?.message.includes('Invalid login credentials')) {
      const signUpResult = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpResult.error) {
        setError('Failed to create demo account. Error: ' + signUpResult.error.message);
        setLoading(false);
        return;
      }

      authResult = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
    }

    if (authResult.error) {
      setError('Demo login failed: ' + authResult.error.message);
      setLoading(false);
    } else {
      window.location.href = '/account';
    }
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click the link in the email to sign in. You can close this page.
          </p>
          <Button variant="outline" onClick={() => setSent(false)}>
            Try Another Method
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Mumbies</h2>
          <p className="text-gray-600">Sign in to track your impact and manage your account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 text-sm font-medium mb-2">🚀 Quick Access for Testing</p>
            <p className="text-blue-700 text-xs mb-3">
              Skip email verification and instantly access the dashboard
            </p>
            <Button
              type="button"
              fullWidth
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <TestTube className="h-5 w-5 mr-2" />
              {loading ? 'Logging in...' : 'Demo Login (Instant Access)'}
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or use magic link</span>
            </div>
          </div>

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

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="outline" fullWidth disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Magic link provides passwordless authentication via email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
