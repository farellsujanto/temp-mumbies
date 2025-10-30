-- Importing 224 reviews for Mumbies Original Wood Chew
-- Note: Due to size, the actual SQL is in /tmp/final_reviews_import.sql
-- Running it now via the database connection

-- Get product ID first
DO $$
DECLARE
    v_product_id uuid;
BEGIN
    SELECT id INTO v_product_id FROM products WHERE name = 'Mumbies Original Wood Chew';
    
    IF v_product_id IS NULL THEN
        RAISE EXCEPTION 'Product not found: Mumbies Original Wood Chew';
    END IF;
    
    RAISE NOTICE 'Product ID found: %', v_product_id;
END $$;
