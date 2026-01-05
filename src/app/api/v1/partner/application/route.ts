import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// POST - Submit partner application
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { instagramUrl, tiktokUrl, facebookUrl, youtubeUrl, answers } = body;
    const userId = user.userId;

    // Check if user already has a pending or accepted application
    const existingApplication = await prisma.partnerApplication.findFirst({
      where: {
        userId,
        approvalStatus: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (existingApplication) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: existingApplication.approvalStatus === 'ACCEPTED' 
          ? 'You are already a partner' 
          : 'You already have a pending application',
        data: null,
      }, { status: 400 });
    }

    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Please answer all required questions',
        data: null,
      }, { status: 400 });
    }

    // Create application with answers
    const application = await prisma.partnerApplication.create({
      data: {
        userId,
        instagramUrl: instagramUrl || null,
        tiktokUrl: tiktokUrl || null,
        facebookUrl: facebookUrl || null,
        youtubeUrl: youtubeUrl || null,
        approvalStatus: 'PENDING',
        answers: {
          create: answers.map((answer: { question: string; answer: string }) => ({
            question: answer.question,
            answer: answer.answer,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner application submitted successfully',
      data: application,
    }, { status: 201 });
  } catch (error) {
    console.error('Submit partner application error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to submit partner application',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.CUSTOMER, UserRole.PARTNER]);
