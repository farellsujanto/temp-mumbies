/*
  # Add Mumbies Cash Balance to Nonprofits

  1. Schema Changes
    - Add `mumbies_cash_balance` column to nonprofits table
    - This tracks partner store credit for gifts, giveaways, and shopping

  2. Security
    - No RLS changes needed (uses existing nonprofit policies)
*/

-- Add mumbies_cash_balance to nonprofits table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mumbies_cash_balance'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mumbies_cash_balance DECIMAL(10,2) DEFAULT 0 NOT NULL;
  END IF;
END $$;
