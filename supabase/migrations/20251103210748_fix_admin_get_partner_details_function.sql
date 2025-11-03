/*
  # Fix Admin Partner Details Function

  1. Changes
    - Remove n.email reference (doesn't exist in nonprofits table)
    - Keep contact_email instead

  2. Security
    - Function is SECURITY DEFINER to bypass RLS
*/

CREATE OR REPLACE FUNCTION admin_get_partner_details(p_partner_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  partner_record RECORD;
  balance_record RECORD;
  stats_record RECORD;
BEGIN
  -- Get partner info
  SELECT 
    n.id,
    n.organization_name,
    n.slug,
    n.contact_name,
    n.contact_email,
    n.contact_phone,
    n.website,
    n.location_city,
    n.location_state,
    n.status,
    n.mumbies_cash_balance,
    n.total_commissions_earned,
    n.total_sales,
    n.total_attributed_customers,
    n.created_at,
    u.email as auth_email,
    u.created_at as user_created_at
  INTO partner_record
  FROM nonprofits n
  LEFT JOIN auth.users u ON n.auth_user_id = u.id
  WHERE n.id = p_partner_id;

  IF partner_record IS NULL THEN
    RAISE EXCEPTION 'Partner not found';
  END IF;

  -- Get balance info
  SELECT 
    COALESCE(n.mumbies_cash_balance, 0) as current_balance,
    COALESCE(n.mumbies_cash_balance, 0) as user_balance,
    true as balance_synced,
    0 as pending_reservations,
    COALESCE(n.mumbies_cash_balance, 0) as available_balance
  INTO balance_record
  FROM nonprofits n
  WHERE n.id = p_partner_id;

  -- Get statistics
  SELECT 
    COUNT(DISTINCT t.id) FILTER (WHERE t.transaction_type IN ('gift_sent', 'giveaway_entry', 'reward_unlock')) as total_transactions,
    COALESCE(SUM(t.amount) FILTER (WHERE t.transaction_type = 'earnings' AND t.amount > 0), 0) as total_earned,
    COALESCE(SUM(ABS(t.amount)) FILTER (WHERE t.amount < 0), 0) as total_spent,
    COUNT(DISTINCT pl.id) as total_leads,
    COUNT(DISTINCT pg.id) FILTER (WHERE pg.status = 'active') as active_giveaways,
    COUNT(DISTINCT pr.id) FILTER (WHERE pr.status = 'completed') as completed_rewards
  INTO stats_record
  FROM nonprofits n
  LEFT JOIN partner_transactions t ON n.id = t.partner_id
  LEFT JOIN partner_leads pl ON n.id = pl.partner_id
  LEFT JOIN partner_giveaways pg ON n.id = pg.partner_id
  LEFT JOIN partner_rewards pr ON n.id = pr.partner_id
  WHERE n.id = p_partner_id;

  -- Build result
  result := jsonb_build_object(
    'partner', row_to_json(partner_record),
    'user', jsonb_build_object(
      'email', partner_record.auth_email,
      'created_at', partner_record.user_created_at
    ),
    'balance_info', row_to_json(balance_record),
    'statistics', row_to_json(stats_record),
    'recent_transactions', (
      SELECT COALESCE(jsonb_agg(t ORDER BY t.created_at DESC), '[]'::jsonb)
      FROM (
        SELECT * FROM partner_transactions
        WHERE partner_id = p_partner_id
        ORDER BY created_at DESC
        LIMIT 10
      ) t
    ),
    'recent_adjustments', '[]'::jsonb
  );

  RETURN result;
END;
$$;