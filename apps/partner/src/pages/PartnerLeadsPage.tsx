import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Mail, Calendar } from 'lucide-react';
import { useAuth, supabase } from '@mumbies/shared';

interface Lead {
  id: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
}

export default function PartnerLeadsPage() {
  const { userProfile, partnerProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.nonprofit_id) return;

    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('partner_leads')
          .select('id, email, status, source, created_at')
          .eq('partner_id', userProfile.nonprofit_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching leads:', error);
          return;
        }

        console.log('Leads fetched:', data);
        setLeads(data || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [userProfile?.nonprofit_id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {partnerProfile?.organization_name || 'Partner Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{userProfile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="px-4 py-4 text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Leads
            </button>
            <button
              onClick={() => navigate('/giveaways')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Giveaways
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Leads</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: {leads.length} leads
              </p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>

          {leads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-600">
                Leads from your giveaways will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'converted'
                              ? 'bg-green-100 text-green-800'
                              : lead.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lead.source || 'Giveaway'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
