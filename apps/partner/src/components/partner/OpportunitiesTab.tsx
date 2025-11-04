import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Gift, AlertCircle, X, Mail, CheckCircle, History, Send, UserPlus, Phone, ExternalLink, Search } from 'lucide-react';
import { supabase } from '@mumbies/shared';
import { Button } from '@mumbies/shared';
import { Tooltip } from '@mumbies/shared';

interface Lead {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  lead_source: string;
  landing_page_url: string | null;
  status: string;
  gift_sent: boolean;
  gift_amount: number | null;
  gift_sent_at: string | null;
  gift_code: string | null;
  gift_expires_at: string | null;
  created_at: string;
  notes: string | null;
}

interface OpportunitiesTabProps {
  partnerId: string;
  partnerBalance: number;
  organizationName: string;
  logoUrl?: string | null;
}

export default function OpportunitiesTab({ partnerId, partnerBalance, organizationName, logoUrl }: OpportunitiesTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  const [giftAmount, setGiftAmount] = useState('25');
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [partnerId]);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_leads')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.email.toLowerCase().includes(query) ||
          lead.full_name?.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  };

  const handleSendGift = async () => {
    if (!selectedLead) return;

    setSendingGift(true);
    const amount = parseFloat(giftAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      setSendingGift(false);
      return;
    }

    if (amount > partnerBalance) {
      alert(`Insufficient balance. Your balance: $${partnerBalance.toFixed(2)}`);
      setSendingGift(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('partner_send_gift_to_lead', {
        p_lead_id: selectedLead.id,
        p_gift_amount: amount,
        p_message: giftMessage || null
      });

      if (error) throw error;

      const giftCode = data?.gift_code || 'N/A';
      const expiresAt = data?.expires_at ? new Date(data.expires_at).toLocaleDateString() : 'N/A';

      alert(`✅ Gift Sent Successfully!\n\nAmount: $${amount}\nTo: ${selectedLead.email}\nGift Code: ${giftCode}\nExpires: ${expiresAt}\n\nThe recipient can use this code at checkout.`);
      setShowGiftModal(false);
      setSelectedLead(null);
      setGiftAmount('25');
      setGiftMessage('');
      fetchLeads();
      window.location.reload(); // Reload to update balance
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSendingGift(false);
    }
  };

  const getStatusBadge = (lead: Lead) => {
    if (lead.gift_sent) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Gift Sent</span>;
    }
    switch (lead.status) {
      case 'new':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">New</span>;
      case 'contacted':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Contacted</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">{lead.status}</span>;
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    giftSent: leads.filter(l => l.gift_sent).length,
    pending: leads.filter(l => !l.gift_sent && l.status === 'new').length,
    totalGiftAmount: leads.reduce((sum, l) => sum + (l.gift_amount || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="ml-4 text-gray-600">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
        <p className="text-gray-600 mt-1">Manage and engage with your leads</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">New Leads</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.new}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Gifts Sent</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.giftSent}</p>
              <p className="text-xs text-purple-600 mt-1">${stats.totalGiftAmount.toFixed(2)}</p>
            </div>
            <Gift className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Your Balance</p>
              <p className="text-2xl font-bold text-green-700 mt-1">${partnerBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* ALL LEADS - Complete Stream Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                All Leads
              </h3>
              <p className="text-sm text-green-100 mt-1">Complete stream of all leads from all sources</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{leads.length}</p>
              <p className="text-xs text-green-100 uppercase tracking-wide">Total Leads</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Lead</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Source</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Gift</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No leads yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Share your referral link to start generating leads
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.full_name || 'No name'}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </p>
                        {lead.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 capitalize">{lead.lead_source}</p>
                      {lead.landing_page_url && (
                        <a
                          href={lead.landing_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View page
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(lead)}</td>
                    <td className="px-6 py-4">
                      {lead.gift_sent ? (
                        <div>
                          <p className="text-sm font-medium text-green-700">
                            ${lead.gift_amount?.toFixed(2)}
                          </p>
                          {lead.gift_code && (
                            <p className="text-xs font-mono text-gray-900 bg-gray-100 px-1 rounded mt-1">
                              {lead.gift_code}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {lead.gift_sent_at && new Date(lead.gift_sent_at).toLocaleDateString()}
                          </p>
                          {lead.gift_expires_at && (
                            <p className="text-xs text-orange-600 mt-1">
                              Expires: {new Date(lead.gift_expires_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!lead.gift_sent && (
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowGiftModal(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Send className="h-3 w-3" />
                          Send Gift
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Send Gift</h2>
                <p className="text-sm text-gray-600">to {selectedLead.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gift Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    max={partnerBalance}
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="25.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your balance: ${partnerBalance.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (optional)
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Thanks for your interest! Enjoy this gift..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Gift Details:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Recipient receives Mumbies gift code</li>
                      <li>• Deducted from your balance</li>
                      <li>• Action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGiftModal(false);
                    setSelectedLead(null);
                    setGiftAmount('25');
                    setGiftMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendGift}
                  disabled={sendingGift}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  {sendingGift ? 'Sending...' : `Send $${parseFloat(giftAmount || '0').toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
