import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Gift, AlertCircle, Mail, CheckCircle, Target, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface ReferralPartner {
  id: string;
  referred_email: string;
  referral_code: string;
  status: string;
  signup_date: string | null;
  qualification_date: string | null;
  total_sales: number;
  bounty_amount: number;
  created_at: string;
  referred_nonprofit?: {
    organization_name: string;
    contact_name: string | null;
    total_sales: number;
  };
  days_until_deadline?: number;
  deadline?: string;
  sales_needed?: number;
}

interface ReferralOpportunitiesTabProps {
  partnerId: string;
  organizationName: string;
}

export default function ReferralOpportunitiesTab({ partnerId, organizationName }: ReferralOpportunitiesTabProps) {
  const [pendingPartners, setPendingPartners] = useState<ReferralPartner[]>([]);
  const [activeNoSales, setActiveNoSales] = useState<ReferralPartner[]>([]);
  const [activeNeedsHelp, setActiveNeedsHelp] = useState<ReferralPartner[]>([]);
  const [qualified, setQualified] = useState<ReferralPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, [partnerId]);

  const fetchReferralData = async () => {
    setLoading(true);

    const { data: referrals, error } = await supabase
      .from('nonprofit_referrals')
      .select(`
        id,
        referred_email,
        referral_code,
        status,
        signup_date,
        qualification_date,
        total_sales,
        bounty_amount,
        created_at,
        referred_nonprofit_id
      `)
      .eq('referrer_nonprofit_id', partnerId)
      .order('created_at', { ascending: false });

    if (!error && referrals) {
      const pending: ReferralPartner[] = [];
      const activeNoSalesArr: ReferralPartner[] = [];
      const activeNeedsHelpArr: ReferralPartner[] = [];
      const qualifiedArr: ReferralPartner[] = [];

      for (const referral of referrals) {
        let processedReferral: ReferralPartner = {
          ...referral,
          signup_date: referral.signup_date || referral.created_at,
        };

        if (referral.referred_nonprofit_id) {
          const { data: nonprofitData } = await supabase
            .from('nonprofits')
            .select('organization_name, contact_name, total_sales')
            .eq('id', referral.referred_nonprofit_id)
            .maybeSingle();

          if (nonprofitData) {
            processedReferral.referred_nonprofit = nonprofitData;
          }
        }

        const signupDate = new Date(referral.signup_date || referral.created_at);
        const deadline = new Date(signupDate.getTime() + 180 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        processedReferral.days_until_deadline = daysUntilDeadline;
        processedReferral.deadline = deadline.toISOString();
        processedReferral.sales_needed = Math.max(0, 500 - referral.total_sales);

        if (referral.status === 'pending') {
          pending.push(processedReferral);
        } else if (referral.status === 'active') {
          if (referral.total_sales === 0) {
            activeNoSalesArr.push(processedReferral);
          } else if (referral.total_sales < 500) {
            activeNeedsHelpArr.push(processedReferral);
          }
        } else if (referral.status === 'qualified' || referral.status === 'paid') {
          qualifiedArr.push(processedReferral);
        }
      }

      setPendingPartners(pending);
      setActiveNoSales(activeNoSalesArr);
      setActiveNeedsHelp(activeNeedsHelpArr);
      setQualified(qualifiedArr);
    }

    setLoading(false);
  };

  const sendEncouragementEmail = async (partner: ReferralPartner) => {
    alert(`Feature coming soon: Send personalized encouragement email to ${partner.referred_email}`);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 90) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading referral opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Gift className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Partner Referral Program</h2>
              <p className="text-sm text-orange-100">
                Help your referrals succeed and earn $1,000 when they reach $500 in sales within 6 months!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">No Sales Yet</span>
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{activeNoSales.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Close to Goal</span>
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold">{activeNeedsHelp.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Qualified</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{qualified.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Pending</span>
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-3xl font-bold">{pendingPartners.length}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: No Sales Yet */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Partners With No Sales Yet
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            These partners are approved but haven't made their first sale. Reach out to help them get started!
          </p>

          {activeNoSales.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">All your active referrals have made sales!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeNoSales.map((partner) => (
                <div
                  key={partner.id}
                  className={`border rounded-lg p-4 ${getUrgencyColor(partner.days_until_deadline || 0)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {partner.referred_nonprofit?.organization_name || partner.referred_email}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {partner.referred_email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-semibold whitespace-nowrap ml-2">
                      {partner.days_until_deadline} days left
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-current border-opacity-20 mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold">Sales Progress</span>
                      <span className="text-xs font-bold">$0 / $500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-current h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs mt-1.5 opacity-70">
                      Needs $500 in sales by {new Date(partner.deadline!).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendEncouragementEmail(partner)}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Encouragement
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Need Help Reaching Goal */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Partners Close to Goal
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            These partners have made sales but need to reach $500 before the deadline. Help them cross the finish line!
          </p>

          {activeNeedsHelp.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No partners currently between $1-$499 in sales</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeNeedsHelp.map((partner) => (
                <div
                  key={partner.id}
                  className={`border rounded-lg p-4 ${getUrgencyColor(partner.days_until_deadline || 0)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {partner.referred_nonprofit?.organization_name || partner.referred_email}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {partner.referred_email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-semibold whitespace-nowrap ml-2">
                      {partner.days_until_deadline} days left
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-current border-opacity-20 mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold">Sales Progress</span>
                      <span className="text-xs font-bold">
                        ${partner.total_sales.toFixed(2)} / $500
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-current h-1.5 rounded-full"
                        style={{ width: `${(partner.total_sales / 500) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1.5 opacity-70">
                      ${partner.sales_needed?.toFixed(2)} more needed by {new Date(partner.deadline!).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendEncouragementEmail(partner)}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Support Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Partners */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Pending Approval
          </h3>
          {pendingPartners.length === 0 ? (
            <p className="text-gray-500 text-xs">No pending referrals</p>
          ) : (
            <div className="space-y-2">
              {pendingPartners.map((partner) => (
                <div key={partner.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{partner.referred_email}</p>
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(partner.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Qualified Partners */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Qualified Partners
          </h3>
          {qualified.length === 0 ? (
            <p className="text-gray-500 text-xs">No qualified referrals yet</p>
          ) : (
            <div className="space-y-2">
              {qualified.map((partner) => (
                <div key={partner.id} className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-emerald-900">
                        {partner.referred_nonprofit?.organization_name || partner.referred_email}
                      </p>
                      <p className="text-xs text-emerald-700">
                        Qualified: {partner.qualification_date ? new Date(partner.qualification_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-600">
                        ${partner.bounty_amount.toFixed(2)}
                      </p>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                        {partner.status === 'paid' ? 'Paid' : 'Qualified'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
