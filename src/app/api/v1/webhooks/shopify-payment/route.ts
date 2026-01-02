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
    // Prefetch products and variants for faster lookups and compute referral earnings
    try {
      const [products, variants] = await Promise.all([
        prisma.product.findMany({ select: { id: true, shopifyProductId: true, referralPercentage: true } }),
        prisma.productVariant.findMany({ select: { id: true, shopifyVariantId: true, referralPercentage: true } }),
      ]);

      const productMap = new Map<string, { id: number; referralPercentage: number }>();
      for (const p of products) if (p.shopifyProductId) productMap.set(p.shopifyProductId, { id: p.id, referralPercentage: Number(p.referralPercentage ?? 0) });

      const variantMap = new Map<string, { id: number; referralPercentage: number }>();
      for (const v of variants) if (v.shopifyVariantId) variantMap.set(v.shopifyVariantId, { id: v.id, referralPercentage: Number(v.referralPercentage ?? 0) });

      const email = data.email || data.customer?.email;
      if (email) {
        const user = await prisma.user.findFirst({ where: { email } });
        console.log('Matched user for referral processing:', user);
        if (user && user.referrerId) {
          console.log('Processing referral earnings for user:', user.id);
          let totalReferral = 0;
          const items = data.line_items || [];

          for (const item of items) {
            const quantity = item.quantity || 1;

            // Determine price: prefer discounted price if present, fall back to price
            let basePrice = 0;
            if (item.discounted_price != null) basePrice = parseFloat(item.discounted_price) || 0;
            else if (item.price != null) basePrice = parseFloat(item.price) || 0;
            else if (item.price && item.discount_allocations && item.discount_allocations.length > 0) {
              const price = parseFloat(item.price) || 0;
              const totalAlloc = item.discount_allocations.reduce((acc: number, d: any) => acc + (parseFloat(d.amount || 0) || 0), 0);
              basePrice = Math.max(0, price - totalAlloc);
            }
            console.log(`Item ${item.id} base price determined as:`, basePrice);

            // Determine referral percentage from variant -> product -> 0
            let referralPercentage = 0;
            if (item.variant_id) {
              console.log(`Looking up variant ID: ${item.variant_id}`);
              const v = variantMap.get(String(item.variant_id));
              if (v) referralPercentage = v.referralPercentage;
            }
            if (!referralPercentage && item.product_id) {
              console.log(`Looking up product ID: ${item.product_id}`);
              const p = productMap.get(String(item.product_id));
              if (p) referralPercentage = p.referralPercentage;
            }
            console.log(`Item ${item.id} referral percentage determined as:`, referralPercentage);
            totalReferral += (basePrice || 0) * quantity * (Number(referralPercentage || 0) / 100);
          }
          console.log('Total referral earnings calculated:', totalReferral);

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
    } catch (err) {
      console.error('Referral processing error:', err);
    }
    
    console.log('Webhook processed successfully');
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
