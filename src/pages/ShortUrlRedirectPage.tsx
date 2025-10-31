import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ShortUrlRedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      if (!code) {
        setError(true);
        return;
      }

      const { data: shortUrl, error: fetchError } = await supabase
        .from('short_urls')
        .select('*')
        .eq('short_code', code)
        .maybeSingle();

      if (fetchError || !shortUrl) {
        setError(true);
        return;
      }

      await supabase
        .from('short_urls')
        .update({
          click_count: shortUrl.click_count + 1,
          last_clicked_at: new Date().toISOString(),
        })
        .eq('id', shortUrl.id);

      // Always redirect to the main domain, not mumb.us
      const mainDomain = 'https://partners.staging.mumbies.com';
      const fullUrl = shortUrl.destination_url.startsWith('http')
        ? shortUrl.destination_url
        : `${mainDomain}${shortUrl.destination_url}`;

      window.location.href = fullUrl;
    };

    redirect();
  }, [code]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Link Not Found</h2>
        <p className="text-gray-600 mb-6">
          This shortened link doesn't exist or has expired.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
