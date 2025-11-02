# Unified Partner-Personal Account Architecture

## Overview

The Mumbies platform uses a **unified account system** similar to Amazon's approach, where a single login provides access to both partner (business) functions and personal shopping features.

## Core Architecture: One User, Two Roles

```
┌─────────────────────────────────────────────────────┐
│         SINGLE LOGIN (auth.users)                   │
│         email: partner@wihumane.org                 │
│         id: 77dab09c-2a25-4637-8b4f-32384dcdd36f    │
└───────────────┬─────────────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌──────────────┐
│  PARTNER ROLE │  │ PERSONAL ROLE│
│  (nonprofits) │  │   (users)    │
└───────────────┘  └──────────────┘
```

## How It Works

### 1. User Authentication
- User logs in once with email/password
- auth.users table handles authentication
- User ID is shared across both roles

### 2. Partner Role (nonprofits table)
```sql
nonprofits {
  id: UUID (partner ID)
  auth_user_id: UUID → references auth.users(id)
  organization_name: "Wisconsin Humane Society"

  -- Partner Balances
  total_commissions_earned: 101.20
  total_referral_earnings: 2000.00
  mumbies_cash_balance: 80.00  ← SYNCED TO SHOPPING
}
```

### 3. Personal Role (users table)
```sql
users {
  id: UUID → same as auth.users.id
  email: "partner@wihumane.org"

  -- Shopping Balance
  total_cashback_earned: 80.00  ← SYNCED FROM PARTNER

  -- Shopping Data
  total_orders: 3
  total_spent: 215.00
}
```

## The Magic: Automatic Balance Sync

### Database Trigger (Auto-Sync)
```sql
-- Trigger on nonprofits table
CREATE TRIGGER sync_shopping_balance_on_mumbies_change
  AFTER UPDATE OF mumbies_cash_balance ON nonprofits
  FOR EACH ROW
  EXECUTE FUNCTION sync_shopping_balance_trigger();
```

**What this does:**
1. Partner converts $50 Cash → Mumbies Cash on Partner Dashboard
2. `nonprofits.mumbies_cash_balance` increases by $55 (with 10% bonus)
3. Trigger fires automatically
4. `users.total_cashback_earned` updates to $55
5. Shopping checkout immediately shows $55 available

### Manual Sync Function
```sql
SELECT sync_partner_shopping_balance(user_id);
```

## Money Flow Diagram

```
┌─────────────────── EARN MONEY ────────────────────┐
│                                                    │
│  Commission (5%)  ──┐                            │
│  Referral ($1000) ──┤─→ Cash Balance ($2,101.20)  │
│                     │                              │
└─────────────────────┴──────────────────────────────┘
                      │
                      │ CONVERT (+10% Bonus)
                      ▼
┌─────────────────── SPEND MONEY ───────────────────┐
│                                                    │
│  $50 Cash → $55 Mumbies Cash                      │
│                                                    │
│  Mumbies Cash = Shopping Credit                   │
│  • Shop on Mumbies.com                            │
│  • Send gifts to leads                            │
│  • Run giveaways                                  │
│                                                    │
└────────────────────────────────────────────────────┘
         │
         │ AUTO-SYNC
         ▼
┌────── SHOPPING ACCOUNT ──────┐
│  total_cashback_earned: $55  │
│  (Available at checkout)     │
└──────────────────────────────┘
```

## User Experience Flow

### Flow 1: Partner Dashboard → Shopping
1. Login as partner@wihumane.org
2. View Partner Dashboard
3. See: Cash Balance $2,101.20, Mumbies Cash $25.00
4. Convert $50 Cash → Mumbies Cash
5. Result: Cash Balance $2,051.20, Mumbies Cash $80.00 (+10% bonus)
6. **DON'T LOGOUT** - Same session works for shopping
7. Click "Shop" in navigation
8. Add items to cart
9. Go to checkout
10. See: "Apply Cash Balance $80.00" ✅

### Flow 2: View Balance Across Platform

