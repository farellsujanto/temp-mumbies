# Admin Balance Control System - Complete Documentation

## 🎯 Overview

This system provides comprehensive admin controls for managing partner Mumbies Cash balances while ensuring **100% safety** and **zero conflicts** with Shopify orders.

---

## ✅ What We Built

### 1. **Database Functions** (Migration: `20251103120000_add_admin_balance_controls.sql`)

#### `admin_adjust_partner_balance()`
Safely adjust partner Mumbies Cash balance with full audit trail.

**Features:**
- Checks admin permissions
- Validates balance before adjustment
- Prevents negative balances
- Checks for pending reservations (money in checkout)
- Updates both `users` and `nonprofits` tables atomically
- Records transaction in `partner_transactions`
- Logs adjustment in `admin_balance_adjustments`
- Logs admin activity

**Usage:**
```sql
SELECT admin_adjust_partner_balance(
  p_partner_id := 'uuid-here',
  p_amount := 50.00,  -- positive = add, negative = remove
  p_adjustment_type := 'bonus',
  p_reason := 'Monthly partnership bonus',
  p_notes := 'Q4 performance incentive'
);
```

**Adjustment Types:**
- `add` - Add cash to balance
- `remove` - Remove cash from balance
- `fix_sync` - Fix sync issues
- `refund` - Refund to partner
- `bonus` - Bonus payment
- `penalty` - Penalty deduction
- `correction` - Manual correction

---

#### `admin_get_partner_details()`
Get comprehensive partner data for admin detail view.

**Returns:**
- Partner organization details
- User account info
- Balance information (current, pending reservations, available)
- Statistics (transactions, leads, giveaways, rewards)
- Recent transactions (last 10)
- Recent admin adjustments (last 10)

**Usage:**
```sql
SELECT admin_get_partner_details('partner-uuid-here');
```

---

#### `admin_get_balance_health()`
System-wide balance health check.

**Returns:**
- Total partners and cash in system
- Pending reservations
- Mismatched accounts
- Expired reservations
- Failed webhooks
- List of accounts with sync issues
- Last reconciliation report

**Usage:**
```sql
SELECT admin_get_balance_health();
```

---

#### `admin_fix_balance_mismatch()`
Auto-fix sync issues between `users` and `nonprofits` tables.

**Parameters:**
- `p_partner_id` - Partner to fix
- `p_use_source` - Which table to use as source (`'user'` or `'partner'`)

**Usage:**
```sql
SELECT admin_fix_balance_mismatch(
  p_partner_id := 'partner-uuid',
  p_use_source := 'user'  -- Use users table as source of truth
);
```

---

### 2. **Admin Portal Pages**

#### **Partner Detail Page** (`/partners/:id`)

**Features:**
- View complete partner profile
- Real-time balance display
- Balance mismatch alerts
- Manual balance adjustment modal
- One-click balance sync fix
- Status management (activate/suspend)
- Contact information
- Statistics dashboard
- Tabs: Overview, Transactions, Giveaways, Rewards

**Balance Adjustment Modal:**
- Choose Add or Remove cash
- Enter amount
- Select reason type
- Add required notes
- Preview new balance
- Safety checks before applying

**Balance Mismatch Alert:**
- Shows when `users.total_cashback_earned` ≠ `nonprofits.mumbies_cash_balance`
- Displays both balances and difference
- Two fix buttons: "Use User Balance" or "Use Partner Balance"
- One-click sync

---

#### **Balance Health Dashboard** (`/balance-health`)

**Features:**
- Overall system health status (Healthy/Warning/Critical)
- System totals:
  - Total partners
  - Total Mumbies Cash
  - Pending reservations
  - Available balance
- Health metrics:
  - Balance mismatches
  - Expired reservations needing cleanup
  - Failed webhooks (24h)
- Mismatched accounts table with:
  - Partner name
  - User balance vs Partner balance
  - Difference calculation
  - Quick fix link
- Last reconciliation report
- Actions:
  - Refresh data
  - Run manual reconciliation
  - Expire old reservations

---

### 3. **Database Table**

#### `admin_balance_adjustments`
Complete audit trail of all balance adjustments.

**Columns:**
- `id` - Unique identifier
- `partner_id` - Partner who was adjusted
- `admin_user_id` - Admin who made adjustment
- `amount` - Amount adjusted
- `balance_before` - Balance before adjustment
- `balance_after` - Balance after adjustment
- `adjustment_type` - Type of adjustment
- `reason` - Required reason text
- `notes` - Optional additional notes
- `metadata` - JSON with extra data
- `created_at` - Timestamp

---

## 🔒 Safety Guarantees

### **1. No Conflicts with Shopify**
- We **never** modify Shopify gift cards
- All balances live in Supabase (source of truth)
- Shopify orders use discount codes + webhooks
- Balance reservations prevent double-spending

### **2. Atomic Transactions**
- All balance changes happen in single database transaction
- If any step fails, entire operation rolls back
- Both `users` and `nonprofits` tables updated together
- Transaction records created atomically

### **3. Pending Reservation Protection**
- System checks for pending reservations (money in checkout)
- Cannot reduce balance below reserved amount
- Prevents breaking active checkouts

### **4. Complete Audit Trail**
- Every adjustment logged in `admin_balance_adjustments`
- Every balance change recorded in `partner_transactions`
- Every admin action logged in `admin_activity_log`
- Who, what, when, why - all tracked

