/*
  # Add Missing Partner Application Fields
  
  1. New Fields
    - contact_phone: Phone number from application form
    - partner_type: Store the type of partner (rescue, shelter, etc.)
    
  2. Purpose
    - Capture all form data from partner applications
    - Ensure no data loss between form submission and database
*/

-- Add phone field
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS contact_phone text;

-- Add partner_type if doesn't exist with proper values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'nonprofits' AND column_name = 'partner_type'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN partner_type text;
  END IF;
END $$;
