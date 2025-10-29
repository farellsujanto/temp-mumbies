import { useEffect, useState } from 'react';
import { Heart, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ImpactTab() {
  const { userProfile } = useAuth();
  const [attributedRescue, setAttributedRescue] = useState<any>(null);

  useEffect(() => {
    if (userProfile?.attributed_rescue_id) {
      loadAttributedRescue();
    }
  }, [userProfile]);

  const loadAttributedRescue = async () => {
    if (!userProfile?.attributed_rescue_id) return;

    const { data } = await supabase
      .from('nonprofits')
      .select('organization_name, slug, logo_url')
      .eq('id', userProfile.attributed_rescue_id)
      .maybeSingle();

    if (data) setAttributedRescue(data);
  };

  // Calculate impact metrics
  // Mumbies donates 10% of proceeds to rescue
  // Average cost to save a dog is $600
  const totalDonated = (userProfile?.total_rescue_donations || 0) + (userProfile?.total_general_donations || 0);
  const avgCostPerDog = 600;
  const dogsSaved = Math.floor(totalDonated / avgCostPerDog);
  const progressToNextDog = ((totalDonated % avgCostPerDog) / avgCostPerDog) * 100;

  // Predictive insights based on spending patterns
  const totalSpent = userProfile?.total_spent || 0;
  const avgMonthlySpend = totalSpent / Math.max(1, getMonthsSinceMember());
  const projectedAnnualSpend = avgMonthlySpend * 12;
  const projectedAnnualDonation = projectedAnnualSpend * 0.10;
  const projectedDogsThisYear = projectedAnnualDonation / avgCostPerDog;

  function getMonthsSinceMember(): number {
    if (!userProfile?.member_since) return 1;
    const memberDate = new Date(userProfile.member_since);
    const now = new Date();
    const months = (now.getFullYear() - memberDate.getFullYear()) * 12 + (now.getMonth() - memberDate.getMonth());
    return Math.max(1, months);
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Your Rescue Impact</h2>
        <p className="text-gray-600 text-lg">
          Every purchase you make helps save dogs in need. Here's your real impact.
        </p>
      </div>

      {/* Dogs Saved Counter */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
          <Heart className="h-10 w-10 text-white fill-current" />
        </div>
        <div className="mb-4">
          <div className="text-7xl font-black text-green-600 mb-2">
            {dogsSaved}
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {dogsSaved === 1 ? 'Dog Saved' : 'Dogs Saved'}
          </p>
          <p className="text-gray-600 mt-2">
            Through your purchases at Mumbies
          </p>
        </div>

        {/* Progress to next dog */}
        {dogsSaved >= 0 && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progress to next dog</span>
              <span>{progressToNextDog.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-white rounded-full overflow-hidden border border-green-200">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${progressToNextDog}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${(avgCostPerDog - (totalDonated % avgCostPerDog)).toFixed(2)} more in donations to save another dog
            </p>
          </div>
        )}
      </div>

      {/* Donation Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <DollarSign className="h-8 w-8 text-gray-400 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${totalDonated.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">Total Donations</p>
          <p className="text-xs text-gray-500 mt-2">
            10% of all your purchases
          </p>
        </div>

        {attributedRescue && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Heart className="h-8 w-8 text-green-600 mb-3" />
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${(userProfile?.total_rescue_donations || 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">To Your Rescue</p>
            <p className="text-xs text-gray-500 mt-2">
              {attributedRescue.organization_name}
            </p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Heart className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ${(userProfile?.total_general_donations || 0).toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">Community Impact</p>
          <p className="text-xs text-gray-500 mt-2">
            Distributed to all partner rescues
          </p>
        </div>
      </div>

      {/* Predictive Insights */}
      {totalSpent > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h3 className="text-2xl font-bold">Your Impact Projection</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4">
                Based on your shopping patterns, here's your projected impact for this year:
              </p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {projectedDogsThisYear.toFixed(1)}
                    </span>
                    <span className="text-gray-600 ml-2">dogs saved this year</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${projectedAnnualDonation.toFixed(2)}
                    </span>
                    <span className="text-gray-600 ml-2">in projected donations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>10% of every purchase goes to rescue dogs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>It costs an average of $600 to save one dog (shelter care, medical, food)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Your ongoing support helps more dogs find forever homes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Attributed Rescue Section */}
      {attributedRescue && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Your Attributed Rescue</h3>
          <div className="flex items-start gap-4">
            {attributedRescue.logo_url && (
              <img
                src={attributedRescue.logo_url}
                alt={attributedRescue.organization_name}
                className="w-20 h-20 object-contain"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2">{attributedRescue.organization_name}</h4>
              <p className="text-gray-600 mb-4">
                5% of all your purchases go directly to this rescue for life!
              </p>
              <button
                onClick={() => window.location.href = `/rescues/${attributedRescue.slug}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View Rescue Profile →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Get Started */}
      {totalSpent === 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Ready to Make Your First Impact?</h3>
          <p className="text-lg mb-6 opacity-90">
            Start shopping and automatically donate 10% to rescue dogs with every purchase
          </p>
          <button
            onClick={() => window.location.href = '/shop'}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
}
