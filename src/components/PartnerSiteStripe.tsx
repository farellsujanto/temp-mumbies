import { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, CheckCircle, X, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from './Button';

interface PartnerSiteStripeProps {
  partnerId: string;
  partnerSlug: string;
}

export default function PartnerSiteStripe({ partnerId, partnerSlug }: PartnerSiteStripeProps) {
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    generateShortUrl();
  }, [location.pathname, partnerSlug]);

  const generateShortUrl = async () => {
    try {
      setShortUrl(''); // Reset while generating

      // Get current page URL
      const currentPath = location.pathname;

      // Check if there's already a short URL for this path + partner
      const { data: existing, error: fetchError } = await supabase
        .from('short_urls')
        .select('short_code')
        .eq('partner_id', partnerId)
        .eq('destination_url', currentPath)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching short URL:', fetchError);
      }

      if (existing) {
        setShortUrl(`${window.location.origin}/s/${existing.short_code}`);
        return;
      }

      // Generate new short code (6 characters)
      const shortCode = Math.random().toString(36).substring(2, 8);

      // Create short URL record
      const { data, error } = await supabase
        .from('short_urls')
        .insert({
          partner_id: partnerId,
          short_code: shortCode,
          destination_url: currentPath,
          is_active: true
        })
        .select('short_code')
        .single();

      if (error) {
        console.error('Error creating short URL:', error);
        setShortUrl('Error generating link');
        return;
      }

      if (data) {
        setShortUrl(`${window.location.origin}/s/${data.short_code}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setShortUrl('Error');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const hideSiteStripe = async () => {
    // Update preference in database
    const { error } = await supabase
      .from('partner_preferences')
      .upsert({
        partner_id: partnerId,
        sitestripe_enabled: false
      });

    if (!error) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left side - Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">Partner SiteStripe</span>
            </div>
            <div className="hidden md:block text-xs text-blue-100">
              {partnerSlug}
            </div>
          </div>

          {/* Center - URL and Copy Button */}
          <div className="flex items-center gap-2">
            <div className="bg-white bg-opacity-20 rounded px-3 py-1 text-sm font-mono max-w-xs truncate hidden sm:block">
              {shortUrl || 'Generating...'}
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!shortUrl || copied}
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Get Link</span>
                </>
              )}
            </Button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/partner/dashboard')}
              className="text-white hover:text-blue-100 transition-colors p-1"
              title="Dashboard Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={hideSiteStripe}
              className="text-white hover:text-blue-100 transition-colors p-1"
              title="Hide SiteStripe"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
