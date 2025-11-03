/*
  # Update Partner Rewards Types
  
  Add cash_bonus and mumbies_cash_bonus to allowed reward types
*/

-- Drop existing constraint
ALTER TABLE partner_rewards DROP CONSTRAINT IF EXISTS partner_rewards_reward_type_check;

-- Add new constraint with additional types
ALTER TABLE partner_rewards ADD CONSTRAINT partner_rewards_reward_type_check 
CHECK (reward_type IN (
  'free_product', 
  'cash_bonus', 
  'mumbies_cash_bonus', 
  'gift_card', 
  'bonus_commission', 
  'milestone',
  'time_based',
  'competition'
));
