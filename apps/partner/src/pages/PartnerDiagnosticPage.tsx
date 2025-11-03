import { useEffect, useState } from 'react';
import { supabase } from '@mumbies/shared';
import { useAuth } from '@mumbies/shared';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Database, Users, Gift } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export default function PartnerDiagnosticPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check if user is authenticated
    if (!user) {
      diagnosticResults.push({
        test: 'User Authentication',
        status: 'fail',
        message: 'No user is currently authenticated',
        details: { user: null }
      });
      setResults(diagnosticResults);
      setLoading(false);
      return;
    }

    diagnosticResults.push({
      test: 'User Authentication',
      status: 'pass',
      message: `Authenticated as ${user.email}`,
      details: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });

    // Test 2: Check if partner nonprofit record exists
    try {
      const { data: nonprofit, error: nonprofitError } = await supabase
        .from('nonprofits')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (nonprofitError) {
        diagnosticResults.push({
          test: 'Partner Nonprofit Record',
          status: 'fail',
          message: `Error fetching nonprofit: ${nonprofitError.message}`,
          details: nonprofitError
        });
      } else if (!nonprofit) {
        diagnosticResults.push({
          test: 'Partner Nonprofit Record',
          status: 'fail',
          message: 'No nonprofit record found for this user',
          details: { auth_user_id: user.id }
        });
      } else {
        setPartnerId(nonprofit.id);
        setPartnerData(nonprofit);
        diagnosticResults.push({
          test: 'Partner Nonprofit Record',
          status: 'pass',
          message: `Found: ${nonprofit.organization_name}`,
          details: {
            id: nonprofit.id,
            name: nonprofit.organization_name,
            status: nonprofit.status,
            mumbies_cash_balance: nonprofit.mumbies_cash_balance
          }
        });

        // Test 3: Check if partner can read their own leads
        const { data: leads, error: leadsError } = await supabase
          .from('partner_leads')
          .select('*')
          .eq('partner_id', nonprofit.id);

        if (leadsError) {
          diagnosticResults.push({
            test: 'Partner Leads Access (RLS)',
            status: 'fail',
            message: `RLS blocked: ${leadsError.message}`,
            details: leadsError
          });
        } else {
          diagnosticResults.push({
            test: 'Partner Leads Access (RLS)',
            status: 'pass',
            message: `Can access ${leads?.length || 0} leads`,
            details: {
              lead_count: leads?.length,
              sample_lead: leads?.[0]
            }
          });
        }

        // Test 4: Check giveaway bundles access
        const { data: bundles, error: bundlesError } = await supabase
          .from('giveaway_bundles')
          .select('*')
          .eq('is_active', true);

        if (bundlesError) {
          diagnosticResults.push({
            test: 'Giveaway Bundles Access',
            status: 'fail',
            message: `Cannot access bundles: ${bundlesError.message}`,
            details: bundlesError
          });
        } else {
          diagnosticResults.push({
            test: 'Giveaway Bundles Access',
            status: 'pass',
            message: `Can access ${bundles?.length || 0} bundles`,
            details: { bundle_count: bundles?.length }
          });
        }

        // Test 5: Check partner giveaways
        const { data: giveaways, error: giveawaysError } = await supabase
          .from('partner_giveaways')
          .select('*')
          .eq('partner_id', nonprofit.id);

        if (giveawaysError) {
          diagnosticResults.push({
            test: 'Partner Giveaways Access',
            status: 'fail',
            message: `Cannot access giveaways: ${giveawaysError.message}`,
            details: giveawaysError
          });
        } else {
          diagnosticResults.push({
            test: 'Partner Giveaways Access',
            status: 'pass',
            message: `Found ${giveaways?.length || 0} giveaways`,
            details: { giveaway_count: giveaways?.length }
          });
        }

        // Test 6: Check transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('partner_transactions')
          .select('*')
          .eq('nonprofit_id', nonprofit.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsError) {
          diagnosticResults.push({
            test: 'Partner Transactions Access',
            status: 'fail',
            message: `Cannot access transactions: ${transactionsError.message}`,
            details: transactionsError
          });
        } else {
          diagnosticResults.push({
            test: 'Partner Transactions Access',
            status: 'pass',
            message: `Found ${transactions?.length || 0} recent transactions`,
            details: {
              transaction_count: transactions?.length,
              latest: transactions?.[0]
            }
          });
        }
      }
    } catch (error: any) {
      diagnosticResults.push({
        test: 'System Error',
        status: 'fail',
        message: error.message || 'Unknown error occurred',
        details: error
      });
    }

    setResults(diagnosticResults);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-600" />
                Partner Diagnostics
              </h1>
              <p className="text-gray-600 mt-1">System health check for partner dashboard</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Tests
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Partner Info Card */}
        {partnerData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Partner Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium text-gray-900">{partnerData.organization_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Partner ID</p>
                <p className="font-mono text-sm text-gray-900">{partnerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900 capitalize">{partnerData.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mumbies Cash</p>
                <p className="font-medium text-green-600">${partnerData.mumbies_cash_balance}</p>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results */}
        <div className="space-y-4">
          {loading && results.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Running diagnostics...</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg border p-6 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{result.test}</h3>
                      <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                      {result.details && (
                        <details className="mt-3">
                          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                            View Details
                          </summary>
                          <pre className="mt-2 p-3 bg-white rounded border border-gray-200 text-xs overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {results.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="/partner/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </a>
              <a
                href="/partner/dashboard?tab=leads"
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                View Leads
              </a>
              <a
                href="/partner/dashboard?tab=giveaways"
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                View Giveaways
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
