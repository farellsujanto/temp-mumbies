import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all partner tags
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const partnerTags = await prisma.partnerTag.findMany({
      where: { enabled: true },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner tags retrieved successfully',
      data: partnerTags,
    });
  } catch (error) {
    console.error('Get partner tags error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve partner tags',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// POST - Create partner tag
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, referralPercentage } = body;

    if (!name) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Name is required',
        data: null,
      }, { status: 400 });
    }

    const partnerTag = await prisma.partnerTag.create({
      data: {
        name,
        referralPercentage: referralPercentage || 0,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner tag created successfully',
      data: partnerTag,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create partner tag error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag with this name already exists',
        data: null,
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create partner tag',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update partner tag
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, name, referralPercentage, enabled } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag ID is required',
        data: null,
      }, { status: 400 });
    }

    const partnerTag = await prisma.partnerTag.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(referralPercentage !== undefined && { referralPercentage }),
        ...(enabled !== undefined && { enabled }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner tag updated successfully',
      data: partnerTag,
    });
  } catch (error: any) {
    console.error('Update partner tag error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update partner tag',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// DELETE - Delete partner tag
export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag ID is required',
        data: null,
      }, { status: 400 });
    }

    await prisma.partnerTag.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner tag deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete partner tag error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete partner tag',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
