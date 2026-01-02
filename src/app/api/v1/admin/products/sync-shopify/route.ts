import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';

export async function POST(request: NextRequest) {
  try {
    const SHOPIFY_PRODUCTS_JSON_URL = process.env.MUMBIES_SHOPIFY_PRODUCT_JSON_URL;
    const SHOPIFY_ACCESS_TOKEN = process.env.MUMBIES_SHOPIFY_ACCESS_TOKEN;

    if (!SHOPIFY_PRODUCTS_JSON_URL || !SHOPIFY_ACCESS_TOKEN) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Shopify credentials not configured. Please set SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN in .env',
        data: null,
      }, { status: 400 });
    }

    // Fetch products from Shopify
    const response = await fetch(SHOPIFY_PRODUCTS_JSON_URL, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const shopifyData = await response.json();
    const products = shopifyData.products || [];

    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;

    for (const shopifyProduct of products) {
      try {
        // Check if product exists
        const existingProduct = await prisma.product.findFirst({
          where: { shopifyProductId: shopifyProduct.id.toString() },
        });

        // Try to find vendor by name if vendor is provided
        let vendorId = null;
        if (shopifyProduct.vendor) {
          const vendor = await prisma.vendor.findFirst({
            where: { 
              name: {
                equals: shopifyProduct.vendor,
                mode: 'insensitive'
              }
            }
          });
          if (vendor) {
            vendorId = vendor.id;
          }
        }

        // Try to find tag by name if tags are provided
        let tagId = null;
        if (shopifyProduct.tags) {
          // Shopify tags are comma-separated
          const tagNames = shopifyProduct.tags.split(',').map((t: string) => t.trim());
          if (tagNames.length > 0) {
            // Try to match the first tag
            const tag = await prisma.tag.findFirst({
              where: { 
                name: {
                  equals: tagNames[0],
                  mode: 'insensitive'
                }
              }
            });
            if (tag) {
              tagId = tag.id;
            }
          }
        }

        // Get first available category (or you can set a default)
        let categoryId = null;
        if (shopifyProduct.product_type) {
          // Try to match category by product_type
          const category = await prisma.category.findFirst({
            where: { 
              name: {
                equals: shopifyProduct.product_type,
                mode: 'insensitive'
              }
            }
          });
          if (category) {
            categoryId = category.id;
          }
        }
        
        // If no category found, get the first available category
        if (!categoryId) {
          const firstCategory = await prisma.category.findFirst({
            where: { enabled: true }
          });
          if (firstCategory) {
            categoryId = firstCategory.id;
          }
        }

        // Get first available tag if not matched
        if (!tagId) {
          const firstTag = await prisma.tag.findFirst({
            where: { enabled: true }
          });
          if (firstTag) {
            tagId = firstTag.id;
          }
        }

        // Prepare product data
        const productData: any = {
          title: shopifyProduct.title,
          slug: shopifyProduct.handle,
          description: shopifyProduct.body_html || null,
          images: shopifyProduct.images?.map((img: any) => img.src) || [],
          published: shopifyProduct.status === 'active',
          publishedAt: shopifyProduct.published_at ? new Date(shopifyProduct.published_at) : null,
          shopifyProductId: shopifyProduct.id.toString(),
        };

        // Add optional relations if found
        if (vendorId) productData.vendorId = vendorId;
        if (categoryId) productData.categoryId = categoryId;
        if (tagId) productData.tagId = tagId;

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: productData,
          });
          updatedCount++;
        } else {
          // Create new product
          await prisma.product.create({
            data: productData,
          });
          createdCount++;
        }

        // Sync variants with hierarchical structure
        if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
          const productId = existingProduct?.id || (await prisma.product.findFirst({
            where: { shopifyProductId: shopifyProduct.id.toString() }
          }))?.id;

          if (!productId) continue;

          // Delete existing variants for clean sync
          await prisma.productVariant.deleteMany({
            where: { productId }
          });

          // Check if product has multiple option levels
          const hasMultipleOptions = shopifyProduct.options && shopifyProduct.options.length > 1;

          if (hasMultipleOptions && shopifyProduct.options.length === 2) {
            // Two-level variant structure (e.g., Size -> Package options)
            const option1Values = shopifyProduct.options[0]?.values || [];
            
            // Group variants by option1 (first level - parent variants)
            const variantGroups = new Map<string, any[]>();
            
            for (const shopifyVariant of shopifyProduct.variants) {
              const option1 = shopifyVariant.option1 || 'Default';
              if (!variantGroups.has(option1)) {
                variantGroups.set(option1, []);
              }
              variantGroups.get(option1)!.push(shopifyVariant);
            }

            // Create hierarchical variants
            for (const [option1Value, childVariantData] of variantGroups) {
              // If only 1 variant in this group, treat it as a standalone child variant (not a parent)
              if (childVariantData.length === 1) {
                const singleVariant = childVariantData[0];
                await prisma.productVariant.create({
                  data: {
                    productId,
                    parentVariantId: null,
                    title: singleVariant.title,
                    sku: singleVariant.sku || null,
                    // Use price and compare_at_price directly
                    discountedPrice: singleVariant.price ? parseFloat(singleVariant.price) : 0,
                    price: singleVariant.compare_at_price ? parseFloat(singleVariant.compare_at_price) : null,
                    available: singleVariant.available ?? true,
                    inventoryQuantity: singleVariant.inventory_quantity || 0,
                    weight: singleVariant.grams || null,
                    requiresShipping: singleVariant.requires_shipping ?? true,
                    taxable: singleVariant.taxable ?? true,
                    images: [],
                    shopifyVariantId: singleVariant.id.toString(),
                    referralPercentage: 10.0,
                    position: singleVariant.position || 1,
                  }
                });
                continue;
              }

              // Create parent variant (option1 level) for multiple children
              const parentVariant = await prisma.productVariant.create({
                data: {
                  productId,
                  title: option1Value,
                  parentVariantId: null,
                  price: null, // Parent variants don't have prices
                  discountedPrice: null,
                  sku: null,
                  available: true,
                  inventoryQuantity: 0,
                  images: [],
                  referralPercentage: 0,
                  position: option1Values.indexOf(option1Value) + 1 || 1,
                }
              });

              // Create child variants (option2 level)
              for (const shopifyVariant of childVariantData) {
                await prisma.productVariant.create({
                  data: {
                    productId,
                    parentVariantId: parentVariant.id,
                    title: shopifyVariant.option2 || shopifyVariant.title,
                    sku: shopifyVariant.sku || null,
                    discountedPrice: shopifyVariant.price ? parseFloat(shopifyVariant.price) : 0,
                    price: shopifyVariant.compare_at_price ? parseFloat(shopifyVariant.compare_at_price) : null,
                    available: shopifyVariant.available ?? true,
                    inventoryQuantity: shopifyVariant.inventory_quantity || 0,
                    weight: shopifyVariant.grams || null,
                    requiresShipping: shopifyVariant.requires_shipping ?? true,
                    taxable: shopifyVariant.taxable ?? true,
                    images: [],
                    shopifyVariantId: shopifyVariant.id.toString(),
                    referralPercentage: 10.0, // Default referral percentage
                    position: shopifyVariant.position || 1,
                  }
                });
              }
            }
          } else {
            // Single-level variants (no parent-child structure)
            for (const shopifyVariant of shopifyProduct.variants) {
              await prisma.productVariant.create({
                data: {
                  productId,
                  parentVariantId: null,
                  title: shopifyVariant.option1 || shopifyVariant.title,
                  sku: shopifyVariant.sku || null,
                  discountedPrice: shopifyVariant.price ? parseFloat(shopifyVariant.price) : 0,
                  price: shopifyVariant.compare_at_price ? parseFloat(shopifyVariant.compare_at_price) : null,
                  available: shopifyVariant.available ?? true,
                  inventoryQuantity: shopifyVariant.inventory_quantity || 0,
                  weight: shopifyVariant.grams || null,
                  requiresShipping: shopifyVariant.requires_shipping ?? true,
                  taxable: shopifyVariant.taxable ?? true,
                  images: [],
                  shopifyVariantId: shopifyVariant.id.toString(),
                  referralPercentage: 10.0, // Default referral percentage
                  position: shopifyVariant.position || 1,
                }
              });
            }
          }
        }

        syncedCount++;
      } catch (error) {
        console.error(`Error syncing product ${shopifyProduct.id}:`, error);
        // Continue with next product
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Successfully synced ${syncedCount} products from Shopify`,
      data: {
        total: syncedCount,
        created: createdCount,
        updated: updatedCount,
      },
    });
  } catch (error: any) {
    console.error('Shopify sync error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: `Failed to sync with Shopify: ${error.message}`,
      data: null,
    }, { status: 500 });
  }
}
