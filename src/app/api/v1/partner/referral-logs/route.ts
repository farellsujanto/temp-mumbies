import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';
import { maskEmail } from '@/src/utils/maskEmail.util';

// GET - Get referral earnings logs for the partner
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userId = user.userId;

    // Fetch referral earnings logs where this user is the referer
    const logs = await prisma.referralEarningsLog.findMany({
      where: {
        refererId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mask emails in the response
    const maskedLogs = logs.map(log => ({
      ...log,
      user: {
        ...log.user,
        email: maskEmail(log.user.email),
      },
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Referral logs retrieved successfully',
      data: maskedLogs,
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch referral logs error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch referral logs',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.PARTNER]);
