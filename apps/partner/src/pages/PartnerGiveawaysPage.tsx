import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, LogOut, Calendar, Users as UsersIcon } from 'lucide-react';
import { useAuth, supabase } from '@mumbies/shared';

interface Giveaway {
  id: string;
  title: string;
  status: string;
  entries_count: number;
  created_at: string;
}

export default function PartnerGiveawaysPage() {
  const { userProfile, partnerProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.nonprofit_id) return;

    const fetchGiveaways = async () => {
      try {
        const { data, error } = await supabase
          .from('partner_giveaways')
          .select('id, title, status, entries_count, created_at')
          .eq('partner_id', userProfile.nonprofit_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching giveaways:', error);
          return;
        }

        console.log('Giveaways fetched:', data);
        setGiveaways(data || []);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiveaways();
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
              className="px-4 py-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Leads
            </button>
            <button
              onClick={() => navigate('/giveaways')}
              className="px-4 py-4 text-blue-600 border-b-2 border-blue-600 font-medium"
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
              <h2 className="text-lg font-semibold text-gray-900">Your Giveaways</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: {giveaways.length} giveaways
              </p>
            </div>
            <Gift className="h-6 w-6 text-purple-600" />
          </div>

          {giveaways.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No giveaways yet</h3>
              <p className="text-gray-600">
                Contact admin to set up your first giveaway
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {giveaways.map((giveaway) => (
                <div key={giveaway.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 mb-2">
                        {giveaway.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span>{giveaway.entries_count || 0} entries</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(giveaway.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        giveaway.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : giveaway.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {giveaway.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
