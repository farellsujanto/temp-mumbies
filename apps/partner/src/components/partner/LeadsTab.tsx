import { useEffect, useState } from 'react';
import { supabase } from '@mumbies/shared';
import { Mail, Phone, Calendar, Gift, ExternalLink, AlertCircle, Clock, CheckCircle, Users } from 'lucide-react';
import { useDebug } from '../../contexts/DebugContext';

interface Lead {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  lead_source: string;
  status: string;
  expires_at: string | null;
  gift_sent: boolean;
  gift_amount: number | null;
  gift_sent_at: string | null;
  created_at: string;
  landing_page_url: string | null;
}

interface LeadsTabProps {
  partnerId: string;
}

export default function LeadsTab({ partnerId }: LeadsTabProps) {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [expiringLeads, setExpiringLeads] = useState<Lead[]>([]);
  const [giftedLeads, setGiftedLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { logQuery, logData, logError } = useDebug();

  useEffect(() => {
    fetchLeads();
  }, [partnerId]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      console.log('[LeadsTab] Fetching leads for partner:', partnerId);
      logData('Fetching leads for partner', { partnerId });

      const query = supabase
        .from('partner_leads')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      console.log('[LeadsTab] Query result:', { data, error, count: data?.length });
      logQuery('partner_leads.fetchAll', { partnerId }, data, error);

      if (error) {
        console.error('[LeadsTab] Error fetching leads:', error);
        logError(error, 'fetchLeads');
        throw error;
      }

      const leads = data || [];
      console.log('[LeadsTab] Setting leads:', leads.length);
      logData('Leads fetched successfully', { count: leads.length, sample: leads.slice(0, 3) });
      setAllLeads(leads);

      // Filter expiring leads (expires within 30 days)
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiring = leads.filter(lead => {
        if (!lead.expires_at) return false;
        const expiresAt = new Date(lead.expires_at);
        return expiresAt > now && expiresAt <= thirtyDaysFromNow;
      });
      setExpiringLeads(expiring);

      // Filter gifted leads
      const gifted = leads.filter(lead => lead.gift_sent);
      setGiftedLeads(gifted);

      console.log('[LeadsTab] Final state:', {
        all: leads.length,
        expiring: expiring.length,
        gifted: gifted.length
      });
      logData('Leads categorized', {
        all: leads.length,
        expiring: expiring.length,
        gifted: gifted.length
      });
    } catch (error) {
      console.error('[LeadsTab] Error fetching leads:', error);
      logError(error as Error, 'fetchLeads');
      alert(`Error loading leads: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const days = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getExpirationColor = (days: number | null) => {
    if (days === null) return 'text-gray-500';
    if (days <= 7) return 'text-red-600';
    if (days <= 14) return 'text-amber-600';
    return 'text-green-600';
  };

  const renderLeadCard = (lead: Lead) => {
    const daysRemaining = getDaysRemaining(lead.expires_at);

    return (
      <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{lead.full_name || 'No name'}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {lead.email}
            </p>
            {lead.phone && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </p>
            )}
          </div>
          {lead.gift_sent ? (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
              <CheckCircle className="h-3 w-3" />
              Gift Sent
            </div>
          ) : daysRemaining !== null && daysRemaining <= 7 ? (
            <div className="flex items-center gap-1 text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded">
              <AlertCircle className="h-3 w-3" />
              Urgent
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Source</p>
            <p className="font-medium text-gray-900 capitalize">{lead.lead_source}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900 capitalize">{lead.status}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium text-gray-900">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>
          {lead.expires_at && (
            <div>
              <p className="text-gray-500">Expires In</p>
              <p className={`font-medium ${getExpirationColor(daysRemaining)}`}>
                {daysRemaining !== null ? `${daysRemaining} days` : 'Unknown'}
              </p>
            </div>
          )}
        </div>

        {lead.gift_sent && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Gift Amount</span>
              <span className="font-semibold text-green-600">
                ${(lead.gift_amount || 0).toFixed(2)}
              </span>
            </div>
            {lead.gift_sent_at && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Sent On</span>
                <span className="text-gray-700">
                  {new Date(lead.gift_sent_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {lead.landing_page_url && (
          <a
            href={lead.landing_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View Landing Page
          </a>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring Leads Column */}
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900">Expiring Soon</h3>
              <span className="text-2xl font-bold text-amber-900">{expiringLeads.length}</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">Expires within 30 days</p>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {expiringLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No expiring leads</p>
              </div>
            ) : (
              expiringLeads.map(renderLeadCard)
            )}
          </div>
        </div>

        {/* Active Leads Column */}
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-blue-900">Active Leads</h3>
              <span className="text-2xl font-bold text-blue-900">
                {allLeads.filter(l => l.status === 'active' || l.status === 'new').length}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">Ready to convert</p>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {allLeads.filter(l => l.status === 'active' || l.status === 'new').length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No active leads</p>
              </div>
            ) : (
              allLeads.filter(l => l.status === 'active' || l.status === 'new').map(renderLeadCard)
            )}
          </div>
        </div>

        {/* Gifted Leads Column */}
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-green-900">Gifts Sent</h3>
              <span className="text-2xl font-bold text-green-900">{giftedLeads.length}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              ${giftedLeads.reduce((sum, l) => sum + (l.gift_amount || 0), 0).toFixed(2)} total
            </p>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {giftedLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No gifts sent yet</p>
              </div>
            ) : (
              giftedLeads.map(renderLeadCard)
            )}
          </div>
        </div>
      </div>

      {/* ALL LEADS TABLE - New Section Below */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">All Leads</h3>
              <p className="text-sm text-gray-200 mt-1">Complete stream of all leads from all sources</p>
            </div>
            <span className="text-3xl font-bold text-white">{allLeads.length}</span>
          </div>
        </div>

        {allLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-600">
              Leads will appear here when people enter your giveaways or sign up through your referral link
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Source</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Expires</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Gift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allLeads.map((lead) => {
                  const daysRemaining = getDaysRemaining(lead.expires_at);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{lead.full_name || 'No name'}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </p>
                        {lead.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {lead.lead_source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                          lead.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'new' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {daysRemaining !== null ? (
                          <span className={`text-sm font-medium ${getExpirationColor(daysRemaining)}`}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lead.gift_sent ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">${(lead.gift_amount || 0).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {allLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing all {allLeads.length} lead{allLeads.length !== 1 ? 's' : ''} • Sorted by newest first
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
