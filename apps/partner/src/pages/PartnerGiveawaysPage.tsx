import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, supabase } from '@mumbies/shared';
import PartnerLayout from '../components/partner/PartnerLayout';
import GiveawaySection from '../components/partner/GiveawaySection';
import GiveawayEntriesTab from '../components/partner/GiveawayEntriesTab';
import { AlertCircle } from 'lucide-react';

interface NonprofitData {
  id: string;
  organization_name: string;
  total_sales: number;
}

export default function PartnerGiveawaysPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'entries'>('active');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNonprofitData();
  }, [user, navigate]);

  const loadNonprofitData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('nonprofits')
        .select('id, organization_name, total_sales, status')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        navigate('/login');
        return;
      }

      setNonprofit(data);
    } catch (err: any) {
      console.error('Error loading nonprofit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (!nonprofit) {
    return (
      <PartnerLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">No partner account found</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giveaways</h1>
          <p className="text-gray-600 mt-1">Manage giveaways and track entries</p>
        </div>

        {/* Sub-navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSubTab === 'active'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Giveaways
          </button>
          <button
            onClick={() => setActiveSubTab('entries')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSubTab === 'entries'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Entries
          </button>
        </div>

        {activeSubTab === 'active' && (
          <GiveawaySection
            partnerId={nonprofit.id}
            totalSales={nonprofit.total_sales}
            organizationName={nonprofit.organization_name}
          />
        )}

        {activeSubTab === 'entries' && <GiveawayEntriesTab partnerId={nonprofit.id} />}
      </div>
    </PartnerLayout>
  );
}
