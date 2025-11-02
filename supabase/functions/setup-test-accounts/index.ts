import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results = [];

    // 1. Create Admin Account
    const { data: adminAuth, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@mumbies.com',
      password: 'admin123',
      email_confirm: true,
    });

    if (adminAuth?.user && !adminAuthError) {
      await supabaseAdmin
        .from('users')
        .update({ is_admin: true, full_name: 'Admin User' })
        .eq('id', adminAuth.user.id);
      results.push({ email: 'admin@mumbies.com', status: 'created', role: 'admin' });
    } else {
      results.push({ email: 'admin@mumbies.com', status: 'exists or error', error: adminAuthError?.message });
    }

    // 2. Create Partner Account
    const { data: partnerAuth, error: partnerAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'partner@mumbies.com',
      password: 'partner123',
      email_confirm: true,
    });

    if (partnerAuth?.user && !partnerAuthError) {
      await supabaseAdmin
        .from('users')
        .update({ 
          is_partner: true, 
          nonprofit_id: '00000000-0000-0000-0000-000000000099',
          full_name: 'Partner User'
        })
        .eq('id', partnerAuth.user.id);

      await supabaseAdmin
        .from('nonprofits')
        .update({ auth_user_id: partnerAuth.user.id })
        .eq('id', '00000000-0000-0000-0000-000000000099');

      results.push({ email: 'partner@mumbies.com', status: 'created', role: 'partner' });
    } else {
      results.push({ email: 'partner@mumbies.com', status: 'exists or error', error: partnerAuthError?.message });
    }

    // 3. Create Customer Account
    const { data: customerAuth, error: customerAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'customer@mumbies.com',
      password: 'customer123',
      email_confirm: true,
    });

    if (customerAuth?.user && !customerAuthError) {
      await supabaseAdmin
        .from('users')
        .update({ full_name: 'Customer User' })
        .eq('id', customerAuth.user.id);
      results.push({ email: 'customer@mumbies.com', status: 'created', role: 'customer' });
    } else {
      results.push({ email: 'customer@mumbies.com', status: 'exists or error', error: customerAuthError?.message });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test accounts setup complete',
        results 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
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