import { useState, useEffect } from 'react';
import { Trophy, Gift, Zap, Target, Calendar, TrendingUp, Award, Star, Flame, Crown, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';
import Tooltip from '../Tooltip';

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
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

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

  const openActivateModal = (reward: Reward) => {
    setSelectedReward(reward);
    setShowActivateModal(true);
  };

  const confirmActivateChallenge = async () => {
    if (!selectedReward) return;

    setActivating(selectedReward.id);

    const { error } = await supabase
      .from('partner_reward_progress')
      .insert({
        partner_id: partnerId,
        reward_id: selectedReward.id,
        status: 'in_progress',
        current_value: 0,
        target_value: selectedReward.requirement_value,
        progress_percentage: 0
      });

    if (!error) {
      await fetchRewardsData();
    }

    setActivating(null);
    setShowActivateModal(false);
    setSelectedReward(null);
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

  const getRewardIcon = (type: string, colorClass?: string) => {
    const iconClass = `h-5 w-5 ${colorClass || 'text-gray-600'}`;
    switch (type) {
      case 'competition': return <Trophy className={iconClass} />;
      case 'bonus_commission': return <TrendingUp className={iconClass} />;
      case 'free_product': return <Gift className={iconClass} />;
      case 'gift_card': return <Award className={iconClass} />;
      case 'milestone': return <Target className={iconClass} />;
      default: return <Star className={iconClass} />;
    }
  };

  const getIconColor = (color?: string | null) => {
    const colorMap: Record<string, string> = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      amber: 'text-amber-600',
      purple: 'text-purple-600',
      black: 'text-gray-800',
    };
    return colorMap[color || ''] || 'text-gray-600';
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

  const getChallengeImage = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('black friday')) {
      return 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else if (titleLower.includes('holiday') || titleLower.includes('christmas')) {
      return 'https://images.pexels.com/photos/749353/pexels-photo-749353.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else if (titleLower.includes('summer')) {
      return 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else if (titleLower.includes('lead') || titleLower.includes('referral')) {
      return 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else if (titleLower.includes('milestone') || titleLower.includes('sales')) {
      return 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return 'https://images.pexels.com/photos/2072183/pexels-photo-2072183.jpeg?auto=compress&cs=tinysrgb&w=400';
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
      {/* Info Section */}
      {/* Header with Tooltip */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Partner Challenges & Rewards</h2>
            <Tooltip
              content={
                <div>
                  <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    How Rewards Work
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Start challenges</strong> to activate automatic progress tracking</li>
                    <li>• <strong>Complete goals</strong> to unlock cash bonuses, products, and perks</li>
                    <li>• <strong>Stack multiple challenges</strong> simultaneously for faster rewards</li>
                    <li>• <strong>Claim instantly</strong> when you reach 100% completion</li>
                  </ul>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Stats Grid - Full Width */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Available</span>
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{activeRewards.length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">In Progress</span>
              <Flame className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold">
              {Object.values(myProgress).filter(p => p.status === 'in_progress').length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completed</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{completedCount}</p>
          </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Conv. Increase</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{completedCount > 0 ? `+${(completedCount * 8).toFixed(0)}%` : '0%'}</p>
        </div>
      </div>

      {/* Active Challenges - Full Width */}
      {activeChallenges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-orange-600" />
            <h3 className="text-2xl font-bold">Available Challenges</h3>
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
                  className="bg-white border-2 border-orange-300 rounded-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={getChallengeImage(reward.title)}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 flex items-center gap-2">
                      {getRewardIcon(reward.reward_type, 'text-white h-5 w-5')}
                      <h4 className="font-bold text-white leading-tight">{reward.title}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-600 mb-3">{reward.description}</p>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                      <p className="text-xs font-semibold text-amber-800">{reward.reward_description}</p>
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Three Column Layout: Sales, Leads, Coming Soon */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Challenges */}
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Sales Challenges
          </h3>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: '800px' }}>
            <div className="space-y-4">
            {availableSalesChallenges.length > 0 ? availableSalesChallenges.map((reward) => {
              return (
                <div
                  key={reward.id}
                  className="bg-white border-2 border-green-200 rounded-lg overflow-hidden hover:border-green-400 transition-colors"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={getChallengeImage(reward.title)}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 flex items-center gap-2">
                      {getRewardIcon(reward.reward_type, 'text-white h-5 w-5')}
                      <h4 className="font-bold text-white leading-tight">{reward.title}</h4>
                    </div>
                  </div>
                  <div className="p-4">

                    <p className="text-xs text-gray-600 mb-3">{reward.description}</p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                      <p className="text-xs font-semibold text-green-800">{reward.reward_description}</p>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">
                      <strong>Goal:</strong> {reward.requirement_description}
                    </p>

                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => openActivateModal(reward)}
                    >
                      Start Challenge
                    </Button>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No available sales challenges</p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Lead Challenges */}
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Lead Challenges
          </h3>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: '800px' }}>
            <div className="space-y-4">
            {availableLeadChallenges.length > 0 ? availableLeadChallenges.map((reward) => {
              return (
                <div
                  key={reward.id}
                  className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={getChallengeImage(reward.title)}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 flex items-center gap-2">
                      {getRewardIcon(reward.reward_type, 'text-white h-5 w-5')}
                      <h4 className="font-bold text-white leading-tight">{reward.title}</h4>
                    </div>
                  </div>
                  <div className="p-4">

                    <p className="text-xs text-gray-600 mb-3">{reward.description}</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                      <p className="text-xs font-semibold text-blue-800">{reward.reward_description}</p>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">
                      <strong>Goal:</strong> {reward.requirement_description}
                    </p>

                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => openActivateModal(reward)}
                    >
                      Start Challenge
                    </Button>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No available lead challenges</p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            Coming Soon
          </h3>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: '800px' }}>
            <div className="space-y-4">
            {upcomingRewards.length > 0 ? upcomingRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  {getRewardIcon(reward.reward_type, getIconColor(reward.badge_color))}
                  <h4 className="font-bold text-gray-900 leading-tight">{reward.title}</h4>
                </div>
                <p className="text-xs text-gray-600 mb-3">{reward.description}</p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
                  <p className="text-xs font-semibold text-purple-800">{reward.reward_description}</p>
                </div>

                {reward.starts_at && (
                  <div className="flex items-center gap-2 text-xs text-purple-700">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      Starts {new Date(reward.starts_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">No upcoming challenges</p>
                <p className="text-xs text-gray-500">Check back soon for new opportunities</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Activity Stream */}
      {(activeChallenges.length > 0 || completedRewards.length > 0) && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Flame className="h-6 w-6 text-blue-600" />
            Your Challenge Activity
          </h3>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {/* Active Challenges */}
                {activeChallenges.map((challenge) => {
                  const progress = myProgress[challenge.reward_id];
                  return (
                    <div key={challenge.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {getRewardIcon(challenge.reward?.reward_type, getIconColor(challenge.reward?.badge_color))}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{challenge.reward?.title}</h4>
                            <p className="text-sm text-gray-600">{challenge.reward?.reward_description}</p>
                            {progress && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progress: {progress.progress_percentage.toFixed(0)}%</span>
                                  <span>{progress.current_value} / {progress.target_value}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min(progress.progress_percentage, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold ml-4">
                          IN PROGRESS
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Completed Challenges */}
                {completedRewards.slice(0, 5).map((progress: any) => (
                  <div key={progress.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getRewardIcon(progress.reward?.reward_type, getIconColor(progress.reward?.badge_color))}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{progress.reward?.title}</h4>
                          <p className="text-sm text-gray-600">{progress.reward?.reward_description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed {new Date(progress.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold ml-4 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        COMPLETED
                      </span>
                    </div>
                  </div>
                ))}

                {(activeChallenges.length === 0 && completedRewards.length === 0) && (
                  <div className="p-8 text-center">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No challenge activity yet</p>
                    <p className="text-sm text-gray-500 mt-2">Start a challenge to track your progress here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                          {getRewardIcon(progress.reward?.reward_type, getIconColor(progress.reward?.badge_color))}
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


      {/* Activate Challenge Modal */}
      {showActivateModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              {getRewardIcon(selectedReward.reward_type, getIconColor(selectedReward.badge_color))}
              <h3 className="text-xl font-bold text-gray-900">{selectedReward.title}</h3>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">Challenge Reward:</p>
              <p className="text-lg font-bold text-amber-700">{selectedReward.reward_description}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Your Goal:</p>
              <p className="text-sm text-gray-900">{selectedReward.requirement_description}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">How It Works:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your progress will be tracked automatically</li>
                <li>• View real-time updates in "Active Challenges"</li>
                <li>• Claim your reward when you reach 100%</li>
                <li>• You can activate multiple challenges at once</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowActivateModal(false);
                  setSelectedReward(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmActivateChallenge}
                disabled={activating === selectedReward.id}
              >
                {activating === selectedReward.id ? 'Activating...' : 'Start Tracking'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
