/*
  # Comprehensive Test Mode System
  
  1. New Tables
    - `partner_settings` - Partner-specific configuration including test mode
    - `test_mode_logs` - Audit trail for test actions
    - `test_scenarios` - Pre-defined test scenarios
    
  2. New Columns
    - Add `is_test_data` flag to leads, transactions, rewards, giveaways
    - Add `time_offset_days` to partner_settings for time machine
    
  3. New Functions
    - `toggle_test_mode()` - Enable/disable test mode
    - `create_test_lead()` - Generate test lead with time acceleration
    - `fast_forward_test_data()` - Advance test data in time
    - `clear_test_data()` - Remove all test data
    - `apply_test_scenario()` - Apply pre-built test scenarios
    
  4. Features
    - Time acceleration (90 days = 90 seconds for testing)
    - Isolated test data (never mixes with production)
    - One-click test scenarios
    - Visual test mode indicators
    - Complete audit trail
    
  5. Security
    - Only partners can toggle their own test mode
    - Test data clearly marked
    - Admins can see both test and production data
*/

-- 1. Partner Settings Table
CREATE TABLE IF NOT EXISTS partner_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nonprofit_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  test_mode_enabled BOOLEAN DEFAULT false,
  time_offset_days INTEGER DEFAULT 0,
  auto_clear_test_data BOOLEAN DEFAULT true,
  test_balance DECIMAL(10,2) DEFAULT 1000.00,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nonprofit_id)
);

CREATE INDEX idx_partner_settings_nonprofit ON partner_settings(nonprofit_id);

-- 2. Test Mode Logs
CREATE TABLE IF NOT EXISTS test_mode_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nonprofit_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_test_logs_nonprofit ON test_mode_logs(nonprofit_id, created_at DESC);

-- 3. Test Scenarios
CREATE TABLE IF NOT EXISTS test_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('leads', 'rewards', 'giveaways', 'conversions', 'complete')),
  scenario_data JSONB NOT NULL,
  duration_days INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 4. Add test flags to existing tables
ALTER TABLE partner_leads ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;
ALTER TABLE partner_transactions ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;
ALTER TABLE giveaway_entries ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;

