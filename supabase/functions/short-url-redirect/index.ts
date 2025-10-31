import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.searchParams.get('code');

    if (!shortCode) {
      return new Response(
        JSON.stringify({ error: 'Missing short code' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: shortUrl, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', shortCode)
      .maybeSingle();

    if (error || !shortUrl) {
      return new Response(
        JSON.stringify({ error: 'Short URL not found' }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await supabase
      .from('short_urls')
      .update({
        click_count: shortUrl.click_count + 1,
        last_clicked_at: new Date().toISOString(),
      })
      .eq('id', shortUrl.id);

    return new Response(
      JSON.stringify({
        destination: shortUrl.destination_url,
        clicks: shortUrl.click_count + 1
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});