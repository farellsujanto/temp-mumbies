import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Gift, AlertCircle, Mail, CheckCircle, Target, Calendar, Copy, Send, Users } from 'lucide-react';
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
  const [referralEmail, setReferralEmail] = useState('');
  const [sendingReferral, setSendingReferral] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    fetchReferralData();
    loadPartnerData();
  }, [partnerId]);

  const loadPartnerData = async () => {
    const { data: nonprofit } = await supabase
      .from('nonprofits')
      .select('referral_link, referral_code, slug')
      .eq('id', partnerId)
      .maybeSingle();

    if (nonprofit) {
      setReferralLink(nonprofit.referral_link || `${window.location.origin}/partner/apply?ref=${nonprofit.referral_code}`);
      setReferralCode(nonprofit.referral_code || '');
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralLink);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const sendReferralEmail = async () => {
    if (!referralEmail) return;

    setSendingReferral(true);
    try {
      const { error } = await supabase
        .from('nonprofit_referrals')
        .insert({
          referrer_nonprofit_id: partnerId,
          referred_email: referralEmail,
          referral_code: referralCode,
          status: 'pending'
        });

      if (error) throw error;

      alert('Referral invite sent successfully!');
      setReferralEmail('');
      fetchReferralData();
    } catch (error) {
      alert('Error sending referral invite. Please try again.');
    }
    setSendingReferral(false);
  };

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
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 rounded-lg p-6 text-white relative overflow-hidden">
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
              <p className="text-sm text-teal-100">
                Help your referrals succeed and earn $1,000 when they reach $500 in sales within 6 months!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Tools */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Referral Link & Email */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Share Your Referral Link</h3>

          {/* Referral Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button onClick={copyReferralCode}>
                {referralCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Send Email Invite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send Email Invite</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={referralEmail}
                onChange={(e) => setReferralEmail(e.target.value)}
                placeholder="nonprofit@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <Button
                onClick={sendReferralEmail}
                disabled={sendingReferral || !referralEmail}
              >
                <Send className="h-4 w-4 mr-2" />
                {sendingReferral ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: How it Works */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-600" />
            How Partner Referrals Work
          </h4>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Share your referral link with other nonprofits</li>
            <li>2. They apply using your link and get approved</li>
            <li>3. When they reach $500 in sales within 6 months, you earn $1,000</li>
            <li>4. Earnings are automatically added to your balance</li>
          </ol>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Pending</span>
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-3xl font-bold">{pendingPartners.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Approved Unqualified</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{activeNoSales.length + activeNeedsHelp.length}</p>
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
            <span className="text-gray-600 text-sm">Total Earnings</span>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold">${qualified.reduce((sum, p) => sum + p.bounty_amount, 0).toFixed(0)}</p>
        </div>
      </div>

      {/* Three Column Layout: Pending | Approved Unqualified | Qualified */}
      <div className="grid lg:grid-cols-3 gap-6">
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

        {/* Approved Unqualified Partners */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Approved Unqualified
          </h3>
          {(activeNoSales.length + activeNeedsHelp.length) === 0 ? (
            <p className="text-gray-500 text-xs">No approved unqualified partners</p>
          ) : (
            <div className="space-y-2">
              {[...activeNoSales, ...activeNeedsHelp].map((partner) => (
                <div key={partner.id} className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-blue-900">
                        {partner.referred_nonprofit?.organization_name || partner.referred_email}
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        ${partner.total_sales.toFixed(2)} / $500
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium whitespace-nowrap ml-2">
                      {partner.days_until_deadline} days left
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(partner.total_sales / 500) * 100}%` }}
                    ></div>
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
