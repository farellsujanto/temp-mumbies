import { useEffect, useState } from 'react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import { UserPlus, Search, Filter, Mail, Phone, Gift, Calendar, ExternalLink, TrendingUp } from 'lucide-react';

interface Lead {
  id: string;
  partner_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  lead_source: string;
  landing_page_url: string | null;
  status: string;
  gift_sent: boolean;
  gift_amount: number | null;
  gift_sent_at: string | null;
  created_at: string;
  converted_at: string | null;
  lead_value: number | null;
  expires_at: string | null;
  partner?: {
    organization_name: string;
  };
}

type LeadFilter = 'all' | 'new' | 'contacted' | 'gift_sent' | 'converted';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<LeadFilter>('all');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
    fetchPartners();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery, filter, selectedPartner]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('id, organization_name')
        .eq('status', 'active')
        .order('organization_name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_leads')
        .select(`
          id,
          partner_id,
          email,
          full_name,
          phone,
          lead_source,
          landing_page_url,
          status,
          gift_sent,
          gift_amount,
          gift_sent_at,
          created_at,
          converted_at,
          lead_value,
          expires_at,
          partner:nonprofits!partner_leads_partner_id_fkey(
            organization_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(lead => ({
        ...lead,
        partner: Array.isArray(lead.partner) ? lead.partner[0] : lead.partner
      })) || [];

      setLeads(formattedData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(lead => lead.status === filter);
    }

    // Filter by partner
    if (selectedPartner !== 'all') {
      filtered = filtered.filter(lead => lead.partner_id === selectedPartner);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.email.toLowerCase().includes(query) ||
          lead.full_name?.toLowerCase().includes(query) ||
          lead.partner?.organization_name?.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  };

  const getStatusBadge = (lead: Lead) => {
    if (lead.converted_at) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Converted</span>;
    }
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
    contacted: leads.filter(l => l.status === 'contacted').length,
    giftSent: leads.filter(l => l.gift_sent).length,
    converted: leads.filter(l => l.converted_at).length,
    totalValue: leads.reduce((sum, l) => sum + (l.lead_value || 0), 0),
    totalGifts: leads.reduce((sum, l) => sum + (l.gift_amount || 0), 0),
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-1">Track and manage partner-generated leads</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">New Leads</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{stats.new}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Gifts Sent</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{stats.giftSent}</p>
                <p className="text-xs text-purple-600 mt-1">${stats.totalGifts.toFixed(2)} total</p>
              </div>
              <Gift className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Converted</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{stats.converted}</p>
                <p className="text-xs text-green-600 mt-1">${stats.totalValue.toFixed(2)} value</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, or partner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Partners</option>
                {partners.map(partner => (
                  <option key={partner.id} value={partner.id}>
                    {partner.organization_name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('new')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter === 'new' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setFilter('gift_sent')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter === 'gift_sent' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Gift Sent
                </button>
                <button
                  onClick={() => setFilter('converted')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter === 'converted' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  Converted
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Lead</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Partner</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Source</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Expires</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Gift</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
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
                        <p className="text-sm font-medium text-gray-900">
                          {lead.partner?.organization_name || 'Unknown'}
                        </p>
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
                        {lead.expires_at ? (
                          <div>
                            <p className={`text-sm font-medium ${
                              new Date(lead.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? 'text-red-700'
                                : new Date(lead.expires_at) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? 'text-amber-700'
                                : 'text-gray-700'
                            }`}>
                              {new Date(lead.expires_at).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${
                              new Date(lead.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? 'text-red-600'
                                : new Date(lead.expires_at) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? 'text-amber-600'
                                : 'text-gray-500'
                            }`}>
                              {Math.ceil((new Date(lead.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lead.gift_sent ? (
                          <div>
                            <p className="text-sm font-medium text-green-700">
                              ${lead.gift_amount?.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lead.gift_sent_at && new Date(lead.gift_sent_at).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
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
      </div>
    </AdminLayout>
  );
}
