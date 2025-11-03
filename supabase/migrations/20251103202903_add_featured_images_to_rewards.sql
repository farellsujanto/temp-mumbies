/*
  # Add Featured Images to Rewards System
  
  1. Changes
    - Add featured_image_url column to partner_rewards
    - Update all existing rewards with appropriate images
    - Ensures rewards display consistently like giveaway bundles
*/

-- Add featured_image_url column
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS featured_image_url text;

-- Update existing rewards with featured images based on their type and title
UPDATE partner_rewards SET featured_image_url = 
  CASE 
    -- Black Friday / Holiday themed
    WHEN title ILIKE '%black friday%' THEN 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHEN title ILIKE '%holiday%' OR title ILIKE '%christmas%' THEN 'https://images.pexels.com/photos/749353/pexels-photo-749353.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHEN title ILIKE '%new year%' THEN 'https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Lead generation themed
    WHEN title ILIKE '%lead%' OR requirement_type IN ('lead_count', 'referral_count') THEN 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Sales themed
    WHEN title ILIKE '%sales%' OR title ILIKE '%$%' OR requirement_type = 'sales_amount' THEN 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Customer / engagement themed
    WHEN title ILIKE '%customer%' OR requirement_type = 'customer_count' THEN 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Product rewards
    WHEN reward_type = 'free_product' THEN 'https://images.pexels.com/photos/4498126/pexels-photo-4498126.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Cash/Commission rewards
    WHEN reward_type IN ('cash_bonus', 'bonus_commission', 'mumbies_cash_bonus') THEN 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Competition / milestone
    WHEN reward_type IN ('competition', 'milestone') THEN 'https://images.pexels.com/photos/262438/pexels-photo-262438.jpeg?auto=compress&cs=tinysrgb&w=800'
    
    -- Default
    ELSE 'https://images.pexels.com/photos/2072183/pexels-photo-2072183.jpeg?auto=compress&cs=tinysrgb&w=800'
  END
WHERE featured_image_url IS NULL;
