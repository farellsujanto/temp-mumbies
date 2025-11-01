import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  Gift,
  Trophy,
  TrendingUp,
  Target,
  Sparkles,
  Package,
  Heart,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Link as LinkIcon
} from 'lucide-react';
import Button from '../components/Button';

export default function PartnerProgramPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: '5% Lifetime Commissions',
      description: 'Earn ongoing revenue from every customer you refer, for life'
    },
    {
      icon: Users,
      title: '$1,000 Partner Referrals',
      description: 'Refer other nonprofits and earn huge bonuses when they qualify'
    },
    {
      icon: Gift,
      title: 'Free Giveaways',
      description: 'Run Mumbies-sponsored giveaways to grow your audience'
    },
    {
      icon: Trophy,
      title: 'Rewards & Challenges',
      description: 'Complete goals to unlock cash bonuses, products, and perks'
    },
    {
      icon: Target,
      title: 'Lead Incentives',
      description: 'Send gift credits to boost conversions from your leads'
    },
    {
      icon: LinkIcon,
      title: 'SiteStripe Tool',
      description: 'Generate affiliate links instantly while browsing any page'
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Performance Dashboard',
      description: 'Track sales, commissions, leads, and referrals in real-time with beautiful analytics'
    },
    {
      icon: Heart,
      title: 'Product Curation',
      description: 'Create wishlists, recommend products, and build custom bundles for supporters'
    },
    {
      icon: Sparkles,
      title: 'Marketing Tools',
      description: 'Access custom referral links, social media assets, and promotional materials'
    },
    {
      icon: Package,
      title: 'Lead Management',
      description: 'View, track, and incentivize leads with our comprehensive CRM system'
    }
  ];

  const stats = [
    { value: '5%', label: 'Commission Rate' },
    { value: '$1,000', label: 'Referral Bonus' },
    { value: 'Unlimited', label: 'Earning Potential' },
    { value: 'Free', label: 'To Join' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Partner with Mumbies & Transform Lives
            </h1>
            <p className="text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Earn sustainable income while supporting rescued animals. Join our partner program designed specifically for animal rescues and nonprofits.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/partner/apply">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/partner/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600">
                  Partner Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How the Program Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and designed to maximize your impact and earnings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Apply & Get Approved</h3>
              <p className="text-gray-600">
                Submit your nonprofit information. We review applications within 24-48 hours and provide full onboarding support.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Share Your Link</h3>
              <p className="text-gray-600">
                Get your unique referral link and start sharing with your community through email, social media, and events.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Earn & Grow</h3>
              <p className="text-gray-600">
                Track your earnings in real-time, complete challenges for bonuses, and scale your impact with multiple revenue streams.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to earn and powerful tools to maximize your results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partner Center Features */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Partner Dashboard</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              A complete command center designed to help you track, manage, and grow your partnership
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                  <Icon className="h-8 w-8 text-white mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See Your Dashboard in Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track every metric that matters with intuitive, real-time analytics
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
                <div className="text-sm text-green-600 font-semibold mb-2">Total Commissions Earned</div>
                <div className="text-3xl font-bold text-green-900">$2,486.50</div>
                <div className="text-sm text-green-700 mt-2">+$248 this month</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">Active Customers</div>
                <div className="text-3xl font-bold text-blue-900">142</div>
                <div className="text-sm text-blue-700 mt-2">18 new leads</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">Referral Bonuses</div>
                <div className="text-3xl font-bold text-purple-900">$3,000</div>
                <div className="text-sm text-purple-700 mt-2">3 qualified partners</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Sales Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold">$4,960</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Month</span>
                    <span className="font-semibold">$3,840</span>
                  </div>
                  <div className="bg-green-100 text-green-800 rounded px-2 py-1 text-sm font-medium inline-block">
                    +29% Growth
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Lead Pipeline
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Leads</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Converted</span>
                    <span className="font-semibold">8 (44%)</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm font-medium inline-block">
                    High Conversion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Partner Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Partner with Mumbies?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Mission-Aligned Partnership</h4>
                    <p className="text-gray-600">We're pet lovers supporting pet lovers. Every sale helps rescue animals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Premium Products</h4>
                    <p className="text-gray-600">High-quality, natural products that customers love and reorder regularly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Dedicated Support</h4>
                    <p className="text-gray-600">Our partner success team is here to help you succeed every step of the way.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">No Risk, All Reward</h4>
                    <p className="text-gray-600">Free to join, no quotas, no obligations. Just share and earn.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold mb-6">Partner Success Story</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <p className="text-gray-700 italic mb-4">
                  "The Mumbies partner program has been a game-changer for our rescue. We've earned over $15,000 in the first year, which directly funds our medical care and adoption programs. The dashboard makes everything so easy to track!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                    PR
                  </div>
                  <div>
                    <div className="font-bold">Paws & Reflect Rescue</div>
                    <div className="text-sm text-gray-600">Portland, OR</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">$15K+</div>
                  <div className="text-xs text-gray-600">Total Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">287</div>
                  <div className="text-xs text-gray-600">Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$1,250</div>
                  <div className="text-xs text-gray-600">Avg/Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds of animal rescues and nonprofits earning sustainable income with Mumbies
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/partner/apply">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Apply for Partnership
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/partner/login">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600">
                Existing Partner? Login
              </Button>
            </Link>
          </div>
          <p className="text-sm text-green-100 mt-6">
            Questions? Email us at partners@mumbies.com
          </p>
        </div>
      </div>
    </div>
  );
}
