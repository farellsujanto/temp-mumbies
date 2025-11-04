/*
  # Optimize RLS - Partner Applications
*/

DROP POLICY IF EXISTS "Admins can update applications" ON partner_applications;
CREATE POLICY "Admins can update applications" ON partner_applications
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Admins can view all applications" ON partner_applications;
CREATE POLICY "Admins can view all applications" ON partner_applications
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Applicants can view their own" ON partner_applications;
CREATE POLICY "Applicants can view their own" ON partner_applications
  FOR SELECT TO authenticated
  USING (email = (SELECT auth.jwt()->>'email'));