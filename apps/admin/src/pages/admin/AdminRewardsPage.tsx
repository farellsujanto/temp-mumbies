import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, Star, TrendingUp, Target, Sparkles, Calendar } from 'lucide-react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';

interface MilestoneTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  total_milestones: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  reward_type: string;
  reward_value: number;
  reward_description: string;
  requirement_type: string;
  requirement_value: number;
  requirement_description: string;
  status: string;
  category: string;
  display_section: string;
  milestone_track_id: string | null;
  milestone_order: number | null;
  is_featured: boolean;
  sort_order: number;
  active_start_date: string | null;
  active_end_date: string | null;
  featured_image_url: string | null;
  milestone_track?: MilestoneTrack;
}

type TabType = 'all' | 'featured' | 'milestone_tracks' | 'evergreen' | 'seasonal';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [milestoneTracks, setMilestoneTracks] = useState<MilestoneTrack[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: tracksData } = await supabase
      .from('milestone_tracks')
      .select('*')
      .order('display_order', { ascending: true });

    if (tracksData) {
      setMilestoneTracks(tracksData);
    }

    const { data: rewardsData } = await supabase
      .from('partner_rewards')
      .select(`
        *,
        milestone_track:milestone_tracks(*)
      `)
      .order('sort_order', { ascending: true });

    if (rewardsData) {
      setRewards(rewardsData);
    }

    setLoading(false);
  };

  const getFilteredRewards = () => {
    switch (activeTab) {
      case 'featured':
        return rewards.filter(r => r.is_featured);
      case 'milestone_tracks':
        return rewards.filter(r => r.category === 'milestone_track');
      case 'evergreen':
        return rewards.filter(r => r.category === 'evergreen');
      case 'seasonal':
        return rewards.filter(r => r.category === 'seasonal' || r.category === 'special_event');
      default:
        return rewards;
    }
  };

  const getRewardsByTrack = (trackId: string) => {
    return rewards
      .filter(r => r.milestone_track_id === trackId)
      .sort((a, b) => (a.milestone_order || 0) - (b.milestone_order || 0));
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All Rewards', icon: Trophy, count: rewards.length },
    { id: 'featured' as TabType, label: 'Featured', icon: Star, count: rewards.filter(r => r.is_featured).length },
    { id: 'milestone_tracks' as TabType, label: 'Milestone Tracks', icon: Target, count: rewards.filter(r => r.category === 'milestone_track').length },
    { id: 'evergreen' as TabType, label: 'Evergreen', icon: TrendingUp, count: rewards.filter(r => r.category === 'evergreen').length },
    { id: 'seasonal' as TabType, label: 'Seasonal & Events', icon: Calendar, count: rewards.filter(r => r.category === 'seasonal' || r.category === 'special_event').length }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-4">Loading rewards...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-8 w-8 text-purple-600" />
              Partner Rewards
            </h1>
            <p className="text-gray-600 mt-2">
              Organize rewards into tracks, featured promotions, and seasonal events
            </p>
          </div>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Reward
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'milestone_tracks' ? (
          <div className="space-y-8">
            {milestoneTracks.map((track) => {
              const trackRewards = getRewardsByTrack(track.id);

              return (
                <div key={track.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="p-6 text-white"
                    style={{ backgroundColor: track.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{track.icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold">{track.name}</h2>
                          <p className="text-white/90 mt-1">{track.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{trackRewards.length}</p>
                        <p className="text-sm text-white/80">Milestones</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {trackRewards.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>No milestones in this track yet</p>
                        <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
                          Add First Milestone
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {trackRewards.map((reward, index) => (
                          <div
                            key={reward.id}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
                              {index + 1}
                            </div>

                            {reward.featured_image_url && (
                              <img
                                src={reward.featured_image_url}
                                alt={reward.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{reward.title}</h3>
                                {reward.is_featured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Requirement: {reward.requirement_description}</span>
                                <span>•</span>
                                <span>Reward: {reward.reward_description}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                reward.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {reward.status}
                              </span>
                              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {milestoneTracks.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Milestone Tracks Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create progressive achievement tracks for partners to follow
                </p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                  Create First Track
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {getFilteredRewards().length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rewards in This Category</h3>
                <p className="text-gray-600">
                  {activeTab === 'featured' && 'Mark rewards as featured to highlight them'}
                  {activeTab === 'evergreen' && 'Create evergreen rewards that are always available'}
                  {activeTab === 'seasonal' && 'Add seasonal or time-limited reward campaigns'}
                </p>
              </div>
            ) : (
              getFilteredRewards().map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    {reward.featured_image_url && (
                      <img
                        src={reward.featured_image_url}
                        alt={reward.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{reward.title}</h3>
                            {reward.is_featured && (
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mt-2">{reward.description}</p>

                          <div className="flex items-center gap-6 mt-4 text-sm">
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <span className="ml-2 font-medium text-gray-900 capitalize">
                                {reward.category.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Section:</span>
                              <span className="ml-2 font-medium text-gray-900 capitalize">
                                {reward.display_section}
                              </span>
                            </div>
                            {reward.milestone_track && (
                              <div>
                                <span className="text-gray-500">Track:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {reward.milestone_track.icon} {reward.milestone_track.name} (Step {reward.milestone_order})
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs text-blue-600 font-medium mb-1">REQUIREMENT</p>
                              <p className="text-sm text-blue-900 font-semibold">{reward.requirement_description}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-xs text-green-600 font-medium mb-1">REWARD</p>
                              <p className="text-sm text-green-900 font-semibold">{reward.reward_description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            reward.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {reward.status}
                          </span>
                          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
