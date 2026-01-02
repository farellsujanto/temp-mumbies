import { NextRequest, NextResponse } from 'next/server';
import { generateReferralCodeFingerprint } from '@/src/utils/referral.util';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;

    // Retrieve environment variables
    const storeUrl = process.env.MUMBIES_SHOPIFY_STORE_URL;
    const extraSalt = process.env.REFERRAL_EXTRA_SALT;
    const hmacSecret = process.env.REFERRAL_HMAC_SECRET;

    if (!storeUrl || !extraSalt || !hmacSecret) {
      return NextResponse.json({ success: false, message: 'Server configuration error', data: null }, { status: 500 });
    }

    // Generate timestamp
    const ts = Date.now();
    // Mumbies referral code is the code param
    const mrc = code;
    // Generate HMAC signature using utility function
    const sg = generateReferralCodeFingerprint(ts, mrc);

    // Construct redirect URL
    const redirectUrl = `${storeUrl}?ts=${ts}&mrc=${mrc}&sg=${sg}`;
    console.log('Redirect URL:', redirectUrl);

    // Redirect to the Shopify store URL with parameters
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Referral redirect error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred. Please try again.', data: null }, { status: 500 });
  }
}
