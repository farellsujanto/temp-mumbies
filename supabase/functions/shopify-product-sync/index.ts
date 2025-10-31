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
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
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
    // These will be set via Supabase secrets or fallback to hardcoded values
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
    const errors = [];

    // Sync each product to Supabase
    for (const product of products) {
      try {
        // Get the first variant's price and inventory
        const firstVariant = product.variants[0];
        const price = parseFloat(firstVariant.price);
        const inventory = firstVariant.inventory_quantity;

        // Get the first image
        const imageUrl = product.images[0]?.src || null;

        // Upsert product to database
        const { data, error } = await supabase
          .from("products")
          .upsert({
            shopify_id: product.id.toString(),
            name: product.title,
            description: product.body_html?.replace(/<[^>]*>/g, "") || "",
            price: price,
            image_url: imageUrl,
            category: product.product_type || "uncategorized",
            brand_name: product.vendor || "Mumbies",
            in_stock: inventory > 0,
            stock_quantity: inventory,
            tags: product.tags ? product.tags.split(",").map(t => t.trim()) : [],
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "shopify_id",
          })
          .select()
          .single();

        if (error) {
          errors.push({ product: product.title, error: error.message });
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
        synced: syncedProducts.length,
        total: products.length,
        errors: errors.length > 0 ? errors : undefined,
        products: syncedProducts,
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
