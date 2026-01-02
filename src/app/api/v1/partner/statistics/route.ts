import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';
import { maskEmail } from '@/src/utils/maskEmail.util';

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Get partner data with referred users
    const partner = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        totalReferralEarnings: true,
        withdrawableBalance: true,
        totalReferredUsers: true,
        referralLogsReceived: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!partner) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner not found',
        data: null,
      }, { status: 404 });
    }

    // Build referral URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const referralUrl = `${baseUrl}/redirects/ref-redirect/${partner.referralCode}`;

    // Process referred users with masked emails
    const referredUsers = partner.referralLogsReceived.map((log) => ({
      id: log.user.id,
      name: log.user.name,
      email: maskEmail(log.user.email),
      joinedAt: log.createdAt,
    }));

    // Remove duplicate users (in case same user used code multiple times)
    const uniqueReferredUsers = referredUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner statistics retrieved successfully',
      data: {
        referralCode: partner.referralCode,
        referralUrl,
        totalReferralEarnings: Number(partner.totalReferralEarnings),
        withdrawableBalance: Number(partner.withdrawableBalance),
        totalReferredUsers: partner.totalReferredUsers,
        referredUsers: uniqueReferredUsers,
      },
    });
  } catch (error) {
    console.error('Get partner statistics error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve partner statistics',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.PARTNER]);