### **5. Balance Sync Monitoring**
- System monitors for sync issues between tables
- Health dashboard shows mismatches immediately
- One-click fix with admin approval
- Daily reconciliation reports

---

## 🎬 How to Use

### **Scenario 1: Give Partner a Bonus**

1. Navigate to **Partners** page
2. Find partner, click **View Details**
3. Click **Adjust Balance** button
4. Select **Add Cash**
5. Enter amount: `100.00`
6. Select reason: **Bonus**
7. Add notes: "Q4 partnership incentive"
8. Click **Apply Adjustment**
9. Confirm success

**Result:**
- Partner balance increased by $100
- Transaction recorded
- Adjustment logged
- Admin activity tracked

---

### **Scenario 2: Fix Balance Mismatch**

1. Navigate to **Balance Health** page
2. See alert: "3 account(s) have balance mismatches"
3. Click on mismatched partner in table
4. See red alert banner on partner detail page
5. Review both balances:
   - User Balance: $150.00
   - Partner Balance: $145.00
   - Difference: +$5.00
6. Click **Use User Balance** (or **Use Partner Balance**)
7. Confirm action
8. Both tables now synced at $150.00

---

### **Scenario 3: Monthly Health Check**

1. Navigate to **Balance Health** page
2. Click **Run Reconciliation**
3. Review report:
   - Total partners: 45
   - Total cash: $12,450.00
   - Mismatches: 0
   - Status: Healthy
4. Export report if needed
5. Check again next month

---

## 📊 Admin Navigation Structure

```
Admin Portal
├── Dashboard
├── Partners
│   └── Partner Detail (new!)
│       ├── Overview Tab
│       ├── Transactions Tab
│       ├── Giveaways Tab
│       └── Rewards Tab
├── Balance Health (new!)
└── Accounts
```

---

## 🚨 Important Rules for Admins

### **DO:**
✅ Use the adjustment interface for all balance changes
✅ Always provide a clear reason
✅ Check for pending reservations first
✅ Run health checks regularly
✅ Fix mismatches immediately when detected
✅ Review transaction history before adjusting

### **DON'T:**
❌ Never directly edit database tables
❌ Never modify Shopify gift cards
❌ Never skip the reason/notes field
❌ Never reduce balance below pending reservations
❌ Never ignore balance mismatch alerts

---

## 🔧 Troubleshooting

### **Problem: Balance mismatch detected**
**Solution:**
1. Go to partner detail page
2. Click appropriate "Use X Balance" button
3. Or manually adjust using adjustment interface

### **Problem: Can't reduce balance**
**Possible Causes:**
- Pending reservations exist (money in checkout)
- Would create negative balance

**Solution:**
- Check available balance (current - pending)
- Wait for reservations to complete or expire
- Or adjust by smaller amount

### **Problem: Webhook failures**
**Solution:**
1. Check Balance Health page
2. Review failed webhooks count
3. Contact technical support if > 5 failures

---

## 📈 Future Enhancements

### **Phase 2: Advanced Features**
- Bulk balance adjustments
- CSV export of all transactions
- Scheduled automatic reconciliation
- Email alerts for mismatches
- Balance trending charts
- Partner balance limits/caps

### **Phase 3: Automation**
- Auto-fix minor sync issues
- Scheduled health reports
- Predictive balance alerts
- Integration with accounting software

---

## 🎓 Technical Details

### **Database Flow:**

```
Admin clicks "Adjust Balance"
         ↓
admin_adjust_partner_balance() called
         ↓
1. Verify admin permissions
2. Check current balances
3. Check pending reservations
4. Validate new balance would be valid
5. BEGIN TRANSACTION
6.   Update nonprofits.mumbies_cash_balance
7.   Update users.total_cashback_earned
8.   Insert partner_transactions record
9.   Insert admin_balance_adjustments record
10.  Insert admin_activity_log record
11. COMMIT TRANSACTION
         ↓
Frontend refreshes data
         ↓
User sees updated balance
```

### **Safety Checks:**

```typescript
// Before adjustment:
1. Is user an admin? ✓
2. Does partner exist? ✓
3. Are both tables accessible? ✓
4. Are there pending reservations? ✓
5. Would new balance be valid? ✓
6. Is reason provided? ✓

// If all checks pass:
→ Execute atomic transaction
→ Log everything
→ Return success

// If any check fails:
→ Rollback (no changes made)
→ Return error message
→ Log attempt
```

---

## ✅ Summary

**You now have complete control over:**
- Partner Mumbies Cash balances
- System-wide balance health
- Transaction history
- Sync issue detection and repair
- Full audit trails

**With complete safety:**
- No Shopify conflicts
- Atomic transactions
- Pending reservation protection
- Complete audit trails
- Balance sync monitoring

**Ready for production:**
- Built and tested
- Fully documented
- Admin-only access
- Password protected
- Comprehensive error handling

---

## 📞 Quick Reference

**Add Bonus:**
```
Partners → [Select Partner] → Adjust Balance → Add → Enter details → Apply
```

**Fix Mismatch:**
```
Balance Health → [Click mismatched partner] → Use X Balance → Confirm
```

**Health Check:**
```
Balance Health → Run Reconciliation → Review report
```

**View History:**
```
Partners → [Select Partner] → Transactions Tab
```

---

**Password:** `mumbies2025admin`
**Admin Portal:** https://admin.mumbies.com
