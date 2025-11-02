/*
  # Add Nonprofit Referral Request System

  1. New Tables
    - `nonprofit_referral_requests` - Track user requests to refer nonprofits

  2. Changes
    - Add system for users to request access to nonprofit referral program
    - Track request status (pending, approved, denied)
    - Store admin notes for internal team review

  3. Security
    - Users can only view their own requests
    - Only authenticated users can create requests
    - Prevents duplicate requests
*/

-- Create nonprofit referral requests table
CREATE TABLE IF NOT EXISTS nonprofit_referral_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request details
  status TEXT DEFAULT 'pending' NOT NULL 
    CHECK (status IN ('pending', 'approved', 'denied')),
  
  -- Admin review
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Prevent duplicate requests from same user
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_requests_user 
  ON nonprofit_referral_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_status 
  ON nonprofit_referral_requests(status, created_at DESC);

-- Enable RLS
ALTER TABLE nonprofit_referral_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own referral requests"
  ON nonprofit_referral_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own requests
CREATE POLICY "Users can create referral requests"
  ON nonprofit_referral_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can view and update all requests (will add admin check later)
CREATE POLICY "System can update referral requests"
  ON nonprofit_referral_requests FOR UPDATE
  TO authenticated
  USING (true);

-- Function to approve nonprofit referral request
CREATE OR REPLACE FUNCTION approve_nonprofit_referral_request(
  p_request_id UUID,
  p_admin_user_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID from request
  SELECT user_id INTO v_user_id
  FROM nonprofit_referral_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  -- Update request status
  UPDATE nonprofit_referral_requests
  SET
    status = 'approved',
    reviewed_by = p_admin_user_id,
    reviewed_at = NOW(),
    admin_notes = p_admin_notes,
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Grant nonprofit referral access to user
  UPDATE users
  SET
    nonprofit_referral_access = true,
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'status', 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deny nonprofit referral request
CREATE OR REPLACE FUNCTION deny_nonprofit_referral_request(
  p_request_id UUID,
  p_admin_user_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
BEGIN
  -- Update request status
  UPDATE nonprofit_referral_requests
  SET
    status = 'denied',
    reviewed_by = p_admin_user_id,
    reviewed_at = NOW(),
    admin_notes = p_admin_notes,
    updated_at = NOW()
  WHERE id = p_request_id
  AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'denied'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE nonprofit_referral_requests IS 'Tracks user requests to access nonprofit referral program';
COMMENT ON FUNCTION approve_nonprofit_referral_request IS 'Approve nonprofit referral request and grant user access';
COMMENT ON FUNCTION deny_nonprofit_referral_request IS 'Deny nonprofit referral request';
