import { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Calendar, ExternalLink, CheckCircle, TrendingUp, Award, Sparkles, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  retail_value: number;
  tier: string;
  sales_threshold: number;
  image_url: string;
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
  bundle: GiveawayBundle;
}

interface GiveawaySectionProps {
  partnerId: string;
  totalSales: number;
  organizationName: string;
}

export default function GiveawaySection({ partnerId, totalSales, organizationName }: GiveawaySectionProps) {
  const [bundles, setBundles] = useState<GiveawayBundle[]>([]);
  const [giveaways, setGiveaways] = useState<PartnerGiveaway[]>([]);
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

    const { data: bundlesData } = await supabase
      .from('giveaway_bundles')
      .select('*')
      .order('sales_threshold', { ascending: true });

    const { data: giveawaysData } = await supabase
      .from('partner_giveaways')
      .select(`
        *,
        bundle:bundle_id (*)
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (bundlesData) setBundles(bundlesData);
    if (giveawaysData) setGiveaways(giveawaysData as any);

    setLoading(false);
  };

  const createGiveaway = async () => {
    if (!selectedBundle) return;

    setCreatingGiveaway(true);

    const slug = `${organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + giveawayDuration);

    const { error } = await supabase
      .from('partner_giveaways')
      .insert({
        partner_id: partnerId,
        bundle_id: selectedBundle.id,
        title: giveawayTitle,
        description: giveawayDescription,
        landing_page_slug: slug,
        ends_at: endsAt.toISOString(),
        status: 'active'
      });

    if (!error) {
      alert('Giveaway created! Share your landing page to start collecting entries.');
      setSelectedBundle(null);
      setGiveawayTitle('');
      setGiveawayDescription('');
      fetchGiveawayData();
    }

    setCreatingGiveaway(false);
  };

  const canUnlockBundle = (bundle: GiveawayBundle) => {
    return totalSales >= Number(bundle.sales_threshold);
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: 'from-amber-700 to-yellow-600',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-pink-600'
    };
    return colors[tier] || 'from-gray-400 to-gray-600';
  };

  const getTierBadge = (tier: string) => {
    const badges: Record<string, string> = {
      bronze: 'bg-amber-100 text-amber-700',
      silver: 'bg-gray-100 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-700',
      platinum: 'bg-purple-100 text-purple-700'
    };
    return badges[tier] || 'bg-gray-100 text-gray-700';
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

  const lifetimeLeads = giveaways.reduce((sum, g) => sum + g.total_leads_generated, 0);
  const lifetimeSales = lifetimeLeads * 50; // Estimate: $50 average per lead
  const lifetimeCommissions = lifetimeSales * 0.05; // 5% commission rate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Gift className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Giveaway Marketing</h2>
              <p className="text-sm text-amber-100">
                Run Mumbies-sponsored giveaways to grow your audience and generate qualified leads!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions + Lifetime Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-600" />
            How Giveaways Work
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Only one active giveaway</strong> at a time to maximize impact</li>
            <li>• <strong>Select a bundle</strong> from available options based on your sales</li>
            <li>• <strong>Share your landing page</strong> to collect entries and leads</li>
            <li>• <strong>Track performance</strong> in real-time with entries and lead data</li>
            <li>• <strong>Winner selected automatically</strong> when giveaway ends</li>
          </ul>
        </div>

        <div className="lg:w-1/2">
          <h3 className="text-2xl font-bold mb-4">Lifetime Giveaway Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Leads</span>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{lifetimeLeads}</p>
              <p className="text-xs text-gray-600 mt-1">Generated</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Sales</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">${lifetimeSales.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Revenue</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Commissions</span>
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">${lifetimeCommissions.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Earned</p>
            </div>
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

          <div className="grid md:grid-cols-2 gap-4">
            {bundles.map((bundle) => {
              const unlocked = canUnlockBundle(bundle);
              const progress = Math.min((totalSales / bundle.sales_threshold) * 100, 100);

              return (
                <div
                  key={bundle.id}
                  className={`border-2 rounded-lg overflow-hidden ${
                    unlocked ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="relative h-32">
                    <img
                      src={bundle.image_url}
                      alt={bundle.name}
                      className={`w-full h-full object-cover ${!unlocked && 'opacity-50 grayscale'}`}
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getTierBadge(bundle.tier)}`}>
                      {bundle.tier.toUpperCase()}
                    </div>
                    {unlocked && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        UNLOCKED
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold mb-2">{bundle.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{bundle.description}</p>

                    <div className="bg-white border border-gray-200 rounded-lg p-2 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">Value</span>
                        <span className="text-sm font-bold text-purple-600">
                          ${bundle.retail_value.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Requires</span>
                        <span className="font-semibold">
                          ${bundle.sales_threshold.toLocaleString()} sales
                        </span>
                      </div>
                    </div>

                    {!unlocked && (
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div
                            className={`bg-gradient-to-r ${getTierColor(bundle.tier)} h-1.5 rounded-full`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          ${(bundle.sales_threshold - totalSales).toFixed(0)} more to unlock
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
                          setGiveawayDescription(`Enter to win a ${bundle.name} (${bundle.retail_value} value) from ${organizationName}!`);
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
                  src={activeGiveaway.bundle.image_url}
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
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">Conversions</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {activeGiveaway.total_leads_generated}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3 w-3 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      Ends: {new Date(activeGiveaway.ends_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3 text-purple-600" />
                    <a
                      href={`/giveaway/${activeGiveaway.landing_page_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium truncate"
                    >
                      View Landing Page
                    </a>
                  </div>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/giveaway/${activeGiveaway.landing_page_slug}`);
                    alert('Link copied! Share it on social media.');
                  }}
                >
                  Copy Link to Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">
                No active giveaway. Select a bundle to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Giveaways */}
      {completedGiveaways.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Completed Giveaways</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {completedGiveaways.map((giveaway) => (
              <div key={giveaway.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-bold mb-2">{giveaway.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Entries:</span>
                    <span className="font-bold ml-1">{giveaway.total_entries}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Leads:</span>
                    <span className="font-bold ml-1">{giveaway.total_leads_generated}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ended: {new Date(giveaway.ends_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Your Giveaway</h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-1">{selectedBundle.name}</h3>
                  <p className="text-sm text-purple-700">${selectedBundle.retail_value} retail value</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giveaway Title
                </label>
                <input
                  type="text"
                  value={giveawayTitle}
                  onChange={(e) => setGiveawayTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Win a Starter Pack!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={giveawayDescription}
                  onChange={(e) => setGiveawayDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Enter to win..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <select
                  value={giveawayDuration}
                  onChange={(e) => setGiveawayDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={21}>21 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={createGiveaway}
                disabled={creatingGiveaway || !giveawayTitle}
                fullWidth
              >
                {creatingGiveaway ? 'Creating...' : 'Create Giveaway'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedBundle(null)}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
