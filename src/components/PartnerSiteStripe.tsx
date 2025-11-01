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
        .eq('partner_slug', partnerSlug)
        .eq('destination_url', currentPath)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching short URL:', fetchError);
      }

      if (existing) {
        setShortUrl(`https://mumb.us/${existing.short_code}`);
        return;
      }

      // Generate new short code (6 characters)
      const shortCode = Math.random().toString(36).substring(2, 8);

      // Extract product_id from path if it's a product page
      let productId = null;
      if (currentPath.startsWith('/product/')) {
        productId = currentPath.split('/product/')[1];
      }

      // Create short URL record
      const { data, error } = await supabase
        .from('short_urls')
        .insert({
          short_code: shortCode,
          destination_url: currentPath,
          partner_slug: partnerSlug,
          product_id: productId
        })
        .select('short_code')
        .single();

      if (error) {
        console.error('Error creating short URL:', error);
        setShortUrl('Error generating link');
        return;
      }

      if (data) {
        setShortUrl(`https://mumb.us/${data.short_code}`);
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
      }, {
        onConflict: 'partner_id'
      });

    if (!error) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-2 py-2 min-h-[40px]">
          {/* Left side - Branding */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <LinkIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">SiteStripe</span>
          </div>

          {/* Center - URL and Copy Button */}
          <div className="flex items-center gap-1.5 flex-1 justify-center min-w-0">
            <div className="bg-white bg-opacity-20 rounded px-2 py-1 text-xs font-mono truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[240px]">
              {shortUrl || 'Generating...'}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!shortUrl || copied || shortUrl.includes('Error')}
              className="bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded text-xs font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => navigate('/partner/dashboard')}
              className="text-white hover:text-blue-100 transition-colors p-1 rounded"
              title="Dashboard"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={hideSiteStripe}
              className="text-white hover:text-blue-100 transition-colors p-1 rounded"
              title="Hide"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
