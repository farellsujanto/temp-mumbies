/*
  # Create Admin Portal Database Schema

  1. New Tables
    - `admin_activity_log` - Audit trail of all admin actions
    - `payout_batches` - Batch processing of partner payouts
    - `hero_slides` - Homepage hero slider content management
    - `promotional_banners` - Site-wide promotional banner management
    - `platform_settings` - System-wide configuration
    - `admin_notifications` - Alerts and notifications for admins

  2. Updates to Existing Tables
    - Add `payout_batch_id`, `payout_status`, `payout_date` to `partner_transactions`
    
  3. Security
    - RLS policies restrict access to admin role only
    - Activity logging for compliance
    - Granular permissions
*/

-- 1. Admin Activity Log (Audit Trail)
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN (
    'approve_partner', 'reject_partner', 'suspend_partner', 'activate_partner',
    'process_payout', 'edit_partner', 'delete_partner',
    'create_content', 'update_content', 'delete_content',
    'update_settings', 'create_admin', 'remove_admin'
  )),
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'partner', 'payout', 'payout_batch', 'hero_slide', 'banner', 'setting', 'admin_user'
  )),
  entity_id UUID,
  
  -- Change tracking
  previous_value JSONB,
  new_value JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_log_user ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_log_action ON admin_activity_log(action_type);
CREATE INDEX idx_admin_log_created ON admin_activity_log(created_at DESC);
CREATE INDEX idx_admin_log_entity ON admin_activity_log(entity_type, entity_id);

-- 2. Payout Batches
CREATE TABLE IF NOT EXISTS payout_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Batch details
  batch_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  partner_count INTEGER NOT NULL DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Payment method
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'paypal', 'check', 'manual')),
  payment_reference TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payout_batches_status ON payout_batches(status);
CREATE INDEX idx_payout_batches_created ON payout_batches(created_at DESC);

-- Update partner_transactions to link to batches (for commission transactions)
ALTER TABLE partner_transactions
ADD COLUMN IF NOT EXISTS payout_batch_id UUID REFERENCES payout_batches(id);

ALTER TABLE partner_transactions
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed'));

ALTER TABLE partner_transactions
ADD COLUMN IF NOT EXISTS payout_date TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_transactions_payout_status ON partner_transactions(payout_status) WHERE payout_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_transactions_batch ON partner_transactions(payout_batch_id);

-- 3. Hero Slides (Homepage Content Management)
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  
  -- Call to action
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/shop',
  
  -- Display settings
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#f3f4f6',
  
  -- Scheduling
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hero_slides_active ON hero_slides(active, display_order) WHERE active = true;
CREATE INDEX idx_hero_slides_dates ON hero_slides(start_date, end_date);

-- 4. Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Setting identification
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  
  -- Metadata
  description TEXT,
  category TEXT CHECK (category IN ('commissions', 'payouts', 'features', 'integrations', 'security')),
  
  -- Audit
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (key, value, description, category) VALUES
('default_commission_rate', '0.05', 'Default commission rate for new partners (5%)', 'commissions'),
('minimum_payout_amount', '50.00', 'Minimum balance required for payout', 'payouts'),
('lead_attribution_days', '90', 'Days a lead remains attributed to partner', 'commissions'),
('gift_incentive_expiration_days', '14', 'Days until gift incentive expires', 'commissions'),
('giveaway_auto_approve', 'false', 'Auto-approve giveaways without admin review', 'features'),
('featured_rescue_id', 'null', 'Currently featured rescue on homepage', 'features'),
('maintenance_mode', 'false', 'Enable maintenance mode banner', 'features')
ON CONFLICT (key) DO NOTHING;

-- 5. Admin Notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN (
    'partner_application', 'payout_due', 'giveaway_pending', 
    'low_inventory', 'large_order', 'system_alert'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  
  -- Target
  recipient_id UUID REFERENCES auth.users(id),
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Action link
  action_url TEXT,
  action_label TEXT,
  
  -- Related entity
  entity_type TEXT,
  entity_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON admin_notifications(recipient_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created ON admin_notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON admin_notifications(type);

-- RLS POLICIES (Admin Only Access)

-- Admin Activity Log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity log"
  ON admin_activity_log FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can insert activity log"
  ON admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

-- Payout Batches
ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payout batches"
  ON payout_batches FOR ALL
  TO authenticated
  USING ((SELECT is_admin FROM users WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

-- Hero Slides
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active slides"
  ON hero_slides FOR SELECT
  USING (
    active = true AND 
    (start_date IS NULL OR start_date <= NOW()) AND 
    (end_date IS NULL OR end_date >= NOW())
  );

CREATE POLICY "Admins can manage slides"
  ON hero_slides FOR ALL
  TO authenticated
  USING ((SELECT is_admin FROM users WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

-- Platform Settings
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view non-sensitive settings"
  ON platform_settings FOR SELECT
  USING (category NOT IN ('integrations', 'security'));

CREATE POLICY "Admins can manage settings"
  ON platform_settings FOR ALL
  TO authenticated
  USING ((SELECT is_admin FROM users WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

-- Admin Notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid()) = true AND
    (recipient_id IS NULL OR recipient_id = auth.uid())
  );

CREATE POLICY "Admins can update their notifications"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM users WHERE id = auth.uid()) = true);

-- Helper function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_previous_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_activity_log (
    admin_user_id,
    action_type,
    entity_type,
    entity_id,
    notes,
    previous_value,
    new_value
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_notes,
    p_previous_value,
    p_new_value
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION log_admin_activity IS 'Helper function to log admin actions for audit trail';
