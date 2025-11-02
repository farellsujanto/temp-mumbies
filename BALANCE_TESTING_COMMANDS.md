# Balance Testing SQL Commands

This document provides SQL commands to adjust balances and test the money flow ecosystem in the Mumbies Partner Program.

## 🔍 Viewing Current Balances

### View Partner Account Balances
```sql
SELECT
  organization_name,
  total_commissions_earned as commission_balance,
  total_referral_earnings as referral_balance,
  (total_commissions_earned + total_referral_earnings) as total_cash_balance,
  mumbies_cash_balance,
  auth_user_id
FROM nonprofits
WHERE organization_name = 'Wisconsin Humane Society';
```

### View Shopping Account Balance
```sql
SELECT
  email,
  total_cashback_earned as mumbies_cash_for_shopping
FROM users
WHERE email = 'partner@wihumane.org';
```

### View All Transactions for a Partner
```sql
SELECT
  created_at,
  transaction_type,
  balance_type,
  amount,
  balance_after,
  description
FROM partner_transactions
WHERE user_id = (SELECT id FROM users WHERE email = 'partner@wihumane.org')
ORDER BY created_at DESC;
```

## 💰 Adjusting Balances for Testing

### Add Commission Balance
```sql
UPDATE nonprofits
SET total_commissions_earned = total_commissions_earned + 100.00
WHERE organization_name = 'Wisconsin Humane Society';
```

### Add Referral Balance
```sql
UPDATE nonprofits
SET total_referral_earnings = total_referral_earnings + 500.00
WHERE organization_name = 'Wisconsin Humane Society';
```

### Add Mumbies Cash Directly (will auto-sync to shopping account)
```sql
UPDATE nonprofits
SET mumbies_cash_balance = mumbies_cash_balance + 50.00
WHERE organization_name = 'Wisconsin Humane Society';
```

### Set Specific Balances
```sql
UPDATE nonprofits
SET
  total_commissions_earned = 250.00,
  total_referral_earnings = 1000.00,
  mumbies_cash_balance = 75.00
WHERE organization_name = 'Wisconsin Humane Society';
```

## 🔄 Testing the Conversion Flow

### Manually Record a Conversion Transaction
```sql
SELECT convert_cash_to_mumbies(
  (SELECT id FROM users WHERE email = 'partner@wihumane.org'),
  (SELECT id FROM nonprofits WHERE organization_name = 'Wisconsin Humane Society'),
  25.00
);
```

This will:
1. Deduct $25 from Cash Balance
2. Add $27.50 to Mumbies Cash (+10% bonus)
3. Create 2 transaction records (debit and credit)
4. Automatically sync to shopping balance

## 📊 Verify System Integrity

### Check Shopping Balance Sync
```sql
SELECT
  n.organization_name,
  n.mumbies_cash_balance as partner_balance,
  u.total_cashback_earned as shopping_balance,
  CASE
    WHEN n.mumbies_cash_balance = u.total_cashback_earned THEN '✅ SYNCED'
    ELSE '❌ OUT OF SYNC'
  END as sync_status
FROM nonprofits n
JOIN users u ON n.auth_user_id = u.id
WHERE n.organization_name = 'Wisconsin Humane Society';
```

### Manually Trigger Sync (if needed)
```sql
SELECT sync_partner_shopping_balance(
  (SELECT id FROM users WHERE email = 'partner@wihumane.org')
);
```

### View Transaction Count by Type
```sql
SELECT
  transaction_type,
  balance_type,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM partner_transactions
WHERE user_id = (SELECT id FROM users WHERE email = 'partner@wihumane.org')
GROUP BY transaction_type, balance_type;
```

## 🧪 Complete Test Scenario

