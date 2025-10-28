/*
  # User Profile Auto-Creation Trigger

  1. Changes
    - Creates a trigger function to automatically create user profile when auth user signs up
    - Generates unique referral code for new users
    - Sets up auth integration

  2. Purpose
    - Ensures every authenticated user has a profile in the users table
    - Simplifies onboarding flow
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    referral_code
  )
  VALUES (
    NEW.id,
    NEW.email,
    substring(md5(random()::text || NEW.id::text) from 1 for 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
