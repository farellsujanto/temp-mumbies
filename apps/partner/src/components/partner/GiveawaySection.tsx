import { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Calendar, ExternalLink, CheckCircle, TrendingUp, Award, Sparkles, Crown, DollarSign, Lock } from 'lucide-react';
import { supabase } from '@mumbies/shared';
import { Button } from '@mumbies/shared';
import { Tooltip } from '@mumbies/shared';

interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  total_value: number;
  featured_image_url: string;
  unlock_requirement_type: string;
  unlock_requirement_value: number;
  is_active: boolean;

  // Legacy fields
  retail_value?: number;
  image_url?: string;
  tier?: string;
  sales_threshold?: number;
}

interface PartnerGiveaway {
  id: string;
  title: string;
  description: string;
  landing_page_slug: string;
  starts_at: string;
  ends_at: string;
  status: string;
  total_entries: number;
  total_leads_generated: number;
  bundle_id: string;
  bundle: GiveawayBundle;
}

interface PartnerStats {
  mumbies_cash_balance: number;
  total_earnings: number;
  total_leads: number;
  total_referrals: number;
}

interface GiveawaySectionProps {
  partnerId: string;
  totalSales: number;
  organizationName: string;
}

export default function GiveawaySection({ partnerId, totalSales, organizationName }: GiveawaySectionProps) {
  const [bundles, setBundles] = useState<GiveawayBundle[]>([]);
  const [giveaways, setGiveaways] = useState<PartnerGiveaway[]>([]);
  const [partnerStats, setPartnerStats] = useState<PartnerStats>({
    mumbies_cash_balance: 0,
    total_earnings: 0,
    total_leads: 0,
    total_referrals: 0
  });
  const [loading, setLoading] = useState(true);
  const [creatingGiveaway, setCreatingGiveaway] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<GiveawayBundle | null>(null);
  const [giveawayTitle, setGiveawayTitle] = useState('');
  const [giveawayDescription, setGiveawayDescription] = useState('');
  const [giveawayDuration, setGiveawayDuration] = useState(30);

  useEffect(() => {
    fetchGiveawayData();
  }, [partnerId]);

  const fetchGiveawayData = async () => {
    setLoading(true);

    // Fetch partner stats
    const { data: partnerData } = await supabase
      .from('nonprofits')
      .select('mumbies_cash_balance, total_commissions_earned, total_sales')
      .eq('id', partnerId)
      .maybeSingle();

    if (partnerData) {
      setPartnerStats({
        mumbies_cash_balance: Number(partnerData.mumbies_cash_balance || 0),
        total_earnings: Number(partnerData.total_commissions_earned || 0),
        total_leads: 0,
        total_referrals: 0
      });
    }

    // Fetch bundles
    const { data: bundlesData } = await supabase
      .from('giveaway_bundles')
      .select('*')
      .eq('is_active', true)
      .order('unlock_requirement_value', { ascending: true });

    // Fetch giveaways
    const { data: giveawaysData, error: giveawaysError } = await supabase
      .from('partner_giveaways')
      .select(`
        *,
        bundle:giveaway_bundles!bundle_id(*)
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (giveawaysError) {
      console.error('Error fetching giveaways:', giveawaysError);
    }

    if (bundlesData) setBundles(bundlesData);
    if (giveawaysData) setGiveaways(giveawaysData as any);

    setLoading(false);
  };

  const createGiveaway = async () => {
    if (!selectedBundle) return;

    setCreatingGiveaway(true);

    try {
      const slug = `${(organizationName || 'partner').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + giveawayDuration);

      const { data, error } = await supabase
        .from('partner_giveaways')
        .insert({
          partner_id: partnerId,
          bundle_id: selectedBundle.id,
          title: giveawayTitle,
          description: giveawayDescription,
          landing_page_slug: slug,
          ends_at: endsAt.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating giveaway:', error);
        alert(`Failed to create giveaway: ${error.message}`);
      } else {
        alert('Giveaway created! Share your landing page to start collecting entries.');
        setSelectedBundle(null);
        setGiveawayTitle('');
        setGiveawayDescription('');
        await fetchGiveawayData();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }

    setCreatingGiveaway(false);
  };

  const canUnlockBundle = (bundle: GiveawayBundle) => {
    const reqType = bundle.unlock_requirement_type || 'mumbies_cash';
    const reqValue = bundle.unlock_requirement_value || 0;

    switch (reqType) {
      case 'none':
        return true;
      case 'mumbies_cash':
        return partnerStats.mumbies_cash_balance >= reqValue;
      case 'total_earnings':
        return partnerStats.total_earnings >= reqValue;
      case 'leads':
        return partnerStats.total_leads >= reqValue;
      case 'referrals':
        return partnerStats.total_referrals >= reqValue;
      default:
        // Legacy: check sales_threshold
        return bundle.sales_threshold ? totalSales >= bundle.sales_threshold : false;
    }
  };

  const canReuseBundle = (bundle: GiveawayBundle) => {
    // Check if partner has used this bundle before
    const partnerGiveawaysForBundle = giveaways.filter(g => g.bundle_id === bundle.id);

    if (partnerGiveawaysForBundle.length === 0) {
      // Never used before
      return true;
    }

    // If bundle doesn't allow reuse, hide it
    if (!bundle.allow_reuse) {
      return false;
    }

    // Check cooldown period
    if (bundle.cooldown_days > 0) {
      const lastGiveaway = partnerGiveawaysForBundle
        .filter(g => g.status === 'completed' || g.status === 'ended')
        .sort((a, b) => new Date(b.ends_at).getTime() - new Date(a.ends_at).getTime())[0];

      if (lastGiveaway) {
        const daysSinceEnd = Math.floor(
          (Date.now() - new Date(lastGiveaway.ends_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceEnd >= bundle.cooldown_days;
      }
    }

    return true;
  };

  const getUnlockProgress = (bundle: GiveawayBundle) => {
    const reqType = bundle.unlock_requirement_type || 'mumbies_cash';
    const reqValue = Number(bundle.unlock_requirement_value || bundle.sales_threshold || 0);

    if (reqValue === 0) return 0;

    switch (reqType) {
      case 'none':
        return 100;
      case 'mumbies_cash':
        return Math.min((partnerStats.mumbies_cash_balance / reqValue) * 100, 100);
      case 'total_earnings':
        return Math.min((partnerStats.total_earnings / reqValue) * 100, 100);
      case 'leads':
        return Math.min((partnerStats.total_leads / reqValue) * 100, 100);
      case 'referrals':
        return Math.min((partnerStats.total_referrals / reqValue) * 100, 100);
      default:
        const threshold = Number(bundle.sales_threshold || 0);
        return threshold > 0 ? Math.min((totalSales / threshold) * 100, 100) : 0;
    }
  };

  const getRemainingToUnlock = (bundle: GiveawayBundle) => {
    const reqType = bundle.unlock_requirement_type || 'mumbies_cash';
    const reqValue = Number(bundle.unlock_requirement_value || bundle.sales_threshold || 0);

    switch (reqType) {
      case 'none':
        return 'Unlocked';
      case 'mumbies_cash':
        return `$${Math.max(0, reqValue - partnerStats.mumbies_cash_balance)} more Mumbies Cash`;
      case 'total_earnings':
        return `$${Math.max(0, reqValue - partnerStats.total_earnings)} more in sales`;
      case 'leads':
        return `${Math.max(0, reqValue - partnerStats.total_leads)} more leads`;
      case 'referrals':
        return `${Math.max(0, reqValue - partnerStats.total_referrals)} more referrals`;
      default:
        const threshold = Number(bundle.sales_threshold || 0);
        return threshold > 0 ? `$${Math.max(0, threshold - totalSales)} more sales` : 'Unlocked';
    }
  };

  const getRequirementLabel = (bundle: GiveawayBundle) => {
    const reqType = bundle.unlock_requirement_type || 'mumbies_cash';
    const reqValue = Number(bundle.unlock_requirement_value || bundle.sales_threshold || 0);

    switch (reqType) {
      case 'none':
        return 'Always Available';
      case 'mumbies_cash':
        return `${reqValue || 0} Mumbies Cash`;
      case 'total_earnings':
        return `$${(reqValue || 0).toLocaleString()} sales`;
      case 'leads':
        return `${reqValue || 0} leads`;
      case 'referrals':
        return `${reqValue || 0} referrals`;
      default:
        const threshold = Number(bundle.sales_threshold || 0);
        return threshold > 0 ? `$${(threshold || 0).toLocaleString()} sales` : 'Available';
    }
  };

  const getTierColor = (tier: string | null | undefined) => {
    if (!tier) return 'from-green-400 to-green-600';
    const colors: Record<string, string> = {
      bronze: 'from-amber-700 to-yellow-600',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-pink-600'
    };
    return colors[tier] || 'from-green-400 to-green-600';
  };

  const getTierBadge = (tier: string | null | undefined) => {
    if (!tier) return 'bg-green-100 text-green-700';
    const badges: Record<string, string> = {
      bronze: 'bg-amber-100 text-amber-700',
      silver: 'bg-gray-100 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-700',
      platinum: 'bg-purple-100 text-purple-700'
    };
    return badges[tier] || 'bg-green-100 text-green-700';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading giveaways...</p>
      </div>
    );
  }

  const activeGiveaway = giveaways.find(g => g.status === 'active');
  const completedGiveaways = giveaways.filter(g => g.status !== 'active');

  const lifetimeLeads = giveaways.reduce((sum, g) => sum + (Number(g.total_leads_generated) || 0), 0);
  const lifetimeSales = lifetimeLeads * 50;
  const lifetimeCommissions = lifetimeSales * 0.05;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Giveaway Marketing</h2>
              <Tooltip
                iconClassName="text-white hover:text-amber-100"
                content={
                  <div>
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-blue-600" />
                      How Giveaways Work
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Achieve and unlock incredible free giveaways</strong></li>
                      <li>• <strong>Mumbies provides and ships the products</strong></li>
                      <li>• <strong>Share your landing page</strong> to collect entries and leads</li>
                      <li>• <strong>Track performance</strong> in real-time with entries and lead data</li>
                      <li>• <strong>Winner selected automatically</strong> when giveaway ends</li>
                    </ul>
                  </div>
                }
              />
            </div>
            <p className="text-sm text-amber-100">
              Run Mumbies-sponsored giveaways to grow your audience and generate qualified leads!
            </p>
          </div>
        </div>
      </div>

      {/* Partner Stats */}
      <div>
        <h3 className="text-lg font-bold mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 text-xs">Mumbies Cash</span>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xl font-bold">${Number(partnerStats.mumbies_cash_balance || 0).toFixed(0)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 text-xs">Total Earnings</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xl font-bold">${Number(partnerStats.total_earnings || 0).toFixed(0)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 text-xs">Giveaway Leads</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xl font-bold">{lifetimeLeads}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 text-xs">Commissions</span>
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-xl font-bold">${lifetimeCommissions.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Select Bundle + Active Giveaway */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Select Bundle - 2/3 */}
        <div className="lg:w-2/3">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-purple-600" />
            Achievable Giveaways
          </h3>

          {bundles.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No giveaway bundles available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {bundles
                .filter(bundle => canReuseBundle(bundle))
                .map((bundle) => {
                const unlocked = canUnlockBundle(bundle);
                const progress = getUnlockProgress(bundle);
                const imageUrl = bundle.featured_image_url || bundle.image_url || 'https://via.placeholder.com/300x200?text=Bundle';
                const value = Number(bundle.total_value || bundle.retail_value || 0);

                return (
                  <div
                    key={bundle.id}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      unlocked ? 'border-green-300 bg-green-50 shadow-lg' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="relative h-32">
                      <img
                        src={imageUrl}
                        alt={bundle.name}
                        className={`w-full h-full object-cover ${!unlocked && 'opacity-50 grayscale'}`}
                      />
                      {bundle.tier && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getTierBadge(bundle.tier)}`}>
                          {bundle.tier?.toUpperCase() || ''}
                        </div>
                      )}
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
                          <span className="text-sm font-bold text-purple-600">
                            ${value.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Requires</span>
                          <span className="font-semibold">
                            {getRequirementLabel(bundle)}
                          </span>
                        </div>
                      </div>

                      {!unlocked && (
                        <div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                            <div
                              className={`bg-gradient-to-r ${getTierColor(bundle.tier || 'gold')} h-1.5 rounded-full`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {getRemainingToUnlock(bundle)}
                          </p>
                        </div>
                      )}

                      {unlocked && !activeGiveaway && (
                        <Button
                          fullWidth
                          size="sm"
                          onClick={() => {
                            setSelectedBundle(bundle);
                            setGiveawayTitle(`Win a ${bundle.name}!`);
                            setGiveawayDescription(`Enter to win a ${bundle.name} ($${value} value) from ${organizationName}!`);
                          }}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Create Giveaway
                        </Button>
                      )}

                      {activeGiveaway && (
                        <Button fullWidth size="sm" disabled>
                          End Current First
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Giveaway - 1/3 */}
        <div className="lg:w-1/3">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Active Giveaway
          </h3>

          {activeGiveaway ? (
            <div className="border-4 border-amber-400 rounded-lg overflow-hidden bg-amber-50">
              <div className="h-40">
                <img
                  src={activeGiveaway.bundle?.featured_image_url || activeGiveaway.bundle?.image_url || 'https://via.placeholder.com/300x200'}
                  alt={activeGiveaway.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold">{activeGiveaway.title}</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span className="text-xs text-blue-600 font-semibold">Entries</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {activeGiveaway.total_entries}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">Leads</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {activeGiveaway.total_leads_generated}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Ends</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(activeGiveaway.ends_at).toLocaleDateString()}
                  </span>
                </div>

                <a
                  href={`/giveaway/${activeGiveaway.landing_page_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Landing Page
                </a>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <Crown className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">No Active Giveaway</p>
              <p className="text-sm text-gray-500">
                Unlock and create a giveaway to start generating leads!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Giveaway Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create Giveaway</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giveaway Title
                </label>
                <input
                  type="text"
                  value={giveawayTitle}
                  onChange={(e) => setGiveawayTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={giveawayDescription}
                  onChange={(e) => setGiveawayDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={giveawayDuration}
                  onChange={(e) => setGiveawayDuration(parseInt(e.target.value) || 30)}
                  min="1"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBundle(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createGiveaway}
                disabled={creatingGiveaway || !giveawayTitle.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
              >
                {creatingGiveaway ? 'Creating...' : 'Create Giveaway'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Giveaways */}
      {completedGiveaways.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Past Giveaways</h3>
          <div className="space-y-3">
            {completedGiveaways.map((giveaway) => (
              <div key={giveaway.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <img
                  src={giveaway.bundle?.featured_image_url || giveaway.bundle?.image_url || 'https://via.placeholder.com/100'}
                  alt={giveaway.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-bold">{giveaway.title}</h4>
                  <p className="text-sm text-gray-600">
                    {giveaway.total_entries} entries • {giveaway.total_leads_generated} leads
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  ENDED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
