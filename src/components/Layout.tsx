import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Navigation from './Navigation';
import Footer from './Footer';
import PartnerSiteStripe from './PartnerSiteStripe';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [showSiteStripe, setShowSiteStripe] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerSlug, setPartnerSlug] = useState<string>('');

  useEffect(() => {
    if (user) {
      checkPartnerStatus();
    } else {
      setShowSiteStripe(false);
    }
  }, [user]);

  const checkPartnerStatus = async () => {
    if (!user) return;

    // Check if user is a partner
    const { data: nonprofitData } = await supabase
      .from('nonprofits')
      .select('id, slug, status')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (nonprofitData && (nonprofitData.status === 'active' || nonprofitData.status === 'approved')) {
      setPartnerId(nonprofitData.id);
      setPartnerSlug(nonprofitData.slug);

      // Check if SiteStripe is enabled
      const { data: prefs } = await supabase
        .from('partner_preferences')
        .select('sitestripe_enabled')
        .eq('partner_id', nonprofitData.id)
        .maybeSingle();

      // Show SiteStripe if preference doesn't exist (default true) or if enabled
      setShowSiteStripe(!prefs || prefs.sitestripe_enabled !== false);
    } else {
      setShowSiteStripe(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showSiteStripe && partnerId && (
        <PartnerSiteStripe partnerId={partnerId} partnerSlug={partnerSlug} />
      )}
      <div className={showSiteStripe ? 'mt-10' : ''}>
        <Navigation />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
