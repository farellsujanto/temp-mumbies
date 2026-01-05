import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

// GET - List all products with relations
export const GET = withAuth(async (request: NextRequest) => {
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
}, [UserRole.ADMIN]);

// POST - Create product
export const POST = withAuth(async (request: NextRequest) => {
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

    if (!title || !slug) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Title and slug are required',
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
        referralPercentage: referralPercentage || 0,
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
}, [UserRole.ADMIN]);

// PATCH - Update product
export const PATCH = withAuth(async (request: NextRequest) => {
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
      // Fetch existing variants to compare
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId: id },
        include: { childVariants: true },
      });

      // Track processed variant IDs to know which to delete
      const processedVariantIds = new Set<number>();

      // Create new variants and update existing ones
      if (variants.length > 0) {
        for (const parentVariant of variants) {
          // Check if this is a standalone variant (no parent, no children)
          if (parentVariant.isStandalone) {
            // Find existing standalone variant by SKU or title
            const existingSku = parentVariant.sku ? 
              existingVariants.find(v => v.sku === parentVariant.sku && !v.parentVariantId) : null;
            const existingTitle = existingVariants.find(v => 
              v.title === parentVariant.title && !v.parentVariantId && !v.sku
            );
            const existing = existingSku || existingTitle;

            const variantData = {
              productId: id,
              parentVariantId: null,
              title: parentVariant.title,
              sku: parentVariant.sku || null,
              price: parentVariant.price || 0,
              discountedPrice: parentVariant.discountedPrice || null,
              inventoryQuantity: parentVariant.inventoryQuantity || 0,
              available: parentVariant.available ?? true,
              referralPercentage: parentVariant.referralPercentage ?? (existing?.referralPercentage || 0),
              position: parentVariant.position || 1,
            };

            if (existing) {
              // Update existing variant
              await prisma.productVariant.update({
                where: { id: existing.id },
                data: variantData,
              });
              processedVariantIds.add(existing.id);
            } else {
              // Create new variant
              const created = await prisma.productVariant.create({
                data: variantData,
              });
              processedVariantIds.add(created.id);
            }
          } else {
            // Find existing parent variant by title
            const existingParent = existingVariants.find(v => 
              v.title === parentVariant.title && !v.parentVariantId && !v.sku
            );

            let parentVariantId: number;
            
            if (existingParent) {
              // Update existing parent
              await prisma.productVariant.update({
                where: { id: existingParent.id },
                data: {
                  title: parentVariant.title,
                  referralPercentage: parentVariant.referralPercentage ?? existingParent.referralPercentage,
                  position: parentVariant.position || 1,
                },
              });
              parentVariantId = existingParent.id;
              processedVariantIds.add(existingParent.id);
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
                  referralPercentage: parentVariant.referralPercentage ?? 0,
                  position: parentVariant.position || 1,
                },
              });
              parentVariantId = createdParent.id;
              processedVariantIds.add(parentVariantId);
            }

            // Handle child variants
            if (parentVariant.children && parentVariant.children.length > 0) {
              for (const child of parentVariant.children) {
                // Find existing child by SKU or title under this parent
                const existingChildBySku = child.sku ?
                  existingVariants.find(v => v.sku === child.sku) : null;
                const existingChildByTitle = existingParent?.childVariants?.find(v => 
                  v.title === child.title
                );
                const existingChild = existingChildBySku || existingChildByTitle;

                const childData = {
                  productId: id,
                  parentVariantId: parentVariantId,
                  title: child.title,
                  sku: child.sku || null,
                  price: child.price || 0,
                  discountedPrice: child.discountedPrice || null,
                  inventoryQuantity: child.inventoryQuantity || 0,
                  available: child.available ?? true,
                  referralPercentage: child.referralPercentage ?? (existingChild?.referralPercentage || 0),
                  position: 1,
                };

                if (existingChild) {
                  // Update existing child
                  await prisma.productVariant.update({
                    where: { id: existingChild.id },
                    data: childData,
                  });
                  processedVariantIds.add(existingChild.id);
                } else {
                  // Create new child
                  const created = await prisma.productVariant.create({
                    data: childData,
                  });
                  processedVariantIds.add(created.id);
                }
              }
            }
          }
        }
      }

      // Delete variants that weren't processed (removed from the update)
      const variantsToDelete = existingVariants
        .filter(v => !processedVariantIds.has(v.id))
        .map(v => v.id);
      
      if (variantsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        });
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
}, [UserRole.ADMIN]);

// DELETE - Delete product
export const DELETE = withAuth(async (request: NextRequest) => {
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
}, [UserRole.ADMIN]);
