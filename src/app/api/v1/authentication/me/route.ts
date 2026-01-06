import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - Get current authenticated user info
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userId = user.userId;

    // Fetch user details from database
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        totalReferralEarnings: true,
        withdrawableBalance: true,
        totalReferredUsers: true,
        partnerTagId: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'User not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'User info retrieved successfully',
      data: userData,
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch user info error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch user info',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PARTNER]);
