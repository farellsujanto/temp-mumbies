import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all categories
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
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
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve categories',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// POST - Create category
export const POST = withAuth(async (request: NextRequest) => {
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

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Category created successfully',
      data: category,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Category with this name or slug already exists',
        data: null,
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create category',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update category
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, name, slug, description, enabled } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Category ID is required',
        data: null,
      }, { status: 400 });
    }

    const category = await prisma.category.update({
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
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Category not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update category',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// DELETE - Delete category
export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Category ID is required',
        data: null,
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Category not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete category',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
