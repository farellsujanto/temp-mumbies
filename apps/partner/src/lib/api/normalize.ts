/**
 * Data Normalization Layer
 *
 * This file ensures ALL data from Supabase is normalized to prevent null/undefined errors.
 * Every function returns a properly typed object with safe defaults.
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface NormalizedPartner {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  website: string;
  status: 'pending' | 'active' | 'suspended';
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  created_at: string;
  sitestripe_auto_generate: boolean;
}

export interface NormalizedLead {
  id: string;
  partner_id: string;
  email: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface NormalizedGiveaway {
  id: string;
  partner_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  bundle_id: string | null;
  entries_count: number;
  created_at: string;
}

export interface NormalizedBundle {
  id: string;
  name: string;
  description: string;
  retail_value: number;
  partner_cost: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
}

export interface NormalizedReward {
  id: string;
  partner_id: string;
  type: 'challenge' | 'milestone' | 'bonus';
  title: string;
  description: string;
  amount: number;
  status: 'available' | 'claimed' | 'completed';
  target_value: number;
  current_value: number;
  created_at: string;
}

export interface NormalizedTransaction {
  id: string;
  partner_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference_id: string;
  created_at: string;
}

export interface NormalizedReferral {
  id: string;
  referrer_partner_id: string;
  referred_partner_id: string;
  referred_partner_name: string;
  referred_partner_email: string;
  status: 'pending' | 'completed' | 'cancelled';
  commission_amount: number;
  commission_rate: number;
  created_at: string;
  completed_at: string | null;
}

export interface NormalizedPartnerProfile {
  id: string;
  organization_name: string;
  partner_type: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
}

export interface NormalizedStats {
  total_leads: number;
  active_giveaways: number;
  total_entries: number;
  conversion_rate: number;
  balance: number;
  total_earned: number;
  pending_rewards: number;
}

// =============================================================================
// NORMALIZATION FUNCTIONS
// =============================================================================

export function normalizePartner(data: any): NormalizedPartner {
  return {
    id: data?.id || '',
    organization_name: data?.organization_name || 'Unknown Organization',
    contact_name: data?.contact_name || 'Unknown Contact',
    contact_email: data?.contact_email || '',
    website: data?.website || '',
    status: data?.status || 'pending',
    balance: parseFloat(data?.balance || '0'),
    total_earned: parseFloat(data?.total_earned || '0'),
    total_withdrawn: parseFloat(data?.total_withdrawn || '0'),
    created_at: data?.created_at || new Date().toISOString(),
    sitestripe_auto_generate: data?.sitestripe_auto_generate ?? true,
  };
}

export function normalizeLead(data: any): NormalizedLead {
  return {
    id: data?.id || '',
    partner_id: data?.partner_id || '',
    email: data?.email || '',
    status: data?.status || 'new',
    source: data?.source || 'unknown',
    notes: data?.notes || '',
    created_at: data?.created_at || new Date().toISOString(),
    updated_at: data?.updated_at || new Date().toISOString(),
  };
}

export function normalizeGiveaway(data: any): NormalizedGiveaway {
  return {
    id: data?.id || '',
    partner_id: data?.partner_id || '',
    title: data?.title || 'Untitled Giveaway',
    description: data?.description || '',
    start_date: data?.start_date || new Date().toISOString(),
    end_date: data?.end_date || new Date().toISOString(),
    status: data?.status || 'draft',
    bundle_id: data?.bundle_id || null,
    entries_count: parseInt(data?.entries_count || '0'),
    created_at: data?.created_at || new Date().toISOString(),
  };
}

export function normalizeBundle(data: any): NormalizedBundle {
  return {
    id: data?.id || '',
    name: data?.name || 'Unknown Bundle',
    description: data?.description || '',
    retail_value: parseFloat(data?.retail_value || '0'),
    partner_cost: parseFloat(data?.partner_cost || '0'),
    is_active: data?.is_active ?? true,
    image_url: data?.image_url || '/logo.png',
    created_at: data?.created_at || new Date().toISOString(),
  };
}

export function normalizeReward(data: any): NormalizedReward {
  return {
    id: data?.id || '',
    partner_id: data?.partner_id || '',
    type: data?.type || 'challenge',
    title: data?.title || 'Untitled Reward',
    description: data?.description || '',
    amount: parseFloat(data?.amount || '0'),
    status: data?.status || 'available',
    target_value: parseFloat(data?.target_value || '0'),
    current_value: parseFloat(data?.current_value || '0'),
    created_at: data?.created_at || new Date().toISOString(),
  };
}

export function normalizeTransaction(data: any): NormalizedTransaction {
  return {
    id: data?.id || '',
    partner_id: data?.partner_id || '',
    type: data?.type || 'credit',
    amount: parseFloat(data?.amount || '0'),
    description: data?.description || '',
    reference_id: data?.reference_id || '',
    created_at: data?.created_at || new Date().toISOString(),
  };
}

export function normalizeReferral(data: any): NormalizedReferral {
  return {
    id: data?.id || '',
    referrer_partner_id: data?.referrer_partner_id || '',
    referred_partner_id: data?.referred_partner_id || '',
    referred_partner_name: data?.referred_partner_name || 'Unknown',
    referred_partner_email: data?.referred_partner_email || '',
    status: data?.status || 'pending',
    commission_amount: parseFloat(data?.commission_amount || '0'),
    commission_rate: parseFloat(data?.commission_rate || '0'),
    created_at: data?.created_at || new Date().toISOString(),
    completed_at: data?.completed_at || null,
  };
}

export function normalizePartnerProfile(data: any): NormalizedPartnerProfile {
  return {
    id: data?.id || '',
    organization_name: data?.organization_name || 'Unknown Organization',
    partner_type: data?.partner_type || 'partner',
    email: data?.email || data?.contact_email || '',
    phone: data?.phone || data?.contact_phone || '',
    address: data?.address || '',
    website: data?.website || '',
    description: data?.description || '',
    status: data?.status || 'pending',
    created_at: data?.created_at || new Date().toISOString(),
  };
}

export function normalizeStats(data: any): NormalizedStats {
  return {
    total_leads: parseInt(data?.total_leads || '0'),
    active_giveaways: parseInt(data?.active_giveaways || '0'),
    total_entries: parseInt(data?.total_entries || '0'),
    conversion_rate: parseFloat(data?.conversion_rate || '0'),
    balance: parseFloat(data?.balance || '0'),
    total_earned: parseFloat(data?.total_earned || '0'),
    pending_rewards: parseFloat(data?.pending_rewards || '0'),
  };
}

// =============================================================================
// ARRAY NORMALIZATION HELPERS
// =============================================================================

export function normalizeLeadArray(data: any[]): NormalizedLead[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeLead);
}

export function normalizeGiveawayArray(data: any[]): NormalizedGiveaway[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeGiveaway);
}

export function normalizeBundleArray(data: any[]): NormalizedBundle[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeBundle);
}

export function normalizeRewardArray(data: any[]): NormalizedReward[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeReward);
}

export function normalizeTransactionArray(data: any[]): NormalizedTransaction[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeTransaction);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-gray-100 text-gray-800',
    draft: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    available: 'bg-blue-100 text-blue-800',
    claimed: 'bg-yellow-100 text-yellow-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}
