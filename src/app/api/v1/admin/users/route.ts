import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all users
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = { enabled: true };
    
    if (role && ['ADMIN', 'CUSTOMER', 'PARTNER'].includes(role)) {
      where.role = role as UserRole;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { referralCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          partnerTag: true,
          _count: {
            select: {
              referredUsers: true,
              partnerApplications: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve users',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update user
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, role, partnerTagId } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'User ID is required',
        data: null,
      }, { status: 400 });
    }

    // Validate role if provided
    if (role && !['ADMIN', 'CUSTOMER', 'PARTNER'].includes(role)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid role. Must be ADMIN, CUSTOMER, or PARTNER',
        data: null,
      }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (role !== undefined) {
      updateData.role = role;
    }

    if (partnerTagId !== undefined) {
      updateData.partnerTagId = partnerTagId === null ? null : partnerTagId;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        partnerTag: true,
        _count: {
          select: {
            referredUsers: true,
            partnerApplications: true,
          }
        }
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'User not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update user',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
