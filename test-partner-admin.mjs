import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPartnerData() {
  console.log('Testing Wisconsin Humane Society (with service role)...\n');

  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email, is_partner, nonprofit_id')
    .eq('email', 'partner@wihumane.org')
    .maybeSingle();

  console.log('User:', users);
  console.log('User Error:', userError);

  if (!users?.nonprofit_id) return;

  const { data: leads, count: leadsCount } = await supabase
    .from('partner_leads')
    .select('id, email, status', { count: 'exact' })
    .eq('partner_id', users.nonprofit_id)
    .limit(3);

  console.log(`\nLeads (${leadsCount} total):`, leads);
}

testPartnerData().catch(console.error);
