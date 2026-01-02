import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';

// GET - List all tags
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      where: { enabled: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Tags retrieved successfully',
      data: tags,
    });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve tags',
      data: null,
    }, { status: 500 });
  }
}

// POST - Create tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Name and slug are required',
        data: null,
      }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Tag created successfully',
      data: tag,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create tag error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Tag with this name or slug already exists',
        data: null,
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create tag',
      data: null,
    }, { status: 500 });
  }
}

// PATCH - Update tag
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, enabled } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Tag ID is required',
        data: null,
      }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(enabled !== undefined && { enabled }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Tag updated successfully',
      data: tag,
    });
  } catch (error: any) {
    console.error('Update tag error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Tag not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update tag',
      data: null,
    }, { status: 500 });
  }
}

// DELETE - Delete tag
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Tag ID is required',
        data: null,
      }, { status: 400 });
    }

    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Tag deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete tag error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Tag not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete tag',
      data: null,
    }, { status: 500 });
  }
}
