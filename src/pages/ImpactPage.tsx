import { Heart, DollarSign, Home, AlertCircle, TrendingDown, Users } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function ImpactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Every Chew<br />Saves Lives
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 leading-relaxed">
            When you choose Mumbies, you're not just buying a dog chew.<br />
            You're funding second chances for dogs in shelters across America.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/shop')} size="lg">
              Shop With Purpose
            </Button>
            <Button
              onClick={() => navigate('/rescues')}
              variant="secondary"
              size="lg"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30"
            >
              Our Rescue Partners
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Crisis We're Fighting
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Behind every statistic is a dog that deserves love, care, and a place to call home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-5xl font-bold text-slate-900 mb-3">390,000</div>
              <div className="text-lg font-semibold text-slate-700 mb-2">Dogs Euthanized Annually</div>
              <p className="text-slate-600 leading-relaxed">
                Healthy, adoptable dogs lose their lives in U.S. shelters every year—primarily due to overcrowding and lack of funding.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Home className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-5xl font-bold text-slate-900 mb-3">2.8M</div>
              <div className="text-lg font-semibold text-slate-700 mb-2">Dogs Enter Shelters</div>
              <p className="text-slate-600 leading-relaxed">
                Each year, millions of dogs arrive at shelters and rescues, overwhelming already stretched resources.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-5xl font-bold text-slate-900 mb-3">$2B+</div>
              <div className="text-lg font-semibold text-slate-700 mb-2">Annual Shelter Costs</div>
              <p className="text-slate-600 leading-relaxed">
                The U.S. spends over $2 billion in taxpayer dollars annually on shelter operations and medical care.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 border border-amber-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">The Funding Gap</h3>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  88% of shelters report being short-staffed. Many shelters lack the funding needed for life-saving programs like free spay/neuter services, foster programs, and medical care.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Without adequate funding, healthy and adoptable dogs face euthanasia simply because there's no space or resources to care for them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Our Mission:<br />Funding Second Chances
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Mumbies, we believe every dog deserves a chance. That's why we've built a business model where every purchase directly supports dog rescues and shelters.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                When you buy our sustainable coffee wood chews, you're not just giving your dog a safe, eco-friendly toy. You're helping provide medical care, food, shelter, and adoption programs for dogs waiting for their forever homes.
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-bold text-slate-900">100% Transparent Giving</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  We partner with verified rescue organizations and share exactly where every dollar goes. Your purchase makes a real, measurable difference.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Happy rescued dog"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl border border-slate-200 max-w-xs">
                <div className="text-3xl font-bold text-green-600 mb-1">83%</div>
                <div className="text-sm font-semibold text-slate-700">National Save Rate</div>
                <div className="text-xs text-slate-600 mt-1">
                  Up from 24% in 2016—together we're making progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How Your Purchase Helps
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Every Mumbies product you buy contributes to life-saving programs at our partner rescues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500">
                <Heart className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Medical Care</h3>
              <p className="text-slate-300 leading-relaxed">
                Funding critical veterinary treatments, surgeries, and preventive care for shelter dogs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Spay/Neuter Programs</h3>
              <p className="text-slate-300 leading-relaxed">
                Supporting free and low-cost spay/neuter services to prevent overpopulation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500">
                <Home className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Foster Networks</h3>
              <p className="text-slate-300 leading-relaxed">
                Expanding foster programs that give dogs temporary homes and socialization.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-500">
                <Users className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Adoption Events</h3>
              <p className="text-slate-300 leading-relaxed">
                Organizing community events that connect dogs with loving forever families.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Progress Report</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  We're Making a Difference Together
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <div className="text-3xl font-bold text-slate-900 mb-2">77%</div>
                    <p className="text-slate-700">
                      Reduction in euthanasia rates since 2016
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <div className="text-3xl font-bold text-slate-900 mb-2">52%</div>
                    <p className="text-slate-700">
                      Of U.S. shelters are now no-kill facilities
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-6">
                    <div className="text-3xl font-bold text-slate-900 mb-2">4.2M</div>
                    <p className="text-slate-700">
                      Animals adopted into loving homes in 2024
                    </p>
                  </div>
                </div>
                <p className="text-lg text-slate-600 mt-8 leading-relaxed">
                  While we've made incredible progress, there's still work to do. With your help, we can continue closing the gap and giving every dog the chance they deserve.
                </p>
              </div>

              <div
                className="relative min-h-[400px] md:min-h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Mumbies, Choose Hope
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Every coffee wood chew. Every coconut rope toy. Every treat.<br />
            They all add up to saved lives and second chances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/shop')} size="lg">
              Shop Now & Support Rescues
            </Button>
            <Button
              onClick={() => navigate('/rescues')}
              variant="secondary"
              size="lg"
            >
              Meet Our Rescue Partners
            </Button>
          </div>

          <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Sustainable products. Transparent giving. Real impact.</strong><br />
              That's the Mumbies promise. For the love of dogs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
