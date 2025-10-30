import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Gift, AlertCircle, X, Mail, CheckCircle, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface Lead {
  id: string;
  email: string;
  registered_at: string;
  expires_at: string;
  total_spent: number;
  status: string;
  balance?: number;
  days_until_expiry: number;
}

interface GiftedLead {
  id: string;
  email: string;
  amount: number;
  sent_at: string;
  expires_at: string;
  status: string;
  balance: number;
  days_until_expiry: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  amount: number;
  created_at: string;
}

interface OpportunitiesTabProps {
  partnerId: string;
  partnerBalance: number;
  organizationName: string;
  logoUrl?: string | null;
}

export default function OpportunitiesTab({ partnerId, partnerBalance, organizationName, logoUrl }: OpportunitiesTabProps) {
  const [expiringLeads, setExpiringLeads] = useState<Lead[]>([]);
  const [giftedLeads, setGiftedLeads] = useState<GiftedLead[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [conversions, setConversions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sendingGift, setSendingGift] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState<{ [key: string]: number }>({});
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);
  const [previewAmount, setPreviewAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [partnerId]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchExpiringLeads(),
      fetchGiftedLeads(),
      fetchActivityItems(),
      fetchConversions()
    ]);
    setLoading(false);
  };

  const fetchExpiringLeads = async () => {
    const { data: leads, error } = await supabase
      .from('partner_leads')
      .select(`
        id,
        email,
        registered_at,
        expires_at,
        total_spent,
        status,
        lead_balances (balance)
      `)
      .eq('partner_id', partnerId)
      .eq('status', 'active')
      .is('first_purchase_at', null)
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true })
      .limit(20);

    if (!error && leads) {
      const processedLeads = leads.map((lead: any) => {
        const expiresAt = new Date(lead.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...lead,
          balance: lead.lead_balances?.[0]?.balance || 0,
          days_until_expiry: daysUntilExpiry,
        };
      });

      setExpiringLeads(processedLeads.filter(l => l.days_until_expiry <= 30));
    }
  };

  const fetchGiftedLeads = async () => {
    const { data: incentives, error } = await supabase
      .from('partner_incentives')
      .select(`
        id,
        amount,
        created_at,
        expires_at,
        status,
        partner_leads (
          id,
          email,
          lead_balances (balance)
        )
      `)
      .eq('partner_id', partnerId)
      .in('status', ['pending', 'active'])
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && incentives) {
      const processed = incentives.map((inc: any) => {
        const expiresAt = new Date(inc.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: inc.id,
          email: inc.partner_leads.email,
          amount: inc.amount,
          sent_at: inc.created_at,
          expires_at: inc.expires_at,
          status: inc.status,
          balance: inc.partner_leads.lead_balances?.[0]?.balance || 0,
          days_until_expiry: daysUntilExpiry,
        };
      });

      setGiftedLeads(processed);
    }
  };

  const fetchActivityItems = async () => {
    const { data: incentives, error } = await supabase
      .from('partner_incentives')
      .select(`
        id,
        amount,
        created_at,
        status,
        partner_leads (email)
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && incentives) {
      const items = incentives.map((inc: any) => ({
        id: inc.id,
        type: 'gift_sent',
        description: `Sent $${inc.amount.toFixed(2)} to ${inc.partner_leads.email}`,
        amount: -inc.amount,
        created_at: inc.created_at,
      }));

      setActivityItems(items);
    }
  };

  const fetchConversions = async () => {
    const { count, error } = await supabase
      .from('partner_leads')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partnerId)
      .eq('status', 'converted');

    if (!error && count !== null) {
      setConversions(count);
    }
  };

  const handleShowPreview = (lead: Lead, amount: number) => {
    if (amount <= 0 || amount > partnerBalance) {
      alert('Invalid gift amount or insufficient balance');
      return;
    }
    setPreviewLead(lead);
    setPreviewAmount(amount);
    setShowEmailPreview(true);
  };

  const handleConfirmSend = async () => {
    if (!previewLead || previewAmount <= 0) return;

    setSendingGift(previewLead.id);
    setShowEmailPreview(false);

    const leadId = previewLead.id;
    const amount = previewAmount;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const { error: incentiveError } = await supabase
      .from('partner_incentives')
      .insert({
        partner_id: partnerId,
        lead_id: leadId,
        amount: amount,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      });

    if (incentiveError) {
      console.error('Error sending gift:', incentiveError);
      alert('Failed to send gift. Please try again.');
      setSendingGift(null);
      return;
    }

    await fetchData();
    setSendingGift(null);
    setGiftAmount({ ...giftAmount, [leadId]: 0 });
    setPreviewLead(null);
    setPreviewAmount(0);

    alert(`Successfully sent $${amount.toFixed(2)} gift to ${previewLead.email}!`);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 14) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatExpirationDate = () => {
    if (!previewAmount) return '';
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);
    return expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showEmailPreview && previewLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Email Preview</h2>
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                This is what {previewLead.email} will receive:
              </p>

              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-8">
                <div className="bg-white rounded-lg shadow-sm max-w-xl mx-auto">
                  <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-center">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={organizationName}
                        className="h-16 mx-auto mb-4 bg-white rounded-lg p-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold text-white">You've Got Cash!</h1>
                  </div>

                  <div className="p-8 text-center">
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                      <p className="text-gray-700 text-lg mb-2">
                        <strong>{organizationName}</strong> is sending you
                      </p>
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        ${previewAmount.toFixed(2)}
                      </div>
                      <p className="text-gray-600">
                        cash to spend on Mumbies
                      </p>
                    </div>

                    <p className="text-gray-700 mb-6">
                      Use your gift to shop for premium dog products and support animal welfare!
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm">
                      <p className="text-amber-900">
                        <strong>Use by {formatExpirationDate()}</strong>
                      </p>
                      <p className="text-amber-700 text-xs mt-1">
                        Gift expires in 14 days if not claimed
                      </p>
                    </div>

                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
                      Claim Gift
                    </button>

                    <p className="text-xs text-gray-500 mt-6">
                      Your gift will be automatically added to your account balance when you claim it.
                    </p>
                  </div>

                  <div className="bg-gray-100 p-6 text-center border-t">
                    <p className="text-xs text-gray-600">
                      Sent with support from {organizationName}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Mumbies - Premium Dog Products Supporting Animal Welfare
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowEmailPreview(false)}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleConfirmSend}
                  disabled={sendingGift !== null}
                >
                  Confirm & Send Gift
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">{expiringLeads.length}</span>
          </div>
          <h3 className="font-semibold text-blue-900">Expiring Leads</h3>
          <p className="text-sm text-blue-700">Within 30 days</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-green-600">${partnerBalance.toFixed(2)}</span>
          </div>
          <h3 className="font-semibold text-green-900">Available Balance</h3>
          <p className="text-sm text-green-700">Unpaid commissions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Gift className="h-8 w-8 text-purple-600" />
            <span className="text-3xl font-bold text-purple-600">{giftedLeads.length}</span>
          </div>
          <h3 className="font-semibold text-purple-900">Active Gifts</h3>
          <p className="text-sm text-purple-700">Awaiting conversion</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <span className="text-3xl font-bold text-emerald-600">{conversions}</span>
          </div>
          <h3 className="font-semibold text-emerald-900">Total Conversions</h3>
          <p className="text-sm text-emerald-700">All-time leads converted</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Gift className="h-5 w-5 text-blue-600" />
          How Gift Incentives Work
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Send gifts from your balance</strong> to leads who haven't made their first purchase</li>
          <li>• <strong>Gifts expire in 14 days</strong> - unused amounts return to your balance automatically</li>
          <li>• <strong>Leads have 90 days</strong> from registration to make their first purchase</li>
          <li>• <strong>When they purchase,</strong> you earn your commission and they keep any remaining gift balance</li>
          <li>• <strong>If they don't purchase,</strong> the lead expires and unused gifts are refunded to you</li>
        </ul>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Expiring Leads */}
        <div>
          <h3 className="text-xl font-bold mb-4">Expiring Leads</h3>

          {expiringLeads.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No expiring leads at the moment</p>
              <p className="text-sm text-gray-500 mt-2">Leads will appear here when they're within 30 days of expiration</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expiringLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`border rounded-lg p-6 ${getUrgencyColor(lead.days_until_expiry)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{lead.email}</h4>
                        <span className="px-2 py-1 bg-white rounded text-xs font-semibold">
                          {lead.days_until_expiry} days left
                        </span>
                      </div>
                      <p className="text-sm opacity-80">
                        Registered {new Date(lead.registered_at).toLocaleDateString()}
                      </p>
                      {lead.balance > 0 && (
                        <p className="text-sm font-semibold mt-2">
                          Current Gift Balance: ${lead.balance.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-current border-opacity-20">
                    <p className="text-sm font-semibold mb-3">Send a Gift to Encourage Purchase</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setGiftAmount({ ...giftAmount, [lead.id]: 5 })}
                            className="px-3 py-2 bg-white border-2 border-current rounded-lg font-semibold text-sm hover:bg-opacity-50 transition-colors"
                          >
                            $5
                          </button>
                          <button
                            onClick={() => setGiftAmount({ ...giftAmount, [lead.id]: 10 })}
                            className="px-3 py-2 bg-white border-2 border-current rounded-lg font-semibold text-sm hover:bg-opacity-50 transition-colors"
                          >
                            $10
                          </button>
                          <button
                            onClick={() => setGiftAmount({ ...giftAmount, [lead.id]: 15 })}
                            className="px-3 py-2 bg-white border-2 border-current rounded-lg font-semibold text-sm hover:bg-opacity-50 transition-colors"
                          >
                            $15
                          </button>
                          <input
                            type="number"
                            value={giftAmount[lead.id] || ''}
                            onChange={(e) => setGiftAmount({ ...giftAmount, [lead.id]: parseFloat(e.target.value) || 0 })}
                            placeholder="Custom"
                            className="w-24 px-3 py-2 border-2 border-current rounded-lg text-sm"
                            min="1"
                            max={partnerBalance}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => handleShowPreview(lead, giftAmount[lead.id] || 5)}
                        disabled={sendingGift === lead.id || (giftAmount[lead.id] || 5) > partnerBalance}
                        loading={sendingGift === lead.id}
                      >
                        {sendingGift === lead.id ? 'Sending...' : `Send $${(giftAmount[lead.id] || 5).toFixed(2)}`}
                      </Button>
                    </div>
                    <p className="text-xs mt-2 opacity-70">
                      Gift expires in 14 days. Unused amount returns to your balance.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Gifted Leads & Activity */}
        <div className="space-y-6">
          {/* Gifted Leads */}
          <div>
            <h3 className="text-xl font-bold mb-4">Gifted Leads</h3>

            {giftedLeads.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No gifts sent yet</p>
                <p className="text-sm text-gray-500 mt-2">Send a gift to an expiring lead to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giftedLeads.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{gift.email}</h4>
                        <p className="text-sm text-gray-600">
                          Gift: ${gift.amount.toFixed(2)} • Balance: ${gift.balance.toFixed(2)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        gift.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {gift.status === 'pending' ? 'Pending' : 'Claimed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>
                        Sent {new Date(gift.sent_at).toLocaleDateString()}
                      </span>
                      <span>
                        Expires in {gift.days_until_expiry} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stream */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activity
            </h3>

            {activityItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activityItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
