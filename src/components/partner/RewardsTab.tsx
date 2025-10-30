import { useState, useEffect } from 'react';
import { Trophy, Gift, Zap, Target, Calendar, TrendingUp, Award, Star, Flame, Crown, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface Reward {
  id: string;
  title: string;
  description: string;
  reward_type: string;
  status: string;
  reward_value: number;
  reward_description: string;
  requirement_type: string;
  requirement_value: number;
  requirement_description: string;
  starts_at: string | null;
  ends_at: string | null;
  max_winners: number | null;
  current_participants: number;
  featured: boolean;
  badge_color: string | null;
}

interface RewardProgress {
  id: string;
  reward_id: string;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  status: string;
  completed_at: string | null;
  claimed_at: string | null;
  current_rank: number | null;
}

interface RewardsTabProps {
  partnerId: string;
  organizationName: string;
  totalSales: number;
}

export default function RewardsTab({ partnerId, organizationName, totalSales }: RewardsTabProps) {
  const [activeRewards, setActiveRewards] = useState<Reward[]>([]);
  const [upcomingRewards, setUpcomingRewards] = useState<Reward[]>([]);
  const [myProgress, setMyProgress] = useState<Record<string, RewardProgress>>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewardsData();
  }, [partnerId]);

  const fetchRewardsData = async () => {
    setLoading(true);

    // Fetch active rewards
    const { data: active } = await supabase
      .from('partner_rewards')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true });

    // Fetch upcoming rewards
    const { data: upcoming } = await supabase
      .from('partner_rewards')
      .select('*')
      .eq('status', 'upcoming')
      .order('starts_at', { ascending: true })
      .limit(3);

    // Fetch partner's progress
    const { data: progress } = await supabase
      .from('partner_reward_progress')
      .select('*')
      .eq('partner_id', partnerId);

    // Fetch completed count
    const { count } = await supabase
      .from('partner_reward_progress')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partnerId)
      .eq('status', 'claimed');

    if (active) setActiveRewards(active);
    if (upcoming) setUpcomingRewards(upcoming);
    if (progress) {
      const progressMap: Record<string, RewardProgress> = {};
      progress.forEach(p => {
        progressMap[p.reward_id] = p;
      });
      setMyProgress(progressMap);
    }
    setCompletedCount(count || 0);

    setLoading(false);
  };

  const claimReward = async (rewardId: string, progressId: string) => {
    await supabase
      .from('partner_reward_redemptions')
      .insert({
        partner_id: partnerId,
        reward_id: rewardId,
        progress_id: progressId,
        reward_type: 'pending',
        status: 'pending'
      });

    await supabase
      .from('partner_reward_progress')
      .update({ status: 'claimed', claimed_at: new Date().toISOString() })
      .eq('id', progressId);

    alert('Reward claimed! We\'ll process your reward within 24 hours.');
    fetchRewardsData();
  };

  const getRewardIcon = (type: string, color?: string) => {
    const iconClass = `h-6 w-6 ${color ? `text-${color}-600` : 'text-gray-600'}`;
    switch (type) {
      case 'competition': return <Trophy className={iconClass} />;
      case 'bonus_commission': return <TrendingUp className={iconClass} />;
      case 'free_product': return <Gift className={iconClass} />;
      case 'gift_card': return <Award className={iconClass} />;
      case 'milestone': return <Target className={iconClass} />;
      default: return <Star className={iconClass} />;
    }
  };

  const getBadgeColor = (color?: string | null) => {
    const colorMap: Record<string, string> = {
      red: 'from-red-500 to-rose-600',
      blue: 'from-blue-500 to-cyan-600',
      green: 'from-green-500 to-emerald-600',
      amber: 'from-amber-500 to-orange-600',
      purple: 'from-purple-500 to-violet-600',
      black: 'from-gray-800 to-black',
    };
    return colorMap[color || ''] || 'from-gray-500 to-gray-600';
  };

  const getTimeRemaining = (endsAt: string | null) => {
    if (!endsAt) return null;
    const end = new Date(endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Expired';
    if (days === 0) return 'Ends today!';
    if (days === 1) return '1 day left';
    if (days <= 7) return `${days} days left`;
    return `${days} days left`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading rewards...</p>
      </div>
    );
  }

  const salesChallenges = activeRewards.filter(r =>
    ['sales_amount', 'sales_count', 'customer_count', 'time_period'].includes(r.requirement_type) && !r.featured
  );
  const leadChallenges = activeRewards.filter(r =>
    ['lead_count', 'referral_count'].includes(r.requirement_type) && !r.featured
  );
  const featuredSalesChallenges = activeRewards.filter(r =>
    ['sales_amount', 'sales_count', 'customer_count', 'time_period'].includes(r.requirement_type) && r.featured
  );
  const featuredLeadChallenges = activeRewards.filter(r =>
    ['lead_count', 'referral_count'].includes(r.requirement_type) && r.featured
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Trophy className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Partner Challenges & Rewards</h2>
              <p className="text-green-100">Complete challenges to earn bonuses and exclusive perks</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Challenges</span>
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">{activeRewards.length}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completed</span>
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">{completedCount}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">In Progress</span>
                <Flame className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">
                {Object.values(myProgress).filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout: Sales, Leads, Coming Soon */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Challenges */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold">Sales Challenges</h3>
          </div>

          <div className="space-y-4">
            {[...featuredSalesChallenges, ...salesChallenges].length > 0 ? [...featuredSalesChallenges, ...salesChallenges].map((reward) => {
              const progress = myProgress[reward.id];
              const progressPercent = progress ? progress.progress_percentage : 0;
              const isCompleted = progress?.status === 'completed';
              const isClaimed = progress?.status === 'claimed';

              return (
                <div
                  key={reward.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`bg-gradient-to-br ${getBadgeColor(reward.badge_color)} rounded-lg p-2 text-white`}>
                      {getRewardIcon(reward.reward_type, 'white')}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{reward.title}</h4>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

                  <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                    <p className="text-xs font-bold text-green-700">{reward.reward_description}</p>
                  </div>

                  {progress && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {progress.current_value} / {progress.target_value}
                      </p>
                    </div>
                  )}

                  {isClaimed ? (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Claimed
                    </span>
                  ) : isCompleted ? (
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => claimReward(reward.id, progress.id)}
                    >
                      Claim
                    </Button>
                  ) : (
                    <p className="text-xs text-center text-gray-500 font-medium">
                      {reward.requirement_description}
                    </p>
                  )}
                </div>
              );
            }) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No active sales challenges</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Challenges */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold">Lead Challenges</h3>
          </div>

          <div className="space-y-4">
            {[...featuredLeadChallenges, ...leadChallenges].length > 0 ? [...featuredLeadChallenges, ...leadChallenges].map((reward) => {
              const progress = myProgress[reward.id];
              const progressPercent = progress ? progress.progress_percentage : 0;
              const isCompleted = progress?.status === 'completed';
              const isClaimed = progress?.status === 'claimed';

              return (
                <div
                  key={reward.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`bg-gradient-to-br ${getBadgeColor(reward.badge_color)} rounded-lg p-2 text-white`}>
                      {getRewardIcon(reward.reward_type, 'white')}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{reward.title}</h4>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                    <p className="text-xs font-bold text-blue-700">{reward.reward_description}</p>
                  </div>

                  {progress && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {progress.current_value} / {progress.target_value}
                      </p>
                    </div>
                  )}

                  {isClaimed ? (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Claimed
                    </span>
                  ) : isCompleted ? (
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => claimReward(reward.id, progress.id)}
                    >
                      Claim
                    </Button>
                  ) : (
                    <p className="text-xs text-center text-gray-500 font-medium">
                      {reward.requirement_description}
                    </p>
                  )}
                </div>
              );
            }) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No active lead challenges</p>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold">Coming Soon</h3>
          </div>

          <div className="space-y-4">
            {upcomingRewards.length > 0 ? upcomingRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                    COMING SOON
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 mb-2 text-sm">{reward.title}</h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

                <div className="bg-white border border-purple-200 rounded p-2">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Reward</p>
                  <p className="text-xs font-bold text-purple-700">{reward.reward_description}</p>
                </div>

                {reward.starts_at && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-purple-700">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      Starts {new Date(reward.starts_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">No upcoming challenges</p>
                <p className="text-xs text-gray-500">Check back soon for new opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How Rewards Work */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-blue-600" />
          How Partner Rewards Work
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Earning Rewards</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Complete challenges to unlock rewards automatically</li>
              <li>• Track your progress in real-time</li>
              <li>• Compete with other partners for exclusive prizes</li>
              <li>• Stack multiple rewards simultaneously</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Reward Types</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Cash Bonuses:</strong> Direct payments to your account</li>
              <li>• <strong>Free Products:</strong> Complimentary premium items</li>
              <li>• <strong>Gift Cards:</strong> Mumbies shopping credit</li>
              <li>• <strong>Commission Boosts:</strong> Temporary or permanent increases</li>
              <li>• <strong>Giveaway Bundles:</strong> Sponsored prizes to build your audience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
