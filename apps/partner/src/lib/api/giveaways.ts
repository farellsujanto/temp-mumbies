import { supabase } from '@mumbies/shared';
import { GiveawayBundle } from './bundles';

export interface PartnerGiveaway {
  id: string;
  partner_id: string;
  bundle_id: string;
  title: string;
  description: string;
  landing_page_slug: string;
  starts_at: string;
  ends_at: string;
  status: string;
  total_entries: number;
  total_leads_generated: number;
  winner_selected_at: string | null;
  created_at: string;
  updated_at: string;
  bundle?: GiveawayBundle;
}

/**
 * Normalizes giveaway data
 */
function normalizeGiveaway(giveaway: any): PartnerGiveaway {
  return {
    id: giveaway.id || '',
    partner_id: giveaway.partner_id || '',
    bundle_id: giveaway.bundle_id || '',
    title: giveaway.title || 'Giveaway',
    description: giveaway.description || '',
    landing_page_slug: giveaway.landing_page_slug || '',
    starts_at: giveaway.starts_at || new Date().toISOString(),
    ends_at: giveaway.ends_at || new Date().toISOString(),
    status: giveaway.status || 'draft',
    total_entries: Number(giveaway.total_entries || 0),
    total_leads_generated: Number(giveaway.total_leads_generated || 0),
    winner_selected_at: giveaway.winner_selected_at || null,
    created_at: giveaway.created_at || new Date().toISOString(),
    updated_at: giveaway.updated_at || new Date().toISOString(),
    bundle: giveaway.bundle
  };
}


/**
 * Creates a new giveaway
 */
export async function createGiveaway(giveaway: Partial<PartnerGiveaway>) {
  const { data, error } = await supabase
    .from('partner_giveaways')
    .insert(giveaway)
    .select()
    .single();

  if (error) {
    console.error('Error creating giveaway:', error);
    throw error;
  }

  return normalizeGiveaway(data);
}
