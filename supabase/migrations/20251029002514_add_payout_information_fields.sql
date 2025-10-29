/*
  # Add Payout Information Fields

  ## Overview
  This migration adds fields to the nonprofits table to store payout information
  for commission and referral earnings.

  ## Modified Tables
  
  ### `nonprofits`
  - Add `payout_method` (text) - Payment method: paypal, bank_transfer, check
  - Add `payout_email` (text, nullable) - PayPal email or notification email
  - Add `bank_account_name` (text, nullable) - Name on bank account
  - Add `bank_routing_number` (text, nullable) - Bank routing number
  - Add `bank_account_number` (text, nullable) - Bank account number (encrypted in production)
  - Add `mailing_address_line1` (text, nullable) - Street address for checks
  - Add `mailing_address_line2` (text, nullable) - Apt/Suite for checks
  - Add `mailing_address_city` (text, nullable) - City for checks
  - Add `mailing_address_state` (text, nullable) - State for checks
  - Add `mailing_address_zip` (text, nullable) - ZIP code for checks
  - Add `payout_info_updated_at` (timestamptz, nullable) - Last update timestamp

  ## Security
  - All payout fields are accessible only to the nonprofit owner via existing RLS policies
  - Bank account information should be encrypted in production environments

  ## Important Notes
  1. Default payout method is null (not set)
  2. Partners must set payout information before receiving payments
  3. Validation should be implemented in the application layer
*/

-- Add payout information columns to nonprofits table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'payout_method'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN payout_method text CHECK (payout_method IN ('paypal', 'bank_transfer', 'check'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'payout_email'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN payout_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'bank_account_name'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN bank_account_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'bank_routing_number'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN bank_routing_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'bank_account_number'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN bank_account_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mailing_address_line1'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mailing_address_line1 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mailing_address_line2'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mailing_address_line2 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mailing_address_city'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mailing_address_city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mailing_address_state'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mailing_address_state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'mailing_address_zip'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN mailing_address_zip text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'payout_info_updated_at'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN payout_info_updated_at timestamptz;
  END IF;
END $$;