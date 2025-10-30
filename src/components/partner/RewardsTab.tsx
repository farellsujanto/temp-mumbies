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
  const [completedRewards, setCompletedRewards] = useState<RewardProgress[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

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

    // Fetch completed rewards
    const { data: completed } = await supabase
      .from('partner_reward_progress')
      .select(`
        *,
        reward:reward_id (
          title,
          reward_description,
          badge_color,
          reward_type
        )
      `)
      .eq('partner_id', partnerId)
      .eq('status', 'claimed')
      .order('claimed_at', { ascending: false });

    if (active) setActiveRewards(active);
    if (upcoming) setUpcomingRewards(upcoming);
    if (progress) {
      const progressMap: Record<string, RewardProgress> = {};
      progress.forEach(p => {
        progressMap[p.reward_id] = p;
      });
      setMyProgress(progressMap);
    }
    if (completed) {
      setCompletedRewards(completed);
      setCompletedCount(completed.length);
    }

    setLoading(false);
  };

  const activateChallenge = async (rewardId: string) => {
    setActivating(rewardId);

    const { error } = await supabase
      .from('partner_reward_progress')
      .insert({
        partner_id: partnerId,
        reward_id: rewardId,
        status: 'in_progress',
        current_value: 0,
        target_value: activeRewards.find(r => r.id === rewardId)?.requirement_value || 0,
        progress_percentage: 0
      });

    if (!error) {
      await fetchRewardsData();
    }

    setActivating(null);
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

  const activeChallenges = activeRewards.filter(r => myProgress[r.id]?.status === 'in_progress');
  const availableSalesChallenges = activeRewards.filter(r =>
    ['sales_amount', 'sales_count', 'customer_count', 'time_period'].includes(r.requirement_type) && !myProgress[r.id]
  );
  const availableLeadChallenges = activeRewards.filter(r =>
    ['lead_count', 'referral_count'].includes(r.requirement_type) && !myProgress[r.id]
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

      {/* Active Challenges - Full Width */}
      {activeChallenges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-orange-600" />
            <h3 className="text-2xl font-bold">Your Active Challenges</h3>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
              {activeChallenges.length} IN PROGRESS
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {activeChallenges.map((reward) => {
              const progress = myProgress[reward.id];
              const progressPercent = progress ? progress.progress_percentage : 0;
              const isCompleted = progress?.status === 'completed';
              const isClaimed = progress?.status === 'claimed';
              const timeLeft = getTimeRemaining(reward.ends_at);

              return (
                <div
                  key={reward.id}
                  className="bg-white border-2 border-orange-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`bg-gradient-to-br ${getBadgeColor(reward.badge_color)} rounded-lg p-2 text-white`}>
                      {getRewardIcon(reward.reward_type, 'white')}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{reward.title}</h4>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                    <p className="text-xs font-bold text-amber-700">{reward.reward_description}</p>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-green-600">
                        {progress.current_value} / {progress.target_value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{progressPercent}% complete</p>
                  </div>

                  {timeLeft && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 mb-2">
                      <Clock className="h-3 w-3" />
                      <span className="font-semibold">{timeLeft}</span>
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
                      Claim Reward
                    </Button>
                  ) : (
                    <p className="text-xs text-center text-gray-500 font-medium">Keep going!</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Three Column Layout: Sales, Leads, Coming Soon */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Challenges */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold">Sales Challenges</h3>
          </div>

          <div className="space-y-4">
            {availableSalesChallenges.length > 0 ? availableSalesChallenges.map((reward) => {
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

                  <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                    <p className="text-xs text-gray-600">
                      <strong>Goal:</strong> {reward.requirement_description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => activateChallenge(reward.id)}
                    disabled={activating === reward.id}
                  >
                    {activating === reward.id ? 'Activating...' : 'Start Challenge'}
                  </Button>
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
            {availableLeadChallenges.length > 0 ? availableLeadChallenges.map((reward) => {
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

                  <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                    <p className="text-xs text-gray-600">
                      <strong>Goal:</strong> {reward.requirement_description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => activateChallenge(reward.id)}
                    disabled={activating === reward.id}
                  >
                    {activating === reward.id ? 'Activating...' : 'Start Challenge'}
                  </Button>
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

      {/* Completed Challenges */}
      {completedRewards.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-amber-600" />
            <h3 className="text-2xl font-bold">Completed Challenges</h3>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
              {completedCount} CLAIMED
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Challenge</th>
                    <th className="text-left px-4 py-3 font-semibold">Reward</th>
                    <th className="text-left px-4 py-3 font-semibold">Completed</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRewards.map((progress: any) => (
                    <tr key={progress.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`bg-gradient-to-br ${getBadgeColor(progress.reward?.badge_color)} rounded p-1.5 text-white`}>
                            {getRewardIcon(progress.reward?.reward_type, 'white')}
                          </div>
                          <span className="font-medium">{progress.reward?.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-green-600">
                          {progress.reward?.reward_description}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {progress.completed_at ? new Date(progress.completed_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Claimed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
              <li>• Click "Start Challenge" to activate tracking</li>
              <li>• Track your progress in real-time</li>
              <li>• Complete challenges to unlock rewards automatically</li>
              <li>• Claim rewards when you reach your goal</li>
              <li>• Stack multiple challenges simultaneously</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Reward Types</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Cash Bonuses:</strong> Direct payments to your account</li>
              <li>• <strong>Free Products:</strong> Complimentary premium items</li>
              <li>• <strong>Gift Cards:</strong> Mumbies shopping credit</li>
              <li>• <strong>Commission Boosts:</strong> Temporary or permanent increases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
