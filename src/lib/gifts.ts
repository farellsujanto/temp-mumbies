import { supabase } from './supabase';

export interface LeadGift {
  id: string;
  partner_id: string;
  gift_code: string;
  amount: number;
  recipient_email: string;
  recipient_name: string | null;
  message: string | null;
  status: 'sent' | 'redeemed' | 'expired' | 'refunded';
  sent_at: string;
  redeemed_at: string | null;
  expires_at: string;
  customer_id: string | null;
  order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SendGiftParams {
  partnerId: string;
  leadEmail: string;
  leadName?: string;
  amount: number;
  message?: string;
}

export interface SendGiftResult {
  success: boolean;
  giftId?: string;
  giftCode?: string;
  error?: string;
}

function generateGiftCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GIFT-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function sendGiftToLead(params: SendGiftParams): Promise<SendGiftResult> {
  try {
    const { partnerId, leadEmail, leadName, amount, message } = params;

    // Validate amount
    if (amount <= 0 || amount > 25) {
      return {
        success: false,
        error: 'Gift amount must be between $0.01 and $25.00'
      };
    }

    // Get partner's current balance
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('mumbies_cash_balance, organization_name')
      .eq('id', partnerId)
      .maybeSingle();

    if (partnerError) {
      console.error('Error fetching partner:', partnerError);
      return {
        success: false,
        error: 'Failed to fetch partner information'
      };
    }

    if (!partner) {
      return {
        success: false,
        error: 'Partner not found'
      };
    }

    if (partner.mumbies_cash_balance < amount) {
      return {
        success: false,
        error: `Insufficient Mumbies Cash balance. You need $${(amount - partner.mumbies_cash_balance).toFixed(2)} more.`
      };
    }

    // Generate unique gift code
    const giftCode = generateGiftCode();

    // Send gift atomically using database function
    const { data: giftId, error: giftError } = await supabase
      .rpc('send_gift_atomic', {
        p_partner_id: partnerId,
        p_gift_code: giftCode,
        p_amount: amount,
        p_recipient_email: leadEmail,
        p_recipient_name: leadName || null,
        p_message: message || null
      });

    if (giftError) {
      console.error('Error sending gift:', giftError);

      // Check for specific error messages
      if (giftError.message?.includes('Insufficient')) {
        return {
          success: false,
          error: 'Insufficient Mumbies Cash balance'
        };
      }

      return {
        success: false,
        error: 'Failed to send gift. Please try again.'
      };
    }

    // TODO: Send email notification to recipient
    // This would typically call an edge function or email service
    console.log('Gift sent:', {
      giftId,
      giftCode,
      recipient: leadEmail,
      amount,
      from: partner.organization_name
    });

    return {
      success: true,
      giftId,
      giftCode
    };
  } catch (error) {
    console.error('Unexpected error sending gift:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

export async function getPartnerGifts(partnerId: string): Promise<LeadGift[]> {
  const { data, error } = await supabase
    .from('lead_gifts')
    .select('*')
    .eq('partner_id', partnerId)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching gifts:', error);
    return [];
  }

  return data || [];
}

export async function getGiftByCode(giftCode: string): Promise<LeadGift | null> {
  const { data, error } = await supabase
    .from('lead_gifts')
    .select('*')
    .eq('gift_code', giftCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching gift:', error);
    return null;
  }

  return data;
}

export async function redeemGift(giftCode: string, customerId: string): Promise<{ success: boolean; amount?: number; error?: string }> {
  try {
    const { data: amount, error } = await supabase
      .rpc('redeem_gift', {
        p_gift_code: giftCode,
        p_customer_id: customerId
      });

    if (error) {
      console.error('Error redeeming gift:', error);
      return {
        success: false,
        error: error.message || 'Failed to redeem gift'
      };
    }

    return {
      success: true,
      amount
    };
  } catch (error) {
    console.error('Unexpected error redeeming gift:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

export function calculateDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatGiftStatus(status: string): { label: string; className: string } {
  switch (status) {
    case 'sent':
      return { label: 'Sent', className: 'bg-blue-100 text-blue-800' };
    case 'redeemed':
      return { label: 'Redeemed', className: 'bg-green-100 text-green-800' };
    case 'expired':
      return { label: 'Expired', className: 'bg-gray-100 text-gray-800' };
    case 'refunded':
      return { label: 'Refunded', className: 'bg-yellow-100 text-yellow-800' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-800' };
  }
}
