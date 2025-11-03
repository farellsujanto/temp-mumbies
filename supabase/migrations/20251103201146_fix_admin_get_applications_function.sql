/*
  # Fix admin_get_partner_applications function
  
  Fixes the ambiguous column reference by using qualified table names
*/

CREATE OR REPLACE FUNCTION admin_get_partner_applications(p_status text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  email text,
  organization_name text,
  organization_type text,
  contact_name text,
  status text,
  application_date timestamptz,
  reviewed_at timestamptz,
  reviewed_by_email text,
  review_notes text,
  denial_reason text,
  nonprofit_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Verify caller is admin (use qualified column name)
  SELECT users.is_admin INTO v_is_admin 
  FROM users 
  WHERE users.id = auth.uid();
  
  IF NOT COALESCE(v_is_admin, false) THEN
    RAISE EXCEPTION 'Only admins can view applications';
  END IF;

  RETURN QUERY
  SELECT
    pa.id,
    pa.email,
    pa.organization_name,
    pa.organization_type,
    pa.contact_name,
    pa.status,
    pa.application_date,
    pa.reviewed_at,
    u.email as reviewed_by_email,
    pa.review_notes,
    pa.denial_reason,
    pa.nonprofit_id
  FROM partner_applications pa
  LEFT JOIN users u ON u.id = pa.reviewed_by
  WHERE (p_status IS NULL OR pa.status = p_status)
  ORDER BY pa.application_date DESC;
END;
$$;
