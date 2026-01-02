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
          const variantOperations = [];

          // Delete existing variants
          variantOperations.push(
            tx.productVariant.deleteMany({
              where: { productId }
            })
          );

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
                variantOperations.push(
                  tx.productVariant.create({
                    data: {
                      productId,
                      parentVariantId: null,
                      title: singleVariant.title,
                      sku: singleVariant.sku || null,
                      discountedPrice: singleVariant.price ? parseFloat(singleVariant.price) : 0,
                      price: singleVariant.compare_at_price ? parseFloat(singleVariant.compare_at_price) : null,
                      available: singleVariant.available ?? true,
                      inventoryQuantity: singleVariant.inventory_quantity || 0,
                      weight: singleVariant.grams || null,
                      requiresShipping: singleVariant.requires_shipping ?? true,
                      taxable: singleVariant.taxable ?? true,
                      images: [],
                      shopifyVariantId: singleVariant.id.toString(),
                      referralPercentage: 0,
                      position: singleVariant.position || 1,
                    }
                  })
                );
              } else {
                // Create parent variant first, then create children in a nested transaction
                // We need to do this sequentially within the group to get the parent ID
                const parentData = {
                  productId,
                  title: option1Value,
                  parentVariantId: null,
                  price: null,
                  discountedPrice: null,
                  sku: null,
                  available: true,
                  inventoryQuantity: 0,
                  images: [],
                  referralPercentage: 0,
                  position: option1Values.indexOf(option1Value) + 1 || 1,
                };

                // We'll handle this after the main transaction
                // Store the data for later processing
                if (!shopifyProduct._parentVariants) shopifyProduct._parentVariants = [];
                shopifyProduct._parentVariants.push({ parentData, childVariantData });
              }
            }
          } else {
            // Single-level variants (no parent-child structure)
            for (const shopifyVariant of shopifyProduct.variants) {
              variantOperations.push(
                tx.productVariant.create({
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
                    referralPercentage: 0,
                    position: shopifyVariant.position || 1,
                  }
                })
              );
            }
          }

          // Execute variant operations in transaction
          await Promise.all(variantOperations);

          // Handle parent-child variants separately (requires sequential creation)
          if (shopifyProduct._parentVariants && shopifyProduct._parentVariants.length > 0) {
            for (const { parentData, childVariantData } of shopifyProduct._parentVariants) {
              const parentVariant = await tx.productVariant.create({
                data: parentData
              });

              // Create child variants
              const childOperations = childVariantData.map((shopifyVariant: any) =>
                tx.productVariant.create({
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
                    referralPercentage: 0,
                    position: shopifyVariant.position || 1,
                  }
                })
              );

              await Promise.all(childOperations);
            }
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
}
