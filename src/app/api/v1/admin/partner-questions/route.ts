import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all partner application questions
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const questions = await prisma.partnerApplicationQuestion.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner questions retrieved successfully',
      data: questions,
    });
  } catch (error) {
    console.error('Get partner questions error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve partner questions',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// POST - Create partner application question
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { question, placeholder, required } = body;

    if (!question) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question is required',
        data: null,
      }, { status: 400 });
    }

    // Get the highest order number and add 1
    const maxOrder = await prisma.partnerApplicationQuestion.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const partnerQuestion = await prisma.partnerApplicationQuestion.create({
      data: {
        question,
        placeholder: placeholder || null,
        required: required !== undefined ? required : true,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner question created successfully',
      data: partnerQuestion,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create partner question error:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create partner question',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update partner application question
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, question, placeholder, required, enabled, newOrder } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question ID is required',
        data: null,
      }, { status: 400 });
    }

    // Handle reordering
    if (newOrder !== undefined) {
      const currentQuestion = await prisma.partnerApplicationQuestion.findUnique({
        where: { id },
      });

      if (!currentQuestion) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Question not found',
          data: null,
        }, { status: 404 });
      }

      const oldOrder = currentQuestion.order;

      // Update orders of affected questions
      if (newOrder > oldOrder) {
        // Moving down: decrease order of questions in between
        await prisma.partnerApplicationQuestion.updateMany({
          where: {
            order: { gt: oldOrder, lte: newOrder },
            id: { not: id },
          },
          data: { order: { decrement: 1 } },
        });
      } else if (newOrder < oldOrder) {
        // Moving up: increase order of questions in between
        await prisma.partnerApplicationQuestion.updateMany({
          where: {
            order: { gte: newOrder, lt: oldOrder },
            id: { not: id },
          },
          data: { order: { increment: 1 } },
        });
      }

      // Update the question's order
      await prisma.partnerApplicationQuestion.update({
        where: { id },
        data: { order: newOrder },
      });
    }

    const partnerQuestion = await prisma.partnerApplicationQuestion.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(placeholder !== undefined && { placeholder }),
        ...(required !== undefined && { required }),
        ...(enabled !== undefined && { enabled }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner question updated successfully',
      data: partnerQuestion,
    });
  } catch (error: any) {
    console.error('Update partner question error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update partner question',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// DELETE - Delete partner application question
export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question ID is required',
        data: null,
      }, { status: 400 });
    }

    const question = await prisma.partnerApplicationQuestion.findFirst({
      where: { id: parseInt(id) },
    });

    if (!question) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question not found',
        data: null,
      }, { status: 404 });
    }

    await prisma.partnerApplicationQuestion.delete({
      where: { id: parseInt(id) },
    });

    // Reorder remaining questions
    await prisma.partnerApplicationQuestion.updateMany({
      where: { order: { gt: question.order } },
      data: { order: { decrement: 1 } },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Partner question deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete partner question error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Question not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete partner question',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
