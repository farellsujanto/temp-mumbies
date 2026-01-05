import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List referral earnings logs
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [logs, total] = await Promise.all([
      prisma.referralEarningsLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          referer: {
            select: {
              id: true,
              name: true,
              email: true,
              referralCode: true,
              partnerTag: true,
            }
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.referralEarningsLog.count(),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Referral earnings logs retrieved successfully',
      data: {
        logs,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get referral earnings logs error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve referral earnings logs',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
