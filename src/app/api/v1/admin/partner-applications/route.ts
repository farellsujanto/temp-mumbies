import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole, ApprovalStatus } from '@/generated/prisma/client';

// GET - List all partner applications
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { enabled: true };
    if (status && ['PENDING', 'ACCEPTED', 'DECLINED'].includes(status)) {
      where.approvalStatus = status as ApprovalStatus;
    }

    const [applications, total] = await Promise.all([
      prisma.partnerApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              partnerTagId: true,
              partnerTag: true,
            }
          },
          answers: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.partnerApplication.count({ where }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner applications retrieved successfully',
      data: {
        applications,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get partner applications error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve partner applications',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update partner application (Accept/Decline)
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, approvalStatus, partnerTagId } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Application ID is required',
        data: null,
      }, { status: 400 });
    }

    if (!approvalStatus || !['ACCEPTED', 'DECLINED'].includes(approvalStatus)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Valid approval status (ACCEPTED/DECLINED) is required',
        data: null,
      }, { status: 400 });
    }

    // Get the application with user info
    const application = await prisma.partnerApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Application not found',
        data: null,
      }, { status: 404 });
    }

    // If accepting, require partnerTagId
    if (approvalStatus === 'ACCEPTED' && !partnerTagId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Partner tag is required when accepting an application',
        data: null,
      }, { status: 400 });
    }

    // Update application and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update application status
      const updatedApplication = await tx.partnerApplication.update({
        where: { id },
        data: {
          approvalStatus,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              partnerTagId: true,
              partnerTag: true,
            }
          },
          answers: true,
        },
      });

      // If accepted, update user role to PARTNER and assign tag
      if (approvalStatus === 'ACCEPTED') {
        await tx.user.update({
          where: { id: application.userId },
          data: {
            role: UserRole.PARTNER,
            partnerTagId: partnerTagId,
          },
        });
      }

      return updatedApplication;
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Application ${approvalStatus.toLowerCase()} successfully`,
      data: result,
    });
  } catch (error: any) {
    console.error('Update partner application error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Application not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update application',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
