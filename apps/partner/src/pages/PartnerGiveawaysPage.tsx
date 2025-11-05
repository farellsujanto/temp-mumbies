import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, supabase } from '@mumbies/shared';
import PartnerLayout from '../components/partner/PartnerLayout';
import { fetchGiveawayBundles, fetchPartnerGiveaways, GiveawayBundle, PartnerGiveaway } from '../lib/api';
import { AlertCircle, Gift, Users, Trophy, Calendar, ExternalLink, CheckCircle, TrendingUp, Award, Sparkles, Crown, DollarSign, Lock } from 'lucide-react';
import { Button } from '@mumbies/shared';
import { Tooltip } from '@mumbies/shared';

interface NonprofitData {
  id: string;
  organization_name: string;
  total_sales: number;
  mumbies_cash_balance: number;
}

export default function PartnerGiveawaysPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [bundles, setBundles] = useState<GiveawayBundle[]>([]);
  const [giveaways, setGiveaways] = useState<PartnerGiveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch nonprofit data
      const { data: nonprofitData, error: nonprofitError } = await supabase
        .from('nonprofits')
        .select('id, organization_name, total_sales, mumbies_cash_balance, status')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (nonprofitError) throw nonprofitError;

      if (!nonprofitData) {
        navigate('/login');
        return;
      }

      setNonprofit(nonprofitData);

      // Fetch bundles and giveaways using normalized API
      const [bundlesData, giveawaysData] = await Promise.all([
        fetchGiveawayBundles(),
        fetchPartnerGiveaways(nonprofitData.id)
      ]);

      setBundles(bundlesData);
      setGiveaways(giveawaysData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canUnlockBundle = (bundle: GiveawayBundle) => {
    if (!nonprofit) return false;

    const reqType = bundle.unlock_requirement_type;
    const reqValue = bundle.unlock_requirement_value;

    switch (reqType) {
      case 'none':
        return true;
      case 'mumbies_cash':
        return nonprofit.mumbies_cash_balance >= reqValue;
      case 'sales':
        return nonprofit.total_sales >= reqValue;
      default:
        return false;
    }
  };

  const getUnlockProgress = (bundle: GiveawayBundle) => {
    if (!nonprofit) return 0;

    const reqType = bundle.unlock_requirement_type;
    const reqValue = bundle.unlock_requirement_value;

    if (reqValue === 0) return 100;

    switch (reqType) {
      case 'mumbies_cash':
        return Math.min(100, (nonprofit.mumbies_cash_balance / reqValue) * 100);
      case 'sales':
        return Math.min(100, (nonprofit.total_sales / reqValue) * 100);
      default:
        return 0;
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
          <p className="text-gray-600 mt-1">Create and manage giveaways to generate leads</p>
        </div>

        {/* Available Bundles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Giveaway Bundles</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {bundles.map((bundle) => {
              const unlocked = canUnlockBundle(bundle);
              const progress = getUnlockProgress(bundle);
              const value = bundle.total_value;

              return (
                <div
                  key={bundle.id}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    unlocked ? 'border-green-300 bg-green-50 shadow-lg' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="relative h-32">
                    <img
                      src={bundle.featured_image_url}
                      alt={bundle.name}
                      className={`w-full h-full object-cover ${!unlocked && 'opacity-50 grayscale'}`}
                    />
                    {unlocked ? (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        UNLOCKED
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        LOCKED
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold mb-2">{bundle.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{bundle.description}</p>

                    <div className="bg-white border border-gray-200 rounded-lg p-2 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">Value</span>
                        <span className="text-sm font-bold text-green-600">${value.toFixed(2)}</span>
                      </div>
                    </div>

                    {!unlocked && (
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {bundle.unlock_requirement_type === 'mumbies_cash' && (
                            <>Need ${bundle.unlock_requirement_value} Mumbies Cash (You have: ${nonprofit.mumbies_cash_balance})</>
                          )}
                          {bundle.unlock_requirement_type === 'sales' && (
                            <>Need ${bundle.unlock_requirement_value} in sales (You have: ${nonprofit.total_sales})</>
                          )}
                        </p>
                      </div>
                    )}

                    {unlocked && (
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          // TODO: Navigate to create giveaway page with bundle pre-selected
                          alert(`Creating giveaway for: ${bundle.name}`);
                        }}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Create Giveaway
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Giveaways */}
        {giveaways.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Active Giveaways</h2>

            <div className="space-y-4">
              {giveaways.map((giveaway) => (
                <div key={giveaway.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{giveaway.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{giveaway.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {giveaway.total_entries} entries
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {giveaway.total_leads_generated} leads
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      giveaway.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {giveaway.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}
