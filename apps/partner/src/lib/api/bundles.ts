import { supabase } from '@mumbies/shared';

export interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  total_value: number;
  featured_image_url: string;
  unlock_requirement_type: string;
  unlock_requirement_value: number;
  is_active: boolean;
  retail_value: number;
  image_url: string;
  tier: string;
  sales_threshold: number;
  is_universal: boolean;
  allow_reuse: boolean;
  cooldown_days: number;
  assigned_partner_ids: string[];
  products_description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Normalizes bundle data to ensure no null values
 * This prevents runtime errors from null property access
 */
function normalizeBundle(bundle: any): GiveawayBundle {
  return {
    id: bundle.id || '',
    name: bundle.name || 'Giveaway Bundle',
    description: bundle.description || 'Exclusive bundle for partners',
    total_value: Number(bundle.total_value || bundle.retail_value || 0),
    featured_image_url: bundle.featured_image_url || bundle.image_url || 'https://via.placeholder.com/300x200?text=Bundle',
    unlock_requirement_type: bundle.unlock_requirement_type || 'none',
    unlock_requirement_value: Number(bundle.unlock_requirement_value || 0),
    is_active: bundle.is_active !== false,
    retail_value: Number(bundle.retail_value || bundle.total_value || 0),
    image_url: bundle.image_url || bundle.featured_image_url || '',
    tier: bundle.tier || 'standard',
    sales_threshold: Number(bundle.sales_threshold || 0),
    is_universal: bundle.is_universal !== false,
    allow_reuse: bundle.allow_reuse === true,
    cooldown_days: Number(bundle.cooldown_days || 0),
    assigned_partner_ids: Array.isArray(bundle.assigned_partner_ids) ? bundle.assigned_partner_ids : [],
    products_description: bundle.products_description || '',
    created_at: bundle.created_at || new Date().toISOString(),
    updated_at: bundle.updated_at || new Date().toISOString()
  };
}

/**
 * Fetches all active giveaway bundles with normalized data
 */
export async function fetchGiveawayBundles() {
  const { data, error } = await supabase
    .from('giveaway_bundles')
    .select('*')
    .eq('is_active', true)
    .order('unlock_requirement_value', { ascending: true });

  if (error) {
    console.error('Error fetching bundles:', error);
    throw error;
  }

  return (data || []).map(normalizeBundle);
}

/**
 * Fetches a single bundle by ID with normalized data
 */
export async function fetchBundleById(bundleId: string) {
  const { data, error } = await supabase
    .from('giveaway_bundles')
    .select('*')
    .eq('id', bundleId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching bundle:', error);
    throw error;
  }

  return data ? normalizeBundle(data) : null;
}