#### Partner Dashboard Header
```
┌────────────────────────────────────────┐
│ Wisconsin Humane Society               │
│ Partner Dashboard                      │
│                        [💳 Mumbies Cash]│
│                        $80.00          │
└────────────────────────────────────────┘
```

#### Account Page Header
```
┌────────────────────────────────────────┐
│ My Account                             │
│ partner@wihumane.org                   │
│                  [💳 Mumbies Cash]     │
│                  $80.00                │
└────────────────────────────────────────┘
```

#### Checkout Page
```
┌────────────────────────────────────────┐
│ Order Summary                          │
│ Subtotal            $115.94            │
│                                        │
│ ☑ Apply Cash Balance     $80.00       │
│                                        │
│ Total                   $35.94         │
└────────────────────────────────────────┘
```

## Database Schema

### Tables Involved

#### 1. auth.users (Supabase Auth)
- Handles authentication
- Single source of truth for login
- ID is shared across platform

#### 2. nonprofits (Partner Data)
- Organization information
- Partner-specific fields
- **auth_user_id** links to auth.users
- **mumbies_cash_balance** syncs to shopping

#### 3. users (Shopping Profile)
- Shopping preferences
- Order history
- **total_cashback_earned** receives sync from partner
- Same ID as auth.users

#### 4. partner_transactions (Audit Trail)
- Records all balance changes
- Tracks conversions, gifts, shopping
- Provides transaction history

## Key Benefits

### 1. **Seamless Experience**
Partners don't need to:
- Logout and login again
- Switch accounts
- Transfer money manually
- Wait for processing

### 2. **Real-Time Sync**
- Convert → Shop → Checkout in seconds
- No delays, no manual steps
- Balance always accurate

### 3. **Single Source of Truth**
- One login = one user
- No duplicate accounts
- No sync conflicts

### 4. **Complete Audit Trail**
Every balance change is tracked:
- When it happened
- What type (conversion, shopping, gift)
- Amount before/after
- Description

## Transaction Types

### Conversions (Cash → Mumbies Cash)
```sql
-- Debit from Cash Balance
{
  transaction_type: 'conversion',
  balance_type: 'cash_balance',
  amount: -50.00,
  description: 'Converted $50.00 to Mumbies Cash'
}

-- Credit to Mumbies Cash (+10% bonus)
{
  transaction_type: 'conversion',
  balance_type: 'mumbies_cash',
  amount: +55.00,
  description: 'Converted $50.00 Cash Balance to $55.00 Mumbies Cash (+10% bonus)'
}
```

### Shopping
```sql
{
  transaction_type: 'shopping',
  balance_type: 'mumbies_cash',
  amount: -35.94,
  description: 'Order #12345 on Mumbies.com'
}
```

### Gift Sends
```sql
{
  transaction_type: 'gift_send',
  balance_type: 'mumbies_cash',
  amount: -10.00,
  description: 'Sent $10.00 gift to lead@example.com'
}
```

## Recent Activity Integration

Partner Dashboard Overview tab shows all activity including conversions:

```
Recent Activity
───────────────────────────────────────
💳 Converted $50.00 Cash Balance      +$55.00
   to $55.00 Mumbies Cash
   Nov 2, 2025

🎁 Sent $10.00 gift to lead@email.com  -$10.00
   Nov 1, 2025

📦 Order from customer@email.com       +$5.75
   Oct 31, 2025                    ($115 order)
```

## Implementation Details

### Frontend Components

#### CheckoutPage.tsx
```typescript
// Uses userProfile.total_cashback_earned
const cashBalance = userProfile?.total_cashback_earned || 0;
```

#### PartnerDashboardPage.tsx
```typescript
// Shows partner balances
nonprofit.mumbies_cash_balance
nonprofit.total_commissions_earned
nonprofit.total_referral_earnings

// Recent activity loads conversions
const { data: conversions } = await supabase
  .from('partner_transactions')
  .select('*')
  .eq('nonprofit_id', nonprofitId)
  .eq('transaction_type', 'conversion');
```

#### AccountPage.tsx
```typescript
// Shows Mumbies Cash in header
{userProfile?.total_cashback_earned > 0 && (
  <div className="bg-blue-50 border border-blue-200">
    <p>Mumbies Cash</p>
    <p>${userProfile.total_cashback_earned.toFixed(2)}</p>
  </div>
)}
```

