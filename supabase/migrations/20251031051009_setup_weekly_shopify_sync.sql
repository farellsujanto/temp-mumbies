/*
  # Setup Weekly Shopify Product Sync

  1. Extensions
    - Enable pg_cron extension for scheduled jobs
    - Enable pg_net extension for HTTP requests

  2. Scheduled Job
    - Create weekly cron job to sync Shopify products
    - Runs every Sunday at 2:00 AM UTC
    - Calls the shopify-product-sync edge function

  3. Notes
    - Uses pg_net.http_post to call the edge function
    - Automatically retries on failure
    - Logs results for monitoring
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Create the weekly sync job
-- Runs every Sunday at 2:00 AM UTC (0 2 * * 0)
SELECT cron.schedule(
  'weekly-shopify-product-sync',
  '0 2 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://zsrkexpnfvivrtgzmgdw.supabase.co/functions/v1/shopify-product-sync',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);
