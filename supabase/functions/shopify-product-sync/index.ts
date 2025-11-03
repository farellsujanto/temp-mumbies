import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  published_at: string;
  tags: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  status: string;
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  compare_at_price?: string;
  sku: string;
  inventory_quantity: number;
  weight: number;
  weight_unit: string;
}

interface ShopifyImage {
  id: number;
  product_id: number;
  src: string;
  position: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const shopifyDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN") || "getmumbies.myshopify.com";
    const shopifyToken = Deno.env.get("SHOPIFY_ADMIN_API_TOKEN") || "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";
    const shopifyApiVersion = Deno.env.get("SHOPIFY_API_VERSION") || "2025-10";

    if (!shopifyDomain || !shopifyToken) {
      throw new Error("Shopify credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch products from Shopify
    const shopifyUrl = `https://${shopifyDomain}/admin/api/${shopifyApiVersion}/products.json`;
    const shopifyResponse = await fetch(shopifyUrl, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
        "Content-Type": "application/json",
      },
    });

    if (!shopifyResponse.ok) {
      throw new Error(`Shopify API error: ${shopifyResponse.statusText}`);
    }

    const { products } = await shopifyResponse.json() as { products: ShopifyProduct[] };

    const syncedProducts = [];
    const syncedShopifyProducts = [];
    const errors = [];

    // Sync each product to both tables
    for (const product of products) {
      try {
        const firstVariant = product.variants[0];
        const price = parseFloat(firstVariant.price);
        const compareAtPrice = firstVariant.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null;
        const inventory = firstVariant.inventory_quantity;
        const featuredImage = product.images[0]?.src || null;

        // Prepare images array
        const images = product.images.map(img => ({
          src: img.src,
          position: img.position
        }));

        // Prepare variants array
        const variants = product.variants.map(v => ({
          id: v.id.toString(),
          title: v.title,
          price: v.price,
          compare_at_price: v.compare_at_price || null,
          sku: v.sku,
          inventory_quantity: v.inventory_quantity
        }));

        // Parse tags
        const tags = product.tags ? product.tags.split(",").map(t => t.trim()) : [];

        // 1. Sync to shopify_products table (NEW)
        const { data: shopifyProductData, error: shopifyError } = await supabase
          .rpc('sync_shopify_product', {
            p_shopify_id: product.id.toString(),
            p_title: product.title,
            p_description: product.body_html?.replace(/<[^>]*>/g, "") || "",
            p_handle: product.handle,
            p_vendor: product.vendor || null,
            p_product_type: product.product_type || null,
            p_price: price,
            p_featured_image: featuredImage,
            p_images: JSON.stringify(images),
            p_variants: JSON.stringify(variants),
            p_tags: tags,
            p_status: product.status || 'active',
            p_shopify_data: JSON.stringify(product)
          });

        if (!shopifyError) {
          syncedShopifyProducts.push({
            id: shopifyProductData,
            title: product.title,
            handle: product.handle
          });
        }

        // 2. Sync to legacy products table (for backward compatibility)
        let brandId = null;
        if (product.vendor) {
          const { data: brand } = await supabase
            .from("brands")
            .select("id")
            .eq("name", product.vendor)
            .maybeSingle();

          if (brand) {
            brandId = brand.id;
          } else {
            const { data: newBrand } = await supabase
              .from("brands")
              .insert({
                name: product.vendor,
                slug: product.vendor.toLowerCase().replace(/\s+/g, "-"),
                description: `Premium pet products from ${product.vendor}`,
                is_featured: false,
              })
              .select("id")
              .single();
            brandId = newBrand?.id;
          }
        }

        const { data, error } = await supabase
          .from("products")
          .upsert({
            shopify_id: product.id.toString(),
            name: product.title,
            description: product.body_html?.replace(/<[^>]*>/g, "") || "",
            price: price,
            image_url: featuredImage,
            category: product.product_type || "uncategorized",
            brand_id: brandId,
            inventory_status: inventory > 0 ? "in_stock" : "out_of_stock",
            stock_quantity: inventory,
            tags: tags,
            is_active: product.status === 'active',
          }, {
            onConflict: "shopify_id",
          })
          .select()
          .single();

        if (error) {
          errors.push({ product: product.title, table: 'products', error: error.message });
        } else {
          syncedProducts.push(data);
        }

      } catch (err) {
        errors.push({ product: product.title, error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced_products: syncedProducts.length,
        synced_shopify_products: syncedShopifyProducts.length,
        total: products.length,
        errors: errors.length > 0 ? errors : undefined,
        shopify_products: syncedShopifyProducts.slice(0, 10), // Show first 10
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
