import { useState, useEffect } from 'react';
import {
  FlaskConical,
  Zap,
  Trash2,
  FastForward,
  Plus,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Gift,
  TrendingUp,
  RefreshCw,
  Settings
} from 'lucide-react';
import { supabase } from '@mumbies/shared';
import { Button } from '@mumbies/shared';

interface TestModeSettings {
  test_mode_enabled: boolean;
  time_offset_days: number;
  test_balance: number;
  auto_clear_test_data: boolean;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  duration_days: number;
  scenario_data: any;
}

interface TestModePanelProps {
  partnerId: string;
  organizationName: string;
  onTestModeChange?: (enabled: boolean) => void;
}

export default function TestModePanel({ partnerId, organizationName, onTestModeChange }: TestModePanelProps) {
  const [settings, setSettings] = useState<TestModeSettings>({
    test_mode_enabled: false,
    time_offset_days: 0,
    test_balance: 1000,
    auto_clear_test_data: true
  });
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Quick lead form
  const [quickLeadEmail, setQuickLeadEmail] = useState('');
  const [quickLeadName, setQuickLeadName] = useState('');
  const [quickLeadDaysAgo, setQuickLeadDaysAgo] = useState('0');

  // Stats
  const [testStats, setTestStats] = useState({
    test_leads: 0,
    test_transactions: 0,
    test_rewards: 0
  });

  useEffect(() => {
    loadSettings();
    loadScenarios();
    if (settings.test_mode_enabled) {
      loadTestStats();
    }
  }, [partnerId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_settings')
        .select('*')
        .eq('nonprofit_id', partnerId)
        .maybeSingle();

      if (!error && data) {
        setSettings({
          test_mode_enabled: data.test_mode_enabled || false,
          time_offset_days: data.time_offset_days || 0,
          test_balance: data.test_balance || 1000,
          auto_clear_test_data: data.auto_clear_test_data !== false
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScenarios = async () => {
    const { data } = await supabase
      .from('test_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (data) setScenarios(data);
  };

  const loadTestStats = async () => {
    const { data: leads } = await supabase
      .from('partner_leads')
      .select('id', { count: 'exact', head: true })
      .eq('partner_id', partnerId)
      .eq('is_test_data', true);

    const { data: transactions } = await supabase
      .from('partner_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('nonprofit_id', partnerId)
      .eq('is_test_data', true);

    const { data: rewards } = await supabase
      .from('partner_rewards')
      .select('id', { count: 'exact', head: true })
      .eq('nonprofit_id', partnerId)
      .eq('is_test_data', true);

    setTestStats({
      test_leads: leads?.length || 0,
      test_transactions: transactions?.length || 0,
      test_rewards: rewards?.length || 0
    });
  };

  const toggleTestMode = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('toggle_test_mode', {
        p_nonprofit_id: partnerId,
        p_enabled: !settings.test_mode_enabled
      });

      if (error) throw error;

      const newEnabled = data.test_mode_enabled;
      setSettings(prev => ({ ...prev, test_mode_enabled: newEnabled }));

      if (onTestModeChange) {
        onTestModeChange(newEnabled);
      }

      if (newEnabled) {
        loadTestStats();
      }

      alert(newEnabled ? '✅ Test Mode Enabled!' : '✅ Test Mode Disabled');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const createQuickLead = async () => {
    if (!quickLeadEmail || !quickLeadName) {
      alert('Please enter email and name');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('create_test_lead', {
        p_nonprofit_id: partnerId,
        p_email: quickLeadEmail,
        p_full_name: quickLeadName,
        p_lead_source: 'test',
        p_days_ago: parseInt(quickLeadDaysAgo) || 0
      });

      if (error) throw error;

      alert(`✅ Test lead created: ${quickLeadEmail}`);
      setQuickLeadEmail('');
      setQuickLeadName('');
      setQuickLeadDaysAgo('0');
      loadTestStats();
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const fastForward = async (days: number) => {
    if (!confirm(`Fast forward test data by ${days} days?`)) return;

    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('fast_forward_test_data', {
        p_nonprofit_id: partnerId,
        p_days: days
      });

      if (error) throw error;

      alert(`✅ Fast forwarded ${days} days!\n\nLeads updated: ${data.leads_updated}\nTransactions updated: ${data.transactions_updated}`);
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const clearTestData = async () => {
    if (!confirm('⚠️ Clear ALL test data? This cannot be undone!')) return;

    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('clear_test_data', {
        p_nonprofit_id: partnerId
      });

      if (error) throw error;

      alert(`✅ Test data cleared!\n\nLeads: ${data.leads_deleted}\nTransactions: ${data.transactions_deleted}\nRewards: ${data.rewards_deleted}`);
      loadTestStats();
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const applyScenario = async (scenario: TestScenario) => {
    if (!confirm(`Apply test scenario: ${scenario.name}?`)) return;

    setProcessing(true);
    try {
      const steps = scenario.scenario_data.steps || [];

      for (const step of steps) {
        if (step.action === 'create_lead') {
          await supabase.rpc('create_test_lead', {
            p_nonprofit_id: partnerId,
            p_email: step.email,
            p_full_name: step.name,
            p_lead_source: 'scenario',
            p_days_ago: step.day
          });
        }
      }

      alert(`✅ Scenario applied: ${scenario.name}\n\nCheck your Leads tab to see the results!`);
      loadTestStats();
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading test mode...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Toggle */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Test Mode</h2>
              <p className="text-white/90 text-sm">Accelerated testing environment for {organizationName}</p>
            </div>
          </div>
          <button
            onClick={toggleTestMode}
            disabled={processing}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              settings.test_mode_enabled
                ? 'bg-white text-purple-600 hover:bg-gray-100'
                : 'bg-white/20 text-white hover:bg-white/30'
            } disabled:opacity-50`}
          >
            {settings.test_mode_enabled ? '✓ Test Mode ON' : 'Enable Test Mode'}
          </button>
        </div>
      </div>

      {settings.test_mode_enabled && (
        <>
          {/* Warning Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Test Mode Active</p>
                <p>All test data is isolated and marked with a test flag. Test leads, transactions, and rewards will not affect your production data or statistics.</p>
              </div>
            </div>
          </div>

          {/* Test Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Test Leads</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{testStats.test_leads}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Test Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{testStats.test_transactions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Test Rewards</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{testStats.test_rewards}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Lead Creator */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Quick Test Lead
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={quickLeadEmail}
                    onChange={(e) => setQuickLeadEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={quickLeadName}
                    onChange={(e) => setQuickLeadName(e.target.value)}
                    placeholder="Test User"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days Ago <span className="text-gray-500 text-xs">(0 = today)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={quickLeadDaysAgo}
                    onChange={(e) => setQuickLeadDaysAgo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Creates lead as if it was captured X days ago</p>
                </div>

                <button
                  onClick={createQuickLead}
                  disabled={processing || !quickLeadEmail || !quickLeadName}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Test Lead
                </button>
              </div>
            </div>

            {/* Time Machine */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FastForward className="h-5 w-5 text-blue-600" />
                Time Machine
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Fast-forward test data to simulate the passage of time. Perfect for testing attribution windows, gift expiration, and reward qualification.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => fastForward(7)}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  +7 Days
                </button>

                <button
                  onClick={() => fastForward(30)}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  +30 Days
                </button>

                <button
                  onClick={() => fastForward(60)}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  +60 Days
                </button>

                <button
                  onClick={() => fastForward(90)}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  +90 Days
                </button>
              </div>
            </div>
          </div>

          {/* Test Scenarios */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-600" />
              Pre-Built Test Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                      {scenario.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{scenario.duration_days} day timeline</span>
                    <button
                      onClick={() => applyScenario(scenario)}
                      disabled={processing}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Danger Zone
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Clear All Test Data</p>
                <p className="text-sm text-red-700">Permanently delete all test leads, transactions, and rewards</p>
              </div>
              <button
                onClick={clearTestData}
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Test Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