### Backend Functions

#### convert_cash_to_mumbies()
```sql
-- Atomic function that:
1. Validates sufficient cash balance
2. Calculates 10% bonus
3. Updates both balances
4. Records 2 transactions
5. Triggers auto-sync to shopping
```

#### sync_partner_shopping_balance()
```sql
-- Called by trigger or manually
-- Updates users.total_cashback_earned
-- From nonprofits.mumbies_cash_balance
```

## Testing the Flow

### Test Scenario 1: Convert and Shop
```sql
-- 1. Set up partner with cash
UPDATE nonprofits
SET total_commissions_earned = 500.00,
    mumbies_cash_balance = 0.00
WHERE organization_name = 'Wisconsin Humane Society';

-- 2. Login to partner dashboard
-- 3. Convert $100 cash to Mumbies Cash
-- Result: Mumbies Cash = $110 (with bonus)

-- 4. Verify sync
SELECT
  n.mumbies_cash_balance as partner_balance,
  u.total_cashback_earned as shopping_balance
FROM nonprofits n
JOIN users u ON n.auth_user_id = u.id
WHERE n.organization_name = 'Wisconsin Humane Society';
-- Both should show $110.00

-- 5. Go shopping without logging out
-- 6. Checkout shows $110.00 available
```

### Test Scenario 2: Multiple Conversions
```sql
-- Set up
UPDATE nonprofits
SET total_commissions_earned = 1000.00,
    mumbies_cash_balance = 50.00
WHERE organization_name = 'Wisconsin Humane Society';

-- Convert $100 three times
-- Result:
--   Cash: $700
--   Mumbies: $380 ($50 + $110 + $110 + $110)

-- Verify transaction history
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
-- Should show 6 transactions (3 debits, 3 credits)
```

## Security Considerations

### Row Level Security (RLS)
```sql
-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON partner_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Partners can only see their own nonprofit data
CREATE POLICY "Partners view own data"
  ON nonprofits FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());
```

### Balance Protection
- Conversion function validates sufficient balance
- Atomic transactions prevent partial updates
- Triggers ensure sync happens automatically
- No manual balance editing from frontend

## Future Enhancements

### Planned Features
1. Shopping transactions auto-record in partner_transactions
2. Email notifications on balance changes
3. Monthly statements
4. Tax reporting
5. Multi-currency support
6. Partner-to-partner transfers

### API Endpoints (Future)
- `POST /api/convert` - Convert cash to Mumbies Cash
- `GET /api/balance` - Get current balances
- `GET /api/transactions` - Transaction history
- `POST /api/transfer` - Transfer between partners

## Troubleshooting

### Balance Out of Sync?
```sql
-- Force re-sync
SELECT sync_partner_shopping_balance(
  (SELECT auth_user_id FROM nonprofits
   WHERE organization_name = 'Wisconsin Humane Society')
);
```

### Conversion Not Showing in Recent Activity?
```sql
-- Check transactions exist
SELECT * FROM partner_transactions
WHERE nonprofit_id = (SELECT id FROM nonprofits
                      WHERE organization_name = 'Wisconsin Humane Society')
AND transaction_type = 'conversion';

-- Reload recent activity by switching tabs or refreshing
```

### Shopping Balance Not Updating?
```sql
-- Verify trigger is active
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'sync_shopping_balance_on_mumbies_change';

-- Check users table has correct value
SELECT total_cashback_earned
FROM users
WHERE email = 'partner@wihumane.org';
```

## Summary

The unified account architecture provides a seamless experience where:
1. **One login** accesses both partner and shopping features
2. **Automatic sync** keeps balances consistent across roles
3. **Real-time updates** enable instant convert-and-shop workflow
4. **Complete audit trail** tracks every balance change
5. **Secure by default** with RLS and atomic transactions

This mirrors Amazon's approach where sellers can also shop using their earned balance, creating a cohesive ecosystem that encourages engagement and simplifies the user experience.
