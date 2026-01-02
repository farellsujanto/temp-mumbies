import { NextRequest, NextResponse } from 'next/server';
import { generateReferralCode, generateReferralCodeFingerprint } from '@/src/utils/referral.util';
import prisma from '@/src/utils/prismaOrm.util';
import { UserRole } from '@/generated/prisma';

// Helper function to get CORS headers
function getCorsHeaders(origin: string | null) {
  // Allow multiple origins for testing and production
  const allowedOrigins = [
    'https://mumbies-staging.myshopify.com/',
    'null', // For local file testing
  ];

  // Check if origin is allowed or if it's a myshopify.com domain
  const isAllowed =
    origin && (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.myshopify.com')
    );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  try {
    const rawBody = await request.text();
    const data = JSON.parse(rawBody);
    const { ts, fts, mrc, sg, eventId, email } = data;

    if (!ts || !fts || !mrc || !sg || !eventId || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate signature
    let validSignature = false;
    try {
      const expectedSg = generateReferralCodeFingerprint(ts, mrc);
      validSignature = sg === expectedSg;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }
    if (!validSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401, headers: corsHeaders }
      );
    }

    // If ts & fts differ by more than 5 minutes, reject
    const timeDifference = Math.abs(ts - fts);
    if (timeDifference > 300000) {
      return NextResponse.json(
        { success: false, message: 'Timestamp difference too large' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find referer by referral code (mrc)
    const referer = await prisma.user.findFirst({ where: { referralCode: mrc } });
    if (!referer) {
      return NextResponse.json(
        { success: false, message: 'Referer not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Find user by email
    let user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      // If user already has referer, do nothing
      if (user.referrerId) {
        return NextResponse.json(
          { success: true, message: 'User already has referer', data: { refererCode: referer.referralCode } },
          { status: 200, headers: corsHeaders }
        );
      }
      // Set refererId to referer's id
      await prisma.user.update({ where: { email }, data: { referrerId: referer.id } });
      // Create a referral log for this assignment
      try {
        const updatedUser = await prisma.user.findUnique({ where: { email } });
        if (updatedUser) {
          await prisma.referralLog.create({ data: { userId: updatedUser.id, codeUsed: mrc, refererId: referer.id } });
        }
      } catch (err) {
        console.error('Failed to create ReferralLog for existing user:', err);
      }
      // Increment referer's referred user count
      try {
        await prisma.user.update({ where: { id: referer.id }, data: { totalReferredUsers: { increment: 1 } } });
      } catch (err) {
        console.error('Failed to increment referer totalReferredUsers:', err);
      }
      return NextResponse.json(
        { success: true, message: 'Referer set for user', data: { refererCode: referer.referralCode } },
        { status: 200, headers: corsHeaders }
      );
    }

    let referralCode = generateReferralCode();
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.user.findFirst({
        where: { referralCode },
      });

      if (!existing) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Create user with refererId
    const createdUser = await prisma.user.create({
      data: {
        email,
        role: UserRole.CUSTOMER, // Default role
        referralCode: referralCode,
        referrerId: referer.id,
        enabled: true,
      },
    });
    // Create referral log and increment referer's referred user count
    try {
      await prisma.referralLog.create({ data: { userId: createdUser.id, codeUsed: mrc, refererId: referer.id } });
    } catch (err) {
      console.error('Failed to create ReferralLog after user create:', err);
    }
    try {
      await prisma.user.update({ where: { id: referer.id }, data: { totalReferredUsers: { increment: 1 } } });
    } catch (err) {
      console.error('Failed to increment referer totalReferredUsers after create:', err);
    }
    return NextResponse.json(
      { success: true, message: 'User created with referer', data: { refererCode: referer.referralCode } },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing webhook' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS for preflight OPTIONS requests (important for browser-based testing or pixels)
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}