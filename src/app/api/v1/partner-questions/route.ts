import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';

// GET - List all enabled partner application questions (public)
export async function GET(request: NextRequest) {
  try {
    const questions = await prisma.partnerApplicationQuestion.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        placeholder: true,
        required: true,
        order: true,
      },
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
}