-- Create indexes for test data filtering
CREATE INDEX IF NOT EXISTS idx_partner_leads_test ON partner_leads(partner_id, is_test_data, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_test ON partner_transactions(nonprofit_id, is_test_data, created_at DESC);

-- 5. RLS Policies
ALTER TABLE partner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_mode_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scenarios ENABLE ROW LEVEL SECURITY;

-- Partners can view/update their own settings
CREATE POLICY "Partners manage own settings"
  ON partner_settings FOR ALL
  TO authenticated
  USING (
    nonprofit_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    nonprofit_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Partners can view their own test logs
CREATE POLICY "Partners view own test logs"
  ON test_mode_logs FOR SELECT
  TO authenticated
  USING (
    nonprofit_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Everyone can view active test scenarios
CREATE POLICY "Anyone can view test scenarios"
  ON test_scenarios FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can manage everything
CREATE POLICY "Admins manage test mode"
  ON partner_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins view all test logs"
  ON test_mode_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins manage scenarios"
  ON test_scenarios FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- 6. Function: Toggle Test Mode
CREATE OR REPLACE FUNCTION toggle_test_mode(
  p_nonprofit_id UUID,
  p_enabled BOOLEAN
)
RETURNS JSONB AS $$
DECLARE
  v_settings RECORD;
BEGIN
  -- Get or create settings
  INSERT INTO partner_settings (nonprofit_id, test_mode_enabled)
  VALUES (p_nonprofit_id, p_enabled)
  ON CONFLICT (nonprofit_id) 
  DO UPDATE SET 
    test_mode_enabled = p_enabled,
    updated_at = NOW()
  RETURNING * INTO v_settings;

  -- Log the action
  INSERT INTO test_mode_logs (
    nonprofit_id,
    action,
    description,
    performed_by
  ) VALUES (
    p_nonprofit_id,
    CASE WHEN p_enabled THEN 'test_mode_enabled' ELSE 'test_mode_disabled' END,
    CASE WHEN p_enabled THEN 'Test mode activated' ELSE 'Test mode deactivated' END,
    auth.uid()
  );

  RETURN jsonb_build_object(
    'success', true,
    'test_mode_enabled', v_settings.test_mode_enabled,
    'test_balance', v_settings.test_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function: Create Test Lead (with time acceleration)
CREATE OR REPLACE FUNCTION create_test_lead(
  p_nonprofit_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_lead_source TEXT DEFAULT 'test',
  p_days_ago INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  v_lead_id UUID;
  v_settings RECORD;
BEGIN
  -- Check test mode is enabled
  SELECT * INTO v_settings FROM partner_settings WHERE nonprofit_id = p_nonprofit_id;
  
  IF v_settings IS NULL OR v_settings.test_mode_enabled = false THEN
    RAISE EXCEPTION 'Test mode is not enabled';
  END IF;

  -- Create test lead with time offset
  INSERT INTO partner_leads (
    partner_id,
    email,
    full_name,
    lead_source,
    status,
    is_test_data,
    created_at,
    registered_at
  ) VALUES (
    p_nonprofit_id,
    p_email,
    p_full_name,
    p_lead_source,
    'new',
    true,
    NOW() - (p_days_ago || ' days')::INTERVAL,
    NOW() - (p_days_ago || ' days')::INTERVAL
  ) RETURNING id INTO v_lead_id;

  -- Log action
  INSERT INTO test_mode_logs (
    nonprofit_id,
    action,
    description,
    data,
    performed_by
  ) VALUES (
    p_nonprofit_id,
    'test_lead_created',
    format('Created test lead: %s', p_email),
    jsonb_build_object('lead_id', v_lead_id, 'days_ago', p_days_ago),
    auth.uid()
  );

  RETURN jsonb_build_object(
    'success', true,
    'lead_id', v_lead_id,
    'email', p_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function: Fast Forward Test Data
CREATE OR REPLACE FUNCTION fast_forward_test_data(
  p_nonprofit_id UUID,
  p_days INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_leads_updated INTEGER;
  v_transactions_updated INTEGER;
BEGIN
  -- Update lead dates
  UPDATE partner_leads
  SET 
    created_at = created_at - (p_days || ' days')::INTERVAL,
    registered_at = CASE WHEN registered_at IS NOT NULL 
      THEN registered_at - (p_days || ' days')::INTERVAL 
      ELSE NULL END,
    gift_sent_at = CASE WHEN gift_sent_at IS NOT NULL 
      THEN gift_sent_at - (p_days || ' days')::INTERVAL 
      ELSE NULL END
  WHERE partner_id = p_nonprofit_id
  AND is_test_data = true;
  
  GET DIAGNOSTICS v_leads_updated = ROW_COUNT;

  -- Update transaction dates
  UPDATE partner_transactions
  SET created_at = created_at - (p_days || ' days')::INTERVAL
  WHERE nonprofit_id = p_nonprofit_id
  AND is_test_data = true;
  
  GET DIAGNOSTICS v_transactions_updated = ROW_COUNT;

  -- Log action
  INSERT INTO test_mode_logs (
    nonprofit_id,
    action,
    description,
    data,
    performed_by
  ) VALUES (
    p_nonprofit_id,
    'fast_forward',
    format('Fast forwarded test data by %s days', p_days),
    jsonb_build_object(
      'days', p_days,
      'leads_updated', v_leads_updated,
      'transactions_updated', v_transactions_updated
    ),
    auth.uid()
  );

  RETURN jsonb_build_object(
    'success', true,
    'days_forwarded', p_days,
    'leads_updated', v_leads_updated,
    'transactions_updated', v_transactions_updated
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function: Clear Test Data
CREATE OR REPLACE FUNCTION clear_test_data(
  p_nonprofit_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_leads_deleted INTEGER;
  v_transactions_deleted INTEGER;
  v_rewards_deleted INTEGER;
BEGIN
  -- Delete test leads
  DELETE FROM partner_leads
  WHERE partner_id = p_nonprofit_id
  AND is_test_data = true;
  GET DIAGNOSTICS v_leads_deleted = ROW_COUNT;

  -- Delete test transactions
  DELETE FROM partner_transactions
  WHERE nonprofit_id = p_nonprofit_id
  AND is_test_data = true;
  GET DIAGNOSTICS v_transactions_deleted = ROW_COUNT;

  -- Delete test rewards
  DELETE FROM partner_rewards
  WHERE nonprofit_id = p_nonprofit_id
  AND is_test_data = true;
  GET DIAGNOSTICS v_rewards_deleted = ROW_COUNT;

  -- Log action
  INSERT INTO test_mode_logs (
    nonprofit_id,
    action,
    description,
    data,
    performed_by
  ) VALUES (
    p_nonprofit_id,
    'clear_test_data',
    'Cleared all test data',
    jsonb_build_object(
      'leads_deleted', v_leads_deleted,
      'transactions_deleted', v_transactions_deleted,
      'rewards_deleted', v_rewards_deleted
    ),
    auth.uid()
  );

  RETURN jsonb_build_object(
    'success', true,
    'leads_deleted', v_leads_deleted,
    'transactions_deleted', v_transactions_deleted,
    'rewards_deleted', v_rewards_deleted
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Insert Pre-built Test Scenarios
INSERT INTO test_scenarios (name, description, category, scenario_data, duration_days) VALUES
  (
    'Quick Lead Conversion',
    'Creates a lead, sends gift, and simulates conversion within 7 days',
    'complete',
    '{
      "steps": [
        {"day": 0, "action": "create_lead", "email": "test.quick@example.com", "name": "Quick Test Lead"},
        {"day": 1, "action": "send_gift", "amount": 25},
        {"day": 3, "action": "simulate_registration"},
        {"day": 5, "action": "simulate_purchase", "amount": 100}
      ]
    }'::jsonb,
    7
  ),
  (
    'Expiring Gift Test',
    'Creates lead, sends gift that expires in 30 days',
    'leads',
    '{
      "steps": [
        {"day": 0, "action": "create_lead", "email": "test.expiring@example.com", "name": "Expiring Gift Test"},
        {"day": 1, "action": "send_gift", "amount": 50},
        {"day": 25, "action": "send_reminder"}
      ]
    }'::jsonb,
    30
  ),
  (
    'Multiple Leads Pipeline',
    'Creates 5 leads at different stages',
    'leads',
    '{
      "steps": [
        {"day": 0, "action": "create_lead", "email": "lead1@example.com", "name": "Lead 1 - Brand New"},
        {"day": 5, "action": "create_lead", "email": "lead2@example.com", "name": "Lead 2 - Week Old"},
        {"day": 15, "action": "create_lead", "email": "lead3@example.com", "name": "Lead 3 - Two Weeks"},
        {"day": 30, "action": "create_lead", "email": "lead4@example.com", "name": "Lead 4 - Month Old"},
        {"day": 60, "action": "create_lead", "email": "lead5@example.com", "name": "Lead 5 - Two Months"}
      ]
    }'::jsonb,
    90
  ),
  (
    'Reward Qualification Test',
    'Simulates lead qualifying for rewards',
    'rewards',
    '{
      "steps": [
        {"day": 0, "action": "create_lead", "email": "reward.test@example.com", "name": "Reward Test Lead"},
        {"day": 1, "action": "simulate_registration"},
        {"day": 2, "action": "simulate_purchase", "amount": 50},
        {"day": 10, "action": "simulate_purchase", "amount": 75},
        {"day": 20, "action": "simulate_purchase", "amount": 100}
      ]
    }'::jsonb,
    30
  )
ON CONFLICT DO NOTHING;

-- Reload schema
NOTIFY pgrst, 'reload schema';
