import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';

// GET - List all products with relations
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { enabled: true },
      include: {
        vendor: true,
        productType: true,
        variants: {
          where: { parentVariantId: null }, // Only get parent variants
          include: {
            childVariants: true, // Include child variants
          },
          orderBy: { position: 'asc' },
        },
        category: true,
        tag: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to retrieve products',
      data: null,
    }, { status: 500 });
  }
}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      vendorId,
      productTypeId,
      categoryId,
      tagId,
      price,
      discountedPrice,
      sku,
      inventoryQuantity,
      referralPercentage,
      images,
      published,
      variants,
    } = body;

    if (!title || !slug || !categoryId || !tagId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Title, slug, category, and tag are required',
        data: null,
      }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || null,
        categoryId,
        tagId,
        vendorId: vendorId || null,
        productTypeId: productTypeId || null,
        price: price || null,
        discountedPrice: discountedPrice || null,
        sku: sku || null,
        inventoryQuantity: inventoryQuantity || null,
        referralPercentage: referralPercentage || 10.0,
        images: images || [],
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
      include: {
        vendor: true,
        productType: true,
        variants: {
          include: {
            childVariants: true,
          },
        },
      },
    });

    // Create hierarchical variants if provided
    if (variants && variants.length > 0) {
      for (const parentVariant of variants) {
        const createdParent = await prisma.productVariant.create({
          data: {
            productId: product.id,
            title: parentVariant.title,
            parentVariantId: null,
            price: null, // Parent variants don't have prices
            position: parentVariant.position || 1,
          },
        });

        // Create child variants
        if (parentVariant.children && parentVariant.children.length > 0) {
          for (const childVariant of parentVariant.children) {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                parentVariantId: createdParent.id,
                title: childVariant.title,
                sku: childVariant.sku || null,
                price: childVariant.price,
                discountedPrice: childVariant.discountedPrice || null,
                inventoryQuantity: childVariant.inventoryQuantity || 0,
                available: childVariant.available !== undefined ? childVariant.available : true,
                images: childVariant.images || [],
                weight: childVariant.weight || null,
                requiresShipping: childVariant.requiresShipping !== undefined ? childVariant.requiresShipping : true,
                taxable: childVariant.taxable !== undefined ? childVariant.taxable : true,
                position: childVariant.position || 1,
              },
            });
          }
        }
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product created successfully',
      data: product,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Product with this slug already exists',
        data: null,
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create product',
      data: null,
    }, { status: 500 });
  }
}

// PATCH - Update product
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, variants, ...updateData } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Product ID is required',
        data: null,
      }, { status: 400 });
    }

    // Update product basic info
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        vendor: true,
        productType: true,
        variants: {
          include: {
            childVariants: true,
          },
        },
      },
    });

    // Handle variants if provided
    if (variants !== undefined) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      });

      // Create new variants
      if (variants.length > 0) {
        for (const parentVariant of variants) {
          // Check if this is a standalone variant
          if (parentVariant.isStandalone && parentVariant.children && parentVariant.children.length > 0) {
            const child = parentVariant.children[0];
            await prisma.productVariant.create({
              data: {
                productId: id,
                parentVariantId: null,
                title: child.title,
                sku: child.sku,
                price: child.price || 0,
                discountedPrice: child.discountedPrice || null,
                inventoryQuantity: child.inventoryQuantity || 0,
                available: child.available ?? true,
                referralPercentage: 10.0,
                position: parentVariant.position || 1,
              }
            });
          } else {
            // Create parent variant
            const createdParent = await prisma.productVariant.create({
              data: {
                productId: id,
                title: parentVariant.title,
                parentVariantId: null,
                price: null,
                sku: null,
                inventoryQuantity: 0,
                available: true,
                referralPercentage: 0,
                position: parentVariant.position || 1,
              }
            });

            // Create child variants
            if (parentVariant.children && parentVariant.children.length > 0) {
              for (const child of parentVariant.children) {
                await prisma.productVariant.create({
                  data: {
                    productId: id,
                    parentVariantId: createdParent.id,
                    title: child.title,
                    sku: child.sku,
                    price: child.price || 0,
                    discountedPrice: child.discountedPrice || null,
                    inventoryQuantity: child.inventoryQuantity || 0,
                    available: child.available ?? true,
                    referralPercentage: 10.0,
                    position: 1,
                  }
                });
              }
            }
          }
        }
      }
    }

    // Fetch updated product with variants
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
        productType: true,
        variants: {
          include: {
            childVariants: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Product not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update product',
      data: null,
    }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Product ID is required',
        data: null,
      }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product deleted successfully',
      data: null,
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Product not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to delete product',
      data: null,
    }, { status: 500 });
  }
}
