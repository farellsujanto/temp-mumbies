import { createHmac } from 'crypto';

/**
 * Generate a unique Mumbies referral code
 * Format: MUMBXXXXXXXX (where X is alphanumeric)
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < 8; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `MUMB${randomPart}`;
}

export function generateReferralCodeFingerprint(timestamp: number, referralCode: string): string {
    const extraSalt = process.env.REFERRAL_EXTRA_SALT;
    const hmacSecret = process.env.REFERRAL_HMAC_SECRET;
    if (!extraSalt || !hmacSecret) {
      throw new Error('Missing environment variables for referral code fingerprint generation');
    }

    const message = timestamp.toString() + referralCode + extraSalt + referralCode;

    const hmac = createHmac('sha256', hmacSecret);
    hmac.update(message);
    return hmac.digest('hex');
}