import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { withAuth } from '@/src/middleware/auth.middleware';
import { UserRole } from '@/generated/prisma/client';

export const POST = withAuth(async (request: NextRequest) => {
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

    // Prefetch all vendors, categories, and tags for faster lookups
    const [allVendors, allCategories, allTags, existingProducts] = await Promise.all([
      prisma.vendor.findMany({ select: { id: true, name: true } }),
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.tag.findMany({ select: { id: true, name: true } }),
      prisma.product.findMany({ select: { id: true, shopifyProductId: true } }),
    ]);

    // Create lookup maps for faster matching
    const vendorMap = new Map(allVendors.map(v => [v.name.toLowerCase(), v.id]));
    const categoryMap = new Map(allCategories.map(c => [c.name.toLowerCase(), c.id]));
    const tagMap = new Map(allTags.map(t => [t.name.toLowerCase(), t.id]));
    const existingProductMap = new Map(existingProducts.map(p => [p.shopifyProductId || '', p.id]));

    // Process products in batches to avoid transaction timeouts
    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    
    const BATCH_SIZE = 5; // Process 5 products at a time
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      
      // Process each batch in its own transaction
      const batchResult = await prisma.$transaction(async (tx) => {
        let batchSynced = 0;
        let batchCreated = 0;
        let batchUpdated = 0;

        const syncProduct = async (shopifyProduct: any) => {
        const shopifyProductId = shopifyProduct.id.toString();
        const existingProductId = existingProductMap.get(shopifyProductId);

        // Try to find vendor by exact name match (case-insensitive)
        let vendorId = null;
        if (shopifyProduct.vendor) {
          vendorId = vendorMap.get(shopifyProduct.vendor.toLowerCase()) || null;
        }

        // Try to find category by exact product_type match (case-insensitive)
        let categoryId = null;
        if (shopifyProduct.product_type) {
          categoryId = categoryMap.get(shopifyProduct.product_type.toLowerCase()) || null;
        }

        // Try to find tag by exact name match (case-insensitive)
        let tagId = null;
        if (shopifyProduct.tags) {
          const tagNames = shopifyProduct.tags.split(',').map((t: string) => t.trim());
          for (const tagName of tagNames) {
            const matchedTagId = tagMap.get(tagName.toLowerCase());
            if (matchedTagId) {
              tagId = matchedTagId;
              break; // Use first matching tag
            }
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
          shopifyProductId: shopifyProductId,
        };

        // Add optional vendor if found
        if (vendorId) productData.vendorId = vendorId;
        // Add optional category if found
        if (categoryId) productData.categoryId = categoryId;
        // Add optional tag if found
        if (tagId) productData.tagId = tagId;

        let productId: number;
        let isUpdate = false;

        if (existingProductId) {
          // Update existing product
          await tx.product.update({
            where: { id: existingProductId },
            data: productData,
          });
          productId = existingProductId;
          isUpdate = true;
        } else {
          // Create new product
          const newProduct = await tx.product.create({
            data: productData,
          });
          productId = newProduct.id;
        }

        // Sync variants with hierarchical structure using transaction
        if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
          // Fetch existing variants to compare and update
          const existingVariants = await tx.productVariant.findMany({
            where: { productId },
            select: { 
              id: true, 
              sku: true, 
              shopifyVariantId: true, 
              referralPercentage: true,
              parentVariantId: true,
              title: true
            }
          });
          
          // Create maps for quick lookup
          const variantBySku = new Map(existingVariants.filter(v => v.sku).map(v => [v.sku!, v]));
          const variantByShopifyId = new Map(existingVariants.map(v => [v.shopifyVariantId || '', v]));
          const processedVariantIds = new Set<number>();

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

            // Process hierarchical variants
            for (const [option1Value, childVariantData] of variantGroups) {
              // If only 1 variant in this group, treat it as a standalone child variant (not a parent)
              if (childVariantData.length === 1) {
                const singleVariant = childVariantData[0];
                const shopifyVariantId = singleVariant.id.toString();
                const sku = singleVariant.sku;
                
                // Try to find existing variant by SKU or shopifyVariantId
                const existing = (sku && variantBySku.get(sku)) || variantByShopifyId.get(shopifyVariantId);

                const variantData = {
                  productId,
                  parentVariantId: null,
                  title: singleVariant.title,
                  sku: sku || null,
                  discountedPrice: singleVariant.price ? parseFloat(singleVariant.price) : 0,
                  price: singleVariant.compare_at_price ? parseFloat(singleVariant.compare_at_price) : null,
                  available: singleVariant.available ?? true,
                  inventoryQuantity: singleVariant.inventory_quantity || 0,
                  weight: singleVariant.grams || null,
                  requiresShipping: singleVariant.requires_shipping ?? true,
                  taxable: singleVariant.taxable ?? true,
                  images: [],
                  shopifyVariantId: shopifyVariantId,
                  position: singleVariant.position || 1,
                };

                if (existing) {
                  // Update existing variant (preserves referralPercentage)
                  await tx.productVariant.update({
                    where: { id: existing.id },
                    data: variantData,
                  });
                  processedVariantIds.add(existing.id);
                } else {
                  // Create new variant
                  const created = await tx.productVariant.create({
                    data: { ...variantData, referralPercentage: 0 },
                  });
                  processedVariantIds.add(created.id);
                }
              } else {
                // Handle parent-child structure
                // Find or create parent variant
                const parentTitle = option1Value;
                const existingParent = existingVariants.find(v => 
                  v.title === parentTitle && v.parentVariantId === null && !v.sku
                );

                let parentVariantId: number;
                if (existingParent) {
                  parentVariantId = existingParent.id;
                  processedVariantIds.add(existingParent.id);
                } else {
                  const parentVariant = await tx.productVariant.create({
                    data: {
                      productId,
                      title: parentTitle,
                      parentVariantId: null,
                      price: null,
                      discountedPrice: null,
                      sku: null,
                      available: true,
                      inventoryQuantity: 0,
                      images: [],
                      referralPercentage: 0,
                      position: option1Values.indexOf(option1Value) + 1 || 1,
                    }
                  });
                  parentVariantId = parentVariant.id;
                  processedVariantIds.add(parentVariantId);
                }

                // Process child variants
                for (const shopifyVariant of childVariantData) {
                  const shopifyVariantId = shopifyVariant.id.toString();
                  const sku = shopifyVariant.sku;
                  
                  // Try to find existing child variant
                  const existing = (sku && variantBySku.get(sku)) || variantByShopifyId.get(shopifyVariantId);

                  const childData = {
                    productId,
                    parentVariantId: parentVariantId,
                    title: shopifyVariant.option2 || shopifyVariant.title,
                    sku: sku || null,
                    discountedPrice: shopifyVariant.price ? parseFloat(shopifyVariant.price) : 0,
                    price: shopifyVariant.compare_at_price ? parseFloat(shopifyVariant.compare_at_price) : null,
                    available: shopifyVariant.available ?? true,
                    inventoryQuantity: shopifyVariant.inventory_quantity || 0,
                    weight: shopifyVariant.grams || null,
                    requiresShipping: shopifyVariant.requires_shipping ?? true,
                    taxable: shopifyVariant.taxable ?? true,
                    images: [],
                    shopifyVariantId: shopifyVariantId,
                    position: shopifyVariant.position || 1,
                  };

                  if (existing) {
                    // Update existing child variant
                    await tx.productVariant.update({
                      where: { id: existing.id },
                      data: childData,
                    });
                    processedVariantIds.add(existing.id);
                  } else {
                    // Create new child variant
                    const created = await tx.productVariant.create({
                      data: { ...childData, referralPercentage: 0 },
                    });
                    processedVariantIds.add(created.id);
                  }
                }
              }
            }
          } else {
            // Single-level variants (no parent-child structure)
            for (const shopifyVariant of shopifyProduct.variants) {
              const shopifyVariantId = shopifyVariant.id.toString();
              const sku = shopifyVariant.sku;
              
              // Try to find existing variant by SKU or shopifyVariantId
              const existing = (sku && variantBySku.get(sku)) || variantByShopifyId.get(shopifyVariantId);

              const variantData = {
                productId,
                parentVariantId: null,
                title: shopifyVariant.option1 || shopifyVariant.title,
                sku: sku || null,
                discountedPrice: shopifyVariant.price ? parseFloat(shopifyVariant.price) : 0,
                price: shopifyVariant.compare_at_price ? parseFloat(shopifyVariant.compare_at_price) : null,
                available: shopifyVariant.available ?? true,
                inventoryQuantity: shopifyVariant.inventory_quantity || 0,
                weight: shopifyVariant.grams || null,
                requiresShipping: shopifyVariant.requires_shipping ?? true,
                taxable: shopifyVariant.taxable ?? true,
                images: [],
                shopifyVariantId: shopifyVariantId,
                position: shopifyVariant.position || 1,
              };

              if (existing) {
                // Update existing variant (preserves referralPercentage)
                await tx.productVariant.update({
                  where: { id: existing.id },
                  data: variantData,
                });
                processedVariantIds.add(existing.id);
              } else {
                // Create new variant
                const created = await tx.productVariant.create({
                  data: { ...variantData, referralPercentage: 0 },
                });
                processedVariantIds.add(created.id);
              }
            }
          }

          // Delete variants that no longer exist in Shopify
          const variantsToDelete = existingVariants
            .filter(v => !processedVariantIds.has(v.id))
            .map(v => v.id);
          
          if (variantsToDelete.length > 0) {
            await tx.productVariant.deleteMany({
              where: { id: { in: variantsToDelete } }
            });
          }
        }

        return { synced: true, created: !isUpdate, updated: isUpdate };
      };

      // Process all products in this batch
      const results = await Promise.all(batch.map(syncProduct));

      // Count results for this batch
      for (const result of results) {
        if (result.synced) {
          batchSynced++;
          if (result.created) batchCreated++;
          if (result.updated) batchUpdated++;
        }
      }

      return { syncedCount: batchSynced, createdCount: batchCreated, updatedCount: batchUpdated };
    }, {
      maxWait: 30000, // Maximum time to wait for a transaction slot (30s)
      timeout: 60000, // Maximum time for the transaction to complete (60s)
    });
    
    // Accumulate batch results
    syncedCount += batchResult.syncedCount;
    createdCount += batchResult.createdCount;
    updatedCount += batchResult.updatedCount;
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
}, [UserRole.ADMIN]);
