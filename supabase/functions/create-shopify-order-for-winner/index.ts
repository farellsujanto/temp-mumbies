import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShopifyLineItem {
  variant_id?: string;
  product_id?: string;
  quantity: number;
  title: string;
  price: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { winner_id } = await req.json();

    if (!winner_id) {
      throw new Error('winner_id is required');
    }

    // Get winner details with giveaway and bundle info
    const { data: winner, error: winnerError } = await supabaseClient
      .from('giveaway_winners')
      .select(`
        *,
        giveaway:partner_giveaways(
          *,
          bundle:giveaway_bundles(*)
        )
      `)
      .eq('id', winner_id)
      .single();

    if (winnerError || !winner) {
      throw new Error(`Winner not found: ${winnerError?.message}`);
    }

    // Check if order already exists
    if (winner.shopify_order_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Shopify order already exists',
          order_id: winner.shopify_order_id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Shopify settings
    const { data: shopifySettings, error: settingsError } = await supabaseClient
      .from('shopify_settings')
      .select('*')
      .single();

    if (settingsError || !shopifySettings) {
      throw new Error('Shopify settings not configured');
    }

    // Get bundle products
    const { data: bundleProducts } = await supabaseClient.rpc(
      'get_giveaway_bundle_products',
      { p_bundle_id: winner.giveaway.bundle_id }
    );

    if (!bundleProducts || bundleProducts.length === 0) {
      throw new Error('No products found in bundle');
    }

    // Build Shopify line items
    const lineItems: ShopifyLineItem[] = bundleProducts.map((product: any) => ({
      variant_id: product.variant_id || product.shopify_id,
      quantity: product.quantity || 1,
      title: product.title,
      price: product.price?.toString() || '0.00',
    }));

    // Create Shopify order
    const shopifyResponse = await fetch(
      `https://${shopifySettings.shop_url}/admin/api/${shopifySettings.api_version}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifySettings.access_token,
        },
        body: JSON.stringify({
          order: {
            email: winner.user_email,
            send_receipt: shopifySettings.send_customer_notifications,
            send_fulfillment_receipt: shopifySettings.send_customer_notifications,
            financial_status: 'paid',
            fulfillment_status: null,
            note: `Giveaway Winner - ${winner.giveaway.title}`,
            tags: 'giveaway,winner,automated',
            line_items: lineItems,
            shipping_address: {
              first_name: winner.user_name.split(' ')[0],
              last_name: winner.user_name.split(' ').slice(1).join(' ') || winner.user_name,
              address1: 'To be provided by winner',
              city: 'TBD',
              province: 'TBD',
              country: 'US',
              zip: '00000',
            },
            billing_address: {
              first_name: winner.user_name.split(' ')[0],
              last_name: winner.user_name.split(' ').slice(1).join(' ') || winner.user_name,
            },
          },
        }),
      }
    );

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      throw new Error(`Shopify API error: ${errorText}`);
    }

    const shopifyOrder = await shopifyResponse.json();

    // Update winner with Shopify order details
    const { error: updateError } = await supabaseClient
      .from('giveaway_winners')
      .update({
        shopify_order_id: shopifyOrder.order.id.toString(),
        shopify_order_number: shopifyOrder.order.order_number?.toString(),
        shopify_order_created_at: shopifyOrder.order.created_at,
        shopify_order_status: shopifyOrder.order.financial_status,
        shopify_order_data: shopifyOrder.order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', winner_id);

    if (updateError) {
      console.error('Failed to update winner:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        shopify_order_id: shopifyOrder.order.id,
        shopify_order_number: shopifyOrder.order.order_number,
        admin_url: `https://${shopifySettings.shop_url}/admin/orders/${shopifyOrder.order.id}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error('Error creating Shopify order:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});