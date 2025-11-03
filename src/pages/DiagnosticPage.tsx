import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DiagnosticResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setResults([]);

    // 1. Check environment variables
    addResult({
      name: 'Environment Variables',
      status: import.meta.env.VITE_SUPABASE_URL ? 'success' : 'error',
      message: import.meta.env.VITE_SUPABASE_URL
        ? `URL: ${import.meta.env.VITE_SUPABASE_URL.substring(0, 30)}...`
        : 'VITE_SUPABASE_URL is missing',
      details: {
        url: import.meta.env.VITE_SUPABASE_URL || 'MISSING',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'MISSING'
      }
    });

    // 2. Check Supabase connection
    try {
      const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
      addResult({
        name: 'Supabase Connection',
        status: error ? 'error' : 'success',
        message: error ? error.message : 'Connected successfully',
        details: error || { count: data }
      });
    } catch (err: any) {
      addResult({
        name: 'Supabase Connection',
        status: 'error',
        message: err.message || 'Connection failed',
        details: err
      });
    }

    // 3. Check products table
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, is_active')
        .limit(5);

      addResult({
        name: 'Products Table',
        status: error ? 'error' : 'success',
        message: error ? error.message : `Found ${data?.length || 0} products`,
        details: error || data
      });
    } catch (err: any) {
      addResult({
        name: 'Products Table',
        status: 'error',
        message: err.message || 'Query failed',
        details: err
      });
    }

    // 4. Check brands table
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .limit(5);

      addResult({
        name: 'Brands Table',
        status: error ? 'error' : 'success',
        message: error ? error.message : `Found ${data?.length || 0} brands`,
        details: error || data
      });
    } catch (err: any) {
      addResult({
        name: 'Brands Table',
        status: 'error',
        message: err.message || 'Query failed',
        details: err
      });
    }

    // 5. Check auth
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      addResult({
        name: 'Authentication',
        status: error ? 'error' : 'success',
        message: session ? `Logged in as ${session.user.email}` : 'Not logged in',
        details: error || { hasSession: !!session }
      });
    } catch (err: any) {
      addResult({
        name: 'Authentication',
        status: 'error',
        message: err.message || 'Auth check failed',
        details: err
      });
    }

    // 6. Check nonprofits table
    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('id, organization_name, partner_type')
        .limit(5);

      addResult({
        name: 'Nonprofits Table',
        status: error ? 'error' : 'success',
        message: error ? error.message : `Found ${data?.length || 0} nonprofits`,
        details: error || data
      });
    } catch (err: any) {
      addResult({
        name: 'Nonprofits Table',
        status: 'error',
        message: err.message || 'Query failed',
        details: err
      });
    }

    // 7. Check current user profile with partner data
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select(`
            id,
            email,
            is_partner,
            is_admin,
            nonprofit_id,
            partner_profile:nonprofits!users_nonprofit_id_fkey(
              id,
              organization_name,
              partner_type,
              status,
              mumbies_cash_balance
            )
          `)
          .eq('id', session.user.id)
          .maybeSingle();

        addResult({
          name: 'User Profile with Partner Data',
          status: error ? 'error' : 'success',
          message: error ? error.message : `Loaded profile for ${data?.email}`,
          details: error || data
        });
      }
    } catch (err: any) {
      addResult({
        name: 'User Profile with Partner Data',
        status: 'error',
        message: err.message || 'Query failed',
        details: err
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                result.status === 'loading' ? 'border-gray-300 bg-gray-50' :
                result.status === 'success' ? 'border-green-500 bg-green-50' :
                'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{result.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.status === 'loading' ? 'bg-gray-200 text-gray-700' :
                  result.status === 'success' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Running diagnostics...
          </div>
        )}

        <button
          onClick={runDiagnostics}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Run Diagnostics Again
        </button>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold mb-2">Quick Fix Guide:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• If environment variables are missing: Add them in Vercel Settings → Environment Variables</li>
            <li>• If connection fails: Check Supabase project is active and credentials are correct</li>
            <li>• If tables are empty: Run database migrations and seed data</li>
            <li>• If auth fails: Check RLS policies in Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
