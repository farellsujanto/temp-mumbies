import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all vendors
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const vendors = await prisma.vendor.findMany({
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
      message: 'Vendors retrieved successfully',
      data: vendors,
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve vendors',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// POST - Create vendor
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

    const vendor = await prisma.vendor.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Vendor created successfully',
      data: vendor,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Vendor with this name or slug already exists',
        data: null,
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create vendor',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// PATCH - Update vendor
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, name, slug, description, enabled } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Vendor ID is required',
        data: null,
      }, { status: 400 });
    }

    const vendor = await prisma.vendor.update({
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
      message: 'Vendor updated successfully',
      data: vendor,
    });
  } catch (error: any) {
    console.error('Update vendor error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Vendor not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update vendor',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);

// DELETE - Delete vendor
export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Vendor ID is required',
        data: null,
      }, { status: 400 });
    }

    await prisma.vendor.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Vendor deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete vendor error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Vendor not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete vendor',
      data: null,
    }, { status: 500 });
  }
}, [UserRole.ADMIN]);
