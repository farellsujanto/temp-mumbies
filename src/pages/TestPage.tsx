import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { hasSupabaseCredentials } from '../lib/supabase';

export default function TestPage() {
  const envVars = {
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const allVarsPresent = Object.values(envVars).every(val => !!val);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Site is Working
            </h1>
            <p className="text-neutral-600">
              Deployment successful - React app is rendering correctly
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>

            <div className="space-y-3">
              <StatusItem
                label="React Application"
                status="success"
                message="Loaded and rendering"
              />
              <StatusItem
                label="Routing"
                status="success"
                message="React Router working"
              />
              <StatusItem
                label="Environment Variables"
                status={allVarsPresent ? 'success' : 'error'}
                message={allVarsPresent ? 'All required variables set' : 'Missing required variables'}
              />
              <StatusItem
                label="Supabase Connection"
                status={hasSupabaseCredentials ? 'success' : 'error'}
                message={hasSupabaseCredentials ? 'Credentials configured' : 'Credentials missing'}
              />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 mt-8">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-3">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3">
                  {value ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium text-neutral-900">{key}</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {value ? (
                        <span className="text-green-600">Set ({value.substring(0, 20)}...)</span>
                      ) : (
                        <span className="text-red-600">Not set - Add in Vercel dashboard</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/"
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
              >
                Go to Home Page
              </a>
              <a
                href="/shop"
                className="px-4 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-center font-medium"
              >
                Go to Shop
              </a>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Deployment Info</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Build Date: {new Date().toISOString()}</li>
                    <li>Environment: {import.meta.env.MODE}</li>
                    <li>Base URL: {window.location.origin}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  status,
  message
}: {
  label: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  };

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
  };

  return (
    <div className={`${bgColors[status]} rounded-lg p-4 flex items-center gap-3`}>
      {icons[status]}
      <div className="flex-1">
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
