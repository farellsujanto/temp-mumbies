import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gift, Calendar, Users, Sparkles, CheckCircle, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

interface GiveawayData {
  id: string;
  title: string;
  description: string;
  ends_at: string;
  status: string;
  total_entries: number;
  nonprofits: {
    organization_name: string;
    logo_url: string;
  };
  giveaway_bundles: {
    name: string;
    description: string;
    retail_value: number;
    image_url: string;
  };
}

export default function GiveawayPage() {
  const { slug } = useParams();
  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchGiveaway();
  }, [slug]);

  const fetchGiveaway = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('partner_giveaways')
      .select(`
        id,
        title,
        description,
        ends_at,
        status,
        total_entries,
        nonprofits!partner_id (
          organization_name,
          logo_url
        ),
        giveaway_bundles!bundle_id (
          name,
          description,
          retail_value,
          image_url
        )
      `)
      .eq('landing_page_slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) {
      setError('Giveaway not found or has ended');
    } else {
      setGiveaway(data as any);
    }

    setLoading(false);
  };

  const submitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: submitError } = await supabase
      .from('giveaway_entries')
      .insert({
        giveaway_id: giveaway!.id,
        email,
        first_name: null,
        last_name: null,
        phone: null,
        zip_code: null
      });

    if (submitError) {
      if (submitError.code === '23505') {
        setError('You have already entered this giveaway!');
      } else {
        setError('Failed to submit entry. Please try again.');
      }
    } else {
      setSubmitted(true);
    }

    setSubmitting(false);
  };

  const getDaysRemaining = () => {
    if (!giveaway) return 0;
    const end = new Date(giveaway.ends_at);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading giveaway...</p>
        </div>
      </div>
    );
  }

  if (error && !giveaway) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Giveaway Not Found</h1>
          <p className="text-gray-600">
            This giveaway may have ended or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white border-2 border-green-300 rounded-lg p-8 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">You're Entered!</h1>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for entering the giveaway! We'll notify you by email if you win.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Gift className="h-6 w-6 text-purple-600" />
                  <h3 className="font-bold text-lg">Prize: {giveaway!.giveaway_bundles.name}</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  ${giveaway!.giveaway_bundles.retail_value} Value
                </p>
                <p className="text-sm text-gray-600">
                  Winner will be announced on {new Date(giveaway!.ends_at).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="mb-2"><strong>What's next?</strong></p>
                <p>
                  Share this giveaway with friends! The more people who enter, the more fun it is.
                  Check your email for giveaway updates and special offers from {giveaway!.nonprofits.organization_name}.
                </p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied! Share it with your friends.');
                  }}
                >
                  Share This Giveaway
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-lg p-8 md:p-12 text-white mb-8">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8" />
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold">
                    GIVEAWAY
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{giveaway!.title}</h1>
                <p className="text-xl mb-6">{giveaway!.description}</p>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-semibold">Time Left</span>
                    </div>
                    <p className="text-2xl font-bold">{getDaysRemaining()} Days</p>
                  </div>

                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-5 w-5" />
                      <span className="text-sm font-semibold">Entries</span>
                    </div>
                    <p className="text-2xl font-bold">{giveaway!.total_entries}</p>
                  </div>

                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="h-5 w-5" />
                      <span className="text-sm font-semibold">Prize Value</span>
                    </div>
                    <p className="text-2xl font-bold">${giveaway!.giveaway_bundles.retail_value}</p>
                  </div>
                </div>
              </div>

              {/* Sponsor Module - Right Side */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 lg:w-80 flex-shrink-0">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5" />
                  Sponsored By
                </h3>
                <div className="flex items-center gap-4">
                  {giveaway!.nonprofits.logo_url && (
                    <img
                      src={giveaway!.nonprofits.logo_url}
                      alt={giveaway!.nonprofits.organization_name}
                      className="w-16 h-16 rounded-lg object-cover bg-white"
                    />
                  )}
                  <div>
                    <p className="font-bold text-lg text-white">{giveaway!.nonprofits.organization_name}</p>
                    <p className="text-sm text-white text-opacity-90">Animal Rescue Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Prize Details */}
            <div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <img
                  src={giveaway!.giveaway_bundles.image_url}
                  alt={giveaway!.giveaway_bundles.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">
                    <Gift className="inline h-6 w-6 text-purple-600 mr-2" />
                    {giveaway!.giveaway_bundles.name}
                  </h2>
                  <p className="text-gray-700 mb-4">{giveaway!.giveaway_bundles.description}</p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-semibold mb-1">Total Retail Value</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ${giveaway!.giveaway_bundles.retail_value}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Entry Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
              <h2 className="text-2xl font-bold mb-4">Enter to Win!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Fill out the form below for your chance to win. It's free to enter!
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={submitEntry} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="mb-2 font-semibold">By entering:</p>
                    <ul className="space-y-1">
                      <li>• You agree to receive emails from {giveaway!.nonprofits.organization_name} and Mumbies</li>
                      <li>• One entry per person</li>
                      <li>• Winner will be contacted by email</li>
                      <li>• Must be 18+ to enter</li>
                    </ul>
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Enter Giveaway'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
