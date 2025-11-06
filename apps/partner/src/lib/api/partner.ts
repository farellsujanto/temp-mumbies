/**
 * Partner API Layer
 *
 * All data fetching goes through these functions.
 * All responses are normalized to prevent null/undefined errors.
 */

import { supabase } from '@mumbies/shared';
import {
  normalizePartner,
  normalizeLead,
  normalizeLeadArray,
  normalizeGiveawayArray,
  normalizeRewardArray,
  normalizeTransactionArray,
  normalizeReferral,
  normalizePartnerProfile,
  normalizeStats,
  type NormalizedPartner,
  type NormalizedLead,
  type NormalizedGiveaway,
  type NormalizedReward,
  type NormalizedTransaction,
  type NormalizedReferral,
  type NormalizedPartnerProfile,
  type NormalizedStats,
} from './normalize';

// =============================================================================
// PARTNER DATA
// =============================================================================

export async function fetchPartnerProfile(partnerId: string): Promise<NormalizedPartner | null> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('id, organization_name, contact_name, contact_email, website, status, balance, total_earned, total_withdrawn, created_at, sitestripe_auto_generate')
      .eq('id', partnerId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching partner profile:', error);
      return null;
    }

    return data ? normalizePartner(data) : null;
  } catch (err) {
    console.error('Exception fetching partner profile:', err);
    return null;
  }
}

// =============================================================================
// LEADS / OPPORTUNITIES
// =============================================================================

export async function fetchPartnerLeads(partnerId: string): Promise<NormalizedLead[]> {
  try {
    const { data, error } = await supabase
      .from('partner_leads')
      .select('id, partner_id, email, status, source, notes, created_at, updated_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner leads:', error);
      return [];
    }

    return normalizeLeadArray(data || []);
  } catch (err) {
    console.error('Exception fetching partner leads:', err);
    return [];
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'converted' | 'lost',
  notes?: string
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { error } = await supabase
      .from('partner_leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) {
      console.error('Error updating lead status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception updating lead status:', err);
    return false;
  }
}

// =============================================================================
// GIVEAWAYS
// =============================================================================

export async function fetchPartnerGiveaways(partnerId: string): Promise<NormalizedGiveaway[]> {
  try {
    const { data, error } = await supabase
      .from('partner_giveaways')
      .select('id, partner_id, title, description, start_date, end_date, status, bundle_id, entries_count, created_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner giveaways:', error);
      return [];
    }

    return normalizeGiveawayArray(data || []);
  } catch (err) {
    console.error('Exception fetching partner giveaways:', err);
    return [];
  }
}

// =============================================================================
// REWARDS
// =============================================================================

export async function fetchPartnerRewards(partnerId: string): Promise<NormalizedReward[]> {
  try {
    const { data, error } = await supabase
      .from('partner_rewards')
      .select('id, partner_id, type, title, description, amount, status, target_value, current_value, created_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner rewards:', error);
      return [];
    }

    return normalizeRewardArray(data || []);
  } catch (err) {
    console.error('Exception fetching partner rewards:', err);
    return [];
  }
}

// =============================================================================
// TRANSACTIONS
// =============================================================================

export async function fetchPartnerTransactions(partnerId: string): Promise<NormalizedTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('partner_transactions')
      .select('id, partner_id, type, amount, description, reference_id, created_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching partner transactions:', error);
      return [];
    }

    return normalizeTransactionArray(data || []);
  } catch (err) {
    console.error('Exception fetching partner transactions:', err);
    return [];
  }
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export async function fetchPartnerStats(partnerId: string): Promise<NormalizedStats> {
  try {
    const [partner, leads, giveaways, rewards] = await Promise.all([
      fetchPartnerProfile(partnerId),
      fetchPartnerLeads(partnerId),
      fetchPartnerGiveaways(partnerId),
      fetchPartnerRewards(partnerId),
    ]);

    const activeGiveaways = giveaways.filter((g) => g.status === 'active');
    const totalEntries = giveaways.reduce((sum, g) => sum + g.entries_count, 0);
    const convertedLeads = leads.filter((l) => l.status === 'converted').length;
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;
    const pendingRewards = rewards
      .filter((r) => r.status === 'available' || r.status === 'claimed')
      .reduce((sum, r) => sum + r.amount, 0);

    return normalizeStats({
      total_leads: leads.length,
      active_giveaways: activeGiveaways.length,
      total_entries: totalEntries,
      conversion_rate: conversionRate,
      balance: partner?.balance || 0,
      total_earned: partner?.total_earned || 0,
      pending_rewards: pendingRewards,
    });
  } catch (err) {
    console.error('Exception fetching partner stats:', err);
    return normalizeStats({});
  }
}

// =============================================================================
// DETAILED PARTNER PROFILE FOR SETTINGS
// =============================================================================

export async function fetchPartnerProfileDetailed(partnerId: string): Promise<NormalizedPartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partnerId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching detailed partner profile:', error);
      return null;
    }

    return data ? normalizePartnerProfile(data) : null;
  } catch (err) {
    console.error('Exception fetching detailed partner profile:', err);
    return null;
  }
}

// =============================================================================
// REFERRALS
// =============================================================================

export async function fetchPartnerReferrals(partnerId: string): Promise<NormalizedReferral[]> {
  try {
    const { data, error } = await supabase
      .from('partner_referrals')
      .select('*')
      .eq('referrer_partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner referrals:', error);
      return [];
    }

    return (data || []).map(normalizeReferral);
  } catch (err) {
    console.error('Exception fetching partner referrals:', err);
    return [];
  }
}