### Reset Partner to Known State
```sql
-- Set clean starting balances
UPDATE nonprofits
SET
  total_commissions_earned = 500.00,
  total_referral_earnings = 1000.00,
  mumbies_cash_balance = 0.00
WHERE organization_name = 'Wisconsin Humane Society';

-- Clear old test transactions (optional)
DELETE FROM partner_transactions
WHERE user_id = (SELECT id FROM users WHERE email = 'partner@wihumane.org')
AND description LIKE '%test%';
```

### Test Conversion
```sql
-- Convert $100 from Cash to Mumbies Cash
SELECT convert_cash_to_mumbies(
  (SELECT id FROM users WHERE email = 'partner@wihumane.org'),
  (SELECT id FROM nonprofits WHERE organization_name = 'Wisconsin Humane Society'),
  100.00
);

-- Verify results
SELECT
  organization_name,
  (total_commissions_earned + total_referral_earnings) as remaining_cash,
  mumbies_cash_balance as mumbies_cash
FROM nonprofits
WHERE organization_name = 'Wisconsin Humane Society';
```

Expected Results:
- Cash Balance: $1,400 ($500 + $1,000 - $100 = $1,400)
- Mumbies Cash: $110 ($0 + $110 = $110, with 10% bonus)

## 🎯 Quick Balance Setups

### "New Partner" Setup
```sql
UPDATE nonprofits
SET
  total_commissions_earned = 0.00,
  total_referral_earnings = 0.00,
  mumbies_cash_balance = 0.00
WHERE organization_name = 'Wisconsin Humane Society';
```

### "Active Partner" Setup
```sql
UPDATE nonprofits
SET
  total_commissions_earned = 287.50,
  total_referral_earnings = 2000.00,
  mumbies_cash_balance = 125.00
WHERE organization_name = 'Wisconsin Humane Society';
```

### "Conversion Testing" Setup
```sql
UPDATE nonprofits
SET
  total_commissions_earned = 200.00,
  total_referral_earnings = 300.00,
  mumbies_cash_balance = 25.00
WHERE organization_name = 'Wisconsin Humane Society';
```

## 🔧 Troubleshooting

### If Shopping Balance Doesn't Update
```sql
-- Force re-sync
SELECT sync_partner_shopping_balance(
  (SELECT auth_user_id FROM nonprofits WHERE organization_name = 'Wisconsin Humane Society')
);

-- Verify sync worked
SELECT
  n.mumbies_cash_balance as partner_balance,
  u.total_cashback_earned as shopping_balance
FROM nonprofits n
JOIN users u ON n.auth_user_id = u.id
WHERE n.organization_name = 'Wisconsin Humane Society';
```

### If Transactions Aren't Showing
```sql
-- Check RLS policies are correct
SELECT * FROM partner_transactions
WHERE user_id = (SELECT id FROM users WHERE email = 'partner@wihumane.org')
LIMIT 5;
```

### View All Partner Accounts
```sql
SELECT
  organization_name,
  email,
  (total_commissions_earned + total_referral_earnings) as total_cash,
  mumbies_cash_balance,
  status
FROM nonprofits n
JOIN users u ON n.auth_user_id = u.id
WHERE n.status = 'active';
```

## 📝 Notes

1. **Auto-Sync**: When `mumbies_cash_balance` changes in the `nonprofits` table, it automatically syncs to `users.total_cashback_earned` via a database trigger.

2. **Conversion Bonus**: The `convert_cash_to_mumbies()` function automatically applies a 10% bonus, so $100 converts to $110 Mumbies Cash.

3. **Transaction Records**: All conversions create 2 transaction records:
   - One debit from Cash Balance (negative amount)
   - One credit to Mumbies Cash (positive amount with bonus)

4. **Shopping Integration**: The Mumbies Cash balance in the `nonprofits` table is the same as `total_cashback_earned` in the `users` table. Partners can use this balance when shopping.

5. **Balance Types**:
   - `cash_balance`: Combined total_commissions_earned + total_referral_earnings
   - `mumbies_cash`: Spendable credit for shopping, gifts, and giveaways
