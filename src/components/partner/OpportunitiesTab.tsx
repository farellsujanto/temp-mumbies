import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Gift, AlertCircle } from 'lucide-react';
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

interface Incentive {
  id: string;
  amount: number;
  created_at: string;
  expires_at: string;
  status: string;
}

interface OpportunitiesTabProps {
  partnerId: string;
  partnerBalance: number;
}

export default function OpportunitiesTab({ partnerId, partnerBalance }: OpportunitiesTabProps) {
  const [expiringLeads, setExpiringLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingGift, setSendingGift] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchExpiringLeads();
  }, [partnerId]);

  const fetchExpiringLeads = async () => {
    setLoading(true);

    // Fetch leads expiring soon (within 30 days) that haven't made a purchase
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

      setExpiringLeads(processedLeads);
    }

    setLoading(false);
  };

  const handleSendGift = async (leadId: string, amount: number) => {
    if (amount <= 0 || amount > partnerBalance) {
      alert('Invalid gift amount or insufficient balance');
      return;
    }

    setSendingGift(leadId);

    // Create incentive record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 2 week expiration

    const { error: incentiveError } = await supabase
      .from('partner_incentives')
      .insert({
        partner_id: partnerId,
        lead_id: leadId,
        amount: amount,
        expires_at: expiresAt.toISOString(),
        status: 'active',
      });

    if (incentiveError) {
      console.error('Error sending gift:', incentiveError);
      alert('Failed to send gift. Please try again.');
      setSendingGift(null);
      return;
    }

    // Update or create lead balance
    const { error: balanceError } = await supabase
      .rpc('upsert_lead_balance', {
        p_lead_id: leadId,
        p_amount: amount,
      });

    if (balanceError) {
      console.error('Error updating balance:', balanceError);
    }

    // Refresh the list
    await fetchExpiringLeads();
    setSendingGift(null);
    setGiftAmount({ ...giftAmount, [leadId]: 0 });

    alert(`Successfully sent $${amount.toFixed(2)} gift!`);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 14) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
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
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6">
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
          <p className="text-sm text-green-700">To send as gifts</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className="text-3xl font-bold text-purple-600">
              {expiringLeads.filter(l => l.days_until_expiry <= 14).length}
            </span>
          </div>
          <h3 className="font-semibold text-purple-900">High Priority</h3>
          <p className="text-sm text-purple-700">Expiring in 2 weeks</p>
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

      {/* Expiring Leads List */}
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
                      onClick={() => handleSendGift(lead.id, giftAmount[lead.id] || 5)}
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
    </div>
  );
}
