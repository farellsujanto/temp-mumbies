import { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Calendar, ExternalLink, CheckCircle, Clock, AlertCircle, Crown, Sparkles } from 'lucide-react';
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

    // Fetch available bundles
    const { data: bundlesData } = await supabase
      .from('giveaway_bundles')
      .select('*')
      .order('sales_threshold', { ascending: true });

    // Fetch partner's giveaways
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

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-lg p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Gift className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8" />
            <h2 className="text-3xl font-bold">Giveaway Marketing</h2>
          </div>
          <p className="text-lg mb-4">
            Run Mumbies-sponsored giveaways to grow your audience and generate qualified leads!
          </p>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-bold mb-2">How It Works:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Hit sales milestones to unlock giveaway bundles</li>
              <li>• Create your custom giveaway with auto-generated landing page</li>
              <li>• Share the link on social media to collect entries</li>
              <li>• Every entry becomes a qualified lead in your dashboard</li>
              <li>• Winner is auto-selected when giveaway ends</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Available Bundles */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-purple-600" />
          Available Giveaway Bundles
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {bundles.slice(0, 6).map((bundle) => {
            const unlocked = canUnlockBundle(bundle);
            const progress = Math.min((totalSales / bundle.sales_threshold) * 100, 100);

            return (
              <div
                key={bundle.id}
                className={`border-2 rounded-lg overflow-hidden ${
                  unlocked ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="relative h-48">
                  <img
                    src={bundle.image_url}
                    alt={bundle.name}
                    className={`w-full h-full object-cover ${!unlocked && 'opacity-50 grayscale'}`}
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getTierBadge(bundle.tier)}`}>
                    {bundle.tier.toUpperCase()}
                  </div>
                  {unlocked && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      UNLOCKED
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-lg mb-2">{bundle.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>

                  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Retail Value</span>
                      <span className="text-lg font-bold text-purple-600">
                        ${bundle.retail_value.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Required Sales</span>
                      <span className="font-semibold">
                        ${bundle.sales_threshold.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!unlocked && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-gray-700">
                          ${totalSales.toFixed(0)} / ${bundle.sales_threshold.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getTierColor(bundle.tier)} h-2 rounded-full`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        ${(bundle.sales_threshold - totalSales).toFixed(0)} more to unlock
                      </p>
                    </div>
                  )}

                  {unlocked && (
                    <Button
                      fullWidth
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Giveaways */}
      {giveaways.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Your Giveaways
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {giveaways.map((giveaway) => (
              <div key={giveaway.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{giveaway.title}</h4>
                    <p className="text-sm text-gray-600">{giveaway.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    giveaway.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {giveaway.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-blue-600 font-semibold">Entries</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {giveaway.total_entries}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">Leads</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {giveaway.total_leads_generated}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      Ends: {new Date(giveaway.ends_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                    <a
                      href={`/giveaway/${giveaway.landing_page_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium truncate"
                    >
                      mumbies.com/giveaway/{giveaway.landing_page_slug}
                    </a>
                  </div>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/giveaway/${giveaway.landing_page_slug}`);
                    alert('Link copied! Share it on social media.');
                  }}
                >
                  Copy Link to Share
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Giveaway Modal */}
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
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What happens next:</strong> Your giveaway landing page will be created instantly.
                Share the link on TikTok, Instagram, Facebook, or email. Each person who enters becomes
                a qualified lead in your dashboard!
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setSelectedBundle(null)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={createGiveaway}
                disabled={creatingGiveaway || !giveawayTitle || !giveawayDescription}
              >
                {creatingGiveaway ? 'Creating...' : 'Launch Giveaway'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
