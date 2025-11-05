import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testPartnerData() {
  console.log('Testing Wisconsin Humane Society partner data...\n');

  const { data: users } = await supabase
    .from('users')
    .select('id, email, is_partner, nonprofit_id')
    .eq('email', 'partner@wihumane.org')
    .maybeSingle();

  console.log('User:', users);

  if (!users?.nonprofit_id) {
    console.log('No nonprofit_id found');
    return;
  }

  const { data: nonprofit } = await supabase
    .from('nonprofits')
    .select('id, organization_name, status, mumbies_cash_balance')
    .eq('id', users.nonprofit_id)
    .maybeSingle();

  console.log('\nNonprofit:', nonprofit);

  const { data: leads, count: leadsCount } = await supabase
    .from('partner_leads')
    .select('id, email, status, created_at', { count: 'exact' })
    .eq('partner_id', users.nonprofit_id)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log(`\nLeads (${leadsCount} total):`, leads);

  const { data: giveaways, count: giveawaysCount } = await supabase
    .from('partner_giveaways')
    .select('id, title, status, entries_count', { count: 'exact' })
    .eq('partner_id', users.nonprofit_id);

  console.log(`\nGiveaways (${giveawaysCount} total):`, giveaways);

  const { data: transactions } = await supabase
    .from('partner_transactions')
    .select('id, transaction_type, amount, description, created_at')
    .eq('partner_id', users.nonprofit_id)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\nRecent Transactions:', transactions);
}

testPartnerData().catch(console.error);
