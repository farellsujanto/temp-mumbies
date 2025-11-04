import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, supabase, Button } from '@mumbies/shared';
import PartnerLayout from '../components/partner/PartnerLayout';
import { AlertCircle, Settings, DollarSign, Link as LinkIcon, CheckCircle } from 'lucide-react';

interface NonprofitData {
  id: string;
  organization_name: string;
  mission_statement: string | null;
  contact_name: string | null;
  contact_email: string | null;
  website: string | null;
  payout_method: string | null;
  payout_email: string | null;
  bank_account_name: string | null;
  bank_routing_number: string | null;
  bank_account_number: string | null;
  mailing_address_line1: string | null;
  mailing_address_line2: string | null;
  mailing_address_city: string | null;
  mailing_address_state: string | null;
  mailing_address_zip: string | null;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_type: string;
  balance_after: number;
  description: string;
  created_at: string;
}

export default function PartnerSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'payout' | 'sitestripe' | 'transactions'>('profile');

  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [payoutMethod, setPayoutMethod] = useState('');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [mailingLine1, setMailingLine1] = useState('');
  const [mailingLine2, setMailingLine2] = useState('');
  const [mailingCity, setMailingCity] = useState('');
  const [mailingState, setMailingState] = useState('');
  const [mailingZip, setMailingZip] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);

  const [sitestripeEnabled, setSitestripeEnabled] = useState(true);
  const [savingSitestripe, setSavingSitestripe] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNonprofitData();
  }, [user, navigate]);

  useEffect(() => {
    if (activeSubTab === 'transactions' && user) {
      loadTransactions();
    }
  }, [activeSubTab, user]);

  useEffect(() => {
    if (nonprofit?.id) {
      loadSitestripePreferences();
    }
  }, [nonprofit?.id]);

  const loadNonprofitData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('nonprofits')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data || (data.status !== 'active' && data.status !== 'approved')) {
        navigate('/login');
        return;
      }

      setNonprofit(data);
      setOrganizationName(data.organization_name || '');
      setMissionStatement(data.mission_statement || '');
      setContactName(data.contact_name || '');
      setContactEmail(data.contact_email || '');
      setWebsite(data.website || '');
      setPayoutMethod(data.payout_method || '');
      setPayoutEmail(data.payout_email || '');
      setBankAccountName(data.bank_account_name || '');
      setBankRoutingNumber(data.bank_routing_number || '');
      setBankAccountNumber(data.bank_account_number || '');
      setMailingLine1(data.mailing_address_line1 || '');
      setMailingLine2(data.mailing_address_line2 || '');
      setMailingCity(data.mailing_address_city || '');
      setMailingState(data.mailing_address_state || '');
      setMailingZip(data.mailing_address_zip || '');
    } catch (err: any) {
      console.error('Error loading nonprofit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSitestripePreferences = async () => {
    if (!nonprofit?.id) return;

    try {
      const { data } = await supabase
        .from('partner_preferences')
        .select('sitestripe_enabled')
        .eq('partner_id', nonprofit.id)
        .maybeSingle();

      if (data) {
        setSitestripeEnabled(data.sitestripe_enabled);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;

    try {
      setLoadingTransactions(true);

      const { data, error } = await supabase
        .from('partner_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setTransactions(data || []);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const saveProfileInformation = async () => {
    if (!nonprofit) return;

    try {
      setSavingProfile(true);

      const { error } = await supabase
        .from('nonprofits')
        .update({
          organization_name: organizationName,
          mission_statement: missionStatement,
          contact_name: contactName,
          contact_email: contactEmail,
          website: website,
        })
        .eq('id', nonprofit.id);

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePayoutInformation = async () => {
    if (!nonprofit) return;

    try {
      setSavingPayout(true);

      const { error } = await supabase
        .from('nonprofits')
        .update({
          payout_method: payoutMethod,
          payout_email: payoutEmail,
          bank_account_name: bankAccountName,
          bank_routing_number: bankRoutingNumber,
          bank_account_number: bankAccountNumber,
          mailing_address_line1: mailingLine1,
          mailing_address_line2: mailingLine2,
          mailing_address_city: mailingCity,
          mailing_address_state: mailingState,
          mailing_address_zip: mailingZip,
        })
        .eq('id', nonprofit.id);

      if (error) throw error;

      alert('Payout information updated successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingPayout(false);
    }
  };

  const saveSitestripePreferences = async () => {
    if (!nonprofit) return;

    try {
      setSavingSitestripe(true);

      const { error } = await supabase
        .from('partner_preferences')
        .upsert({
          partner_id: nonprofit.id,
          sitestripe_enabled: sitestripeEnabled,
        }, {
          onConflict: 'partner_id',
        });

      if (error) throw error;

      alert('SiteStripe preferences updated!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingSitestripe(false);
    }
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PartnerLayout>
    );
  }

  if (error) {
    return (
      <PartnerLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 text-sm">Error Loading Data</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your partner account settings</p>
        </div>

        {/* Sub-navigation */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'profile'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSubTab('payout')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'payout'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Payout Info
          </button>
          <button
            onClick={() => setActiveSubTab('sitestripe')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'sitestripe'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            SiteStripe
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'transactions'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Profile Settings */}
        {activeSubTab === 'profile' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                <textarea
                  value={missionStatement}
                  onChange={(e) => setMissionStatement(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <Button onClick={saveProfileInformation} disabled={savingProfile} className="w-full">
                {savingProfile ? 'Saving...' : 'Save Profile Information'}
              </Button>
            </div>
          </div>
        )}

        {/* Payout Information */}
        {activeSubTab === 'payout' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payout Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select method</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </div>

              {payoutMethod === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email</label>
                  <input
                    type="email"
                    value={payoutEmail}
                    onChange={(e) => setPayoutEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              {payoutMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                      <input
                        type="text"
                        value={bankRoutingNumber}
                        onChange={(e) => setBankRoutingNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              {payoutMethod === 'check' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                    <input
                      type="text"
                      value={mailingLine1}
                      onChange={(e) => setMailingLine1(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={mailingLine2}
                      onChange={(e) => setMailingLine2(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={mailingCity}
                        onChange={(e) => setMailingCity(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={mailingState}
                        onChange={(e) => setMailingState(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                      <input
                        type="text"
                        value={mailingZip}
                        onChange={(e) => setMailingZip(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={savePayoutInformation} disabled={savingPayout} className="w-full">
                {savingPayout ? 'Saving...' : 'Save Payout Information'}
              </Button>
            </div>
          </div>
        )}

        {/* SiteStripe Settings */}
        {activeSubTab === 'sitestripe' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              SiteStripe Settings
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>What is SiteStripe?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  SiteStripe is a banner that appears at the top of Mumbies.us when you're logged in. It lets you generate affiliate links for any product instantly.
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <label className="font-medium text-gray-900 block mb-1">Enable SiteStripe</label>
                  <p className="text-sm text-gray-600">Show the affiliate link banner when browsing</p>
                </div>
                <button
                  onClick={() => setSitestripeEnabled(!sitestripeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sitestripeEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sitestripeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <Button onClick={saveSitestripePreferences} disabled={savingSitestripe} className="w-full">
                {savingSitestripe ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {activeSubTab === 'transactions' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Transaction History</h2>

            {loadingTransactions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tx.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()} • {tx.balance_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          parseFloat(tx.amount.toString()) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {parseFloat(tx.amount.toString()) >= 0 ? '+' : ''}${Math.abs(parseFloat(tx.amount.toString())).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Balance: ${tx.balance_after.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}
