/*
  # Populate Shopify Settings

  1. Auto-populate Shopify settings with existing credentials
  2. Use environment variables from custom Shopify app
  3. Enable auto-sync by default
  
  This migration uses the existing Shopify custom app credentials
  that were already configured for the store.
*/

-- Insert or update Shopify settings with existing credentials
INSERT INTO shopify_settings (
  shop_url,
  access_token,
  api_version,
  auto_sync_enabled,
  sync_frequency_hours,
  send_customer_notifications,
  settings
) VALUES (
  'getmumbies.myshopify.com',
  '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',
  '2024-10',
  true,
  24,
  true,
  jsonb_build_object(
    'store_name', 'getmumbies',
    'custom_domain', 'mumbies.com',
    'contact_email', 'getmumbies@gmail.com',
    'configured_from', 'custom_app'
  )
)
ON CONFLICT (id) DO NOTHING;

-- If table has records, update the first one instead
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM shopify_settings;
  
  IF v_count > 0 THEN
    UPDATE shopify_settings SET
      shop_url = 'getmumbies.myshopify.com',
      access_token = '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',
      api_version = '2024-10',
      auto_sync_enabled = true,
      sync_frequency_hours = 24,
      send_customer_notifications = true,
      settings = jsonb_build_object(
        'store_name', 'getmumbies',
        'custom_domain', 'mumbies.com',
        'contact_email', 'getmumbies@gmail.com',
        'configured_from', 'custom_app'
      ),
      updated_at = NOW()
    WHERE id = (SELECT id FROM shopify_settings LIMIT 1);
  END IF;
END $$;
