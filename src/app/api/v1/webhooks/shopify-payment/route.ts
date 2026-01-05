import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/src/utils/prismaOrm.util';

function verifyShopifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader) {
    return false;
  }

  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || '')
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmacHeader;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('X-Shopify-Hmac-SHA256');

    // Verify webhook signature
    if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the verified data
    const data = JSON.parse(rawBody);
    console.log('Received Shopify webhook data:', data);

    try {
      const email = data.email || data.customer?.email;
      if (email) {
        const user = await prisma.user.findFirst({
          where: { email },
        });
        if (user && user.referrerId) {
          // Get referral percentage from user's partner tag
          const referer = await prisma.user.findFirst({
            where: { id: user.referrerId },
            include: { partnerTag: { select: { referralPercentage: true } } }
          });
          if (!referer) {
            console.log(`Referer with ID ${user.referrerId} not found.`);
            return;
          }

          const referralPercentage = referer.partnerTag?.referralPercentage ? Number(referer.partnerTag.referralPercentage) : 0;
          console.log(`User ${user.id} referred by ${user.referrerId} with referral percentage: ${referralPercentage}%`);

          // Using subtotal_price as total amount for referral calculation (excluding taxes, shipping)
          const totalAmount = parseFloat(data.subtotal_price || '0') || 0;
          const totalReferral = totalAmount * (referralPercentage / 100);

          console.log(`Total referral earnings for order ${data.id || data.order_id}: $${totalReferral.toFixed(2)}`);
          if (totalReferral > 0) {
            const shopifyOrderId = String(data.id || data.order_id || '');
            const refererId = user.referrerId as number;

            // Create an earnings log and update referer's totals in a transaction
            try {
              await prisma.$transaction([
                prisma.referralEarningsLog.create({ data: { userId: user.id, refererId, shopifyOrderId, amount: totalReferral } }),
                prisma.user.update({ where: { id: refererId }, data: { totalReferralEarnings: { increment: totalReferral }, withdrawableBalance: { increment: totalReferral } } }),
              ]);
            } catch (txErr) {
              console.error('Failed to write referral earnings transaction:', txErr);
            }
          }
        }
      }
      console.log('Referral processing completed for webhook.');
    } catch (err) {
      console.error('Referral processing error:', err);
    }

    return NextResponse.json(
      { success: true, message: 'Webhook received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
