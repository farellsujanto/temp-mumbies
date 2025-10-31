import { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle, Link, Mail, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

interface ProductShareButtonProps {
  productId: string;
  productName: string;
  productUrl: string;
}

export default function ProductShareButton({ productId, productName, productUrl }: ProductShareButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [partnerSlug, setPartnerSlug] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPartnerInfo();
    }
  }, [user]);

  const loadPartnerInfo = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('nonprofits')
      .select('slug, status')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (data && (data.status === 'active' || data.status === 'approved')) {
      setPartnerSlug(data.slug);
    }
  };

  const generateAffiliateLink = async () => {
    if (!partnerSlug) return;

    setGenerating(true);

    const fullUrl = `${window.location.origin}/product/${productId}?ref=${partnerSlug}`;

    const shortCode = Math.random().toString(36).substring(2, 8);

    const { error } = await supabase
      .from('short_urls')
      .insert({
        short_code: shortCode,
        destination_url: fullUrl,
        partner_slug: partnerSlug,
        product_id: productId,
        click_count: 0
      });

    if (!error) {
      setAffiliateLink(`${window.location.origin}/s/${shortCode}`);
    }

    setGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out ${productName}!`);
    const body = encodeURIComponent(`I thought you'd love this product: ${productUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(`Check out ${productName}: ${productUrl}`);
    window.open(`sms:?body=${text}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName}`,
          url: productUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Share this product"
      >
        <Share2 className="h-5 w-5 text-gray-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Share Product</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Standard Share Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyToClipboard(productUrl)}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="text-sm font-medium">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>

                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Email</span>
                </button>

                <button
                  onClick={shareViaSMS}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Text</span>
                </button>

                {navigator.share && (
                  <button
                    onClick={shareNative}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">More</span>
                  </button>
                )}
              </div>

              {/* Partner Affiliate Link - Only for logged-in partners */}
              {partnerSlug && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Link className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-green-900">Partner Affiliate Link</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-4">
                      Generate a short link that earns you 5% commission on all sales!
                    </p>

                    {!affiliateLink ? (
                      <Button
                        onClick={generateAffiliateLink}
                        disabled={generating}
                        fullWidth
                        size="sm"
                      >
                        {generating ? 'Generating...' : 'Generate Affiliate Link'}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-white border border-green-300 rounded-lg p-3">
                          <p className="text-sm font-mono text-gray-900 break-all">
                            {affiliateLink}
                          </p>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(affiliateLink)}
                          fullWidth
                          size="sm"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Affiliate Link
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
