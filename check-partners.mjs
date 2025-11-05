import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPartners() {
  console.log('Checking all partners...\n');

  const { data: nonprofits } = await supabase
    .from('nonprofits')
    .select('id, organization_name, status, contact_email, mumbies_cash_balance')
    .order('created_at', { ascending: false });

  console.log('Nonprofits:', nonprofits);

  const { data: users } = await supabase
    .from('users')
    .select('id, email, is_partner, nonprofit_id')
    .eq('is_partner', true);

  console.log('\nPartner Users:', users);

  const { data: leadsCount } = await supabase
    .from('partner_leads')
    .select('partner_id', { count: 'exact', head: true });

  console.log('\nTotal leads in database:', leadsCount);
}

checkPartners().catch(console.error);
