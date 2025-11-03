# Admin Portal Debugging Guide

## 🐛 Debug Panel

A comprehensive debugging tool is now available in the admin portal to help diagnose issues in real-time.

---

## How to Access

1. **Navigate to any admin page** (Dashboard, Partners, Balance Health, etc.)
2. **Look for the red bug icon** in the bottom-right corner
3. **Click the bug icon** to open the Debug Panel

---

## Features

### **1. Real-Time Log Capture**
- Automatically captures all console.log, console.error, and console.warn messages
- Captures unhandled promise rejections
- Shows timestamp for each log entry
- Color-coded by severity:
  - 🔴 **Red** - Errors
  - 🟡 **Yellow** - Warnings
  - 🟢 **Green** - Success
  - 🔵 **Blue** - Info

### **2. Built-In Test Functions**

#### **Test DB Connection**
- Tests basic Supabase connection
- Verifies authentication
- Checks database accessibility

#### **Test Balance Health**
- Calls `admin_get_balance_health()` function
- Shows exactly what data is returned
- Helps diagnose Balance Health page issues

#### **Test Partner Details**
- Finds first partner in database
- Tests `admin_get_partner_details()` function
- Verifies partner data retrieval

#### **Test Giveaways**
- Queries giveaways table
- Tests bundle relationship
- Shows giveaway data structure

### **3. Log Filtering**
- **All** - Show all logs
- **Error** - Only errors
- **Warning** - Only warnings
- **Success** - Only success messages

### **4. Expandable Details**
- Click any log to expand it
- View full error stack traces
- See complete data objects in JSON format
- Copy-paste friendly

---

## Common Issues & How to Debug

### **Issue: "Failed to load balance health data"**

**Steps to Debug:**
1. Open Debug Panel (click bug icon)
2. Click **"Test Balance Health"**
3. Check the logs for specific error message
4. Common causes:
   - Function doesn't exist (run migrations)
   - Permission denied (check RLS policies)
   - Missing tables (run all migrations)

**What to Look For:**
```
❌ Error: function admin_get_balance_health() does not exist
→ Solution: Run migration 20251103120000_add_admin_balance_controls.sql

❌ Error: permission denied for function
→ Solution: Check user role (should be 'admin' in users table)

❌ Error: relation "admin_balance_adjustments" does not exist
→ Solution: Run all pending migrations
```

---

### **Issue: Giveaways Tab Not Loading**

**Steps to Debug:**
1. Open partner detail page
2. Open Debug Panel
3. Click **"Test Giveaways"**
4. Check the response

**What to Look For:**
```
❌ Error: relation "partner_giveaways" does not exist
→ Solution: Run giveaway system migration

❌ Error: column "bundle_id" does not exist
→ Solution: Check migration applied correctly

✅ Found 0 giveaways
→ This is normal if no giveaways created yet
```

---

### **Issue: Balance Adjustment Fails**

**Steps to Debug:**
1. Try to adjust balance
2. Check Debug Panel for error
3. Click **"Test Partner Details"** to verify partner exists

**What to Look For:**
```
❌ Error: Only admins can adjust balances
→ Solution: UPDATE users SET role = 'admin' WHERE email = 'your@email.com'

❌ Error: Partner not found
→ Solution: Verify partner ID is correct

❌ Error: Cannot set balance below pending reservations
→ This is a safety check - wait for reservations to clear
```

---

## Using Console Logs Effectively

### **Already Built Into Pages:**

All critical pages now have detailed console logging:

**Balance Health Page:**
```javascript
console.log('[Balance Health] Fetching health data...');
console.log('[Balance Health] Response:', { data, error });
console.log('[Balance Health] Success! Data:', data);
```

**Partner Detail Page:**
```javascript
console.log('[Partner Detail] Fetching partner:', id);
console.log('[Partner Detail] Response:', details);
```

### **Reading Logs:**

1. All logs are prefixed with `[Component Name]` for easy identification
2. Request/Response pattern:
   - First log: "Fetching..."
   - Second log: "Response:" (shows raw data)
   - Third log: "Success!" or error

3. Expand any log in Debug Panel to see full details

---

## Quick Testing Workflow

### **When Something Doesn't Work:**

1. ✅ **Open Debug Panel** (bug icon)
2. ✅ **Click "Clear Logs"** (start fresh)
3. ✅ **Try the action again** (reproduces issue)
4. ✅ **Review logs** (find the error)
5. ✅ **Expand error log** (see full details)
6. ✅ **Check stack trace** (find where it failed)
7. ✅ **Run relevant test** (Test DB, Test Balance Health, etc.)

### **Example Session:**

```
1. Navigate to Balance Health page
2. See "Failed to load" error
3. Open Debug Panel
4. See: [Balance Health] Error: function admin_get_balance_health() does not exist
5. Solution: Need to run migrations
```

---

## Advanced Debugging

### **Checking Supabase Directly:**

If Debug Panel shows database errors:

1. Go to Supabase Dashboard → SQL Editor
2. Run diagnostic queries:

```sql
-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'admin_get_balance_health';

-- Check user role
SELECT id, email, role FROM users WHERE email = 'admin@mumbies.com';

-- Check partners exist
SELECT COUNT(*) FROM nonprofits;

-- Check giveaways exist
SELECT COUNT(*) FROM partner_giveaways;

-- Check for balance mismatches
SELECT
  n.organization_name,
  n.mumbies_cash_balance as partner_balance,
  u.total_cashback_earned as user_balance
FROM nonprofits n
JOIN users u ON u.id = n.auth_user_id
WHERE n.mumbies_cash_balance != u.total_cashback_earned;
```

### **Checking Permissions:**

```sql
-- Verify admin status
SELECT
  u.email,
  u.role,
  u.is_admin
FROM users u
WHERE u.email = 'admin@mumbies.com';

-- Should show:
-- role = 'admin'
-- is_admin = true
```

---

## Error Message Reference

### **Common Errors & Solutions:**

| Error | Cause | Solution |
|-------|-------|----------|
| `function does not exist` | Migration not run | Run migrations in order |
| `relation does not exist` | Table missing | Run table creation migration |
| `permission denied` | RLS policy blocking | Check RLS policies or use service role |
| `Only admins can...` | User not admin | Update user role to 'admin' |
| `Partner not found` | Invalid ID | Check partner exists in nonprofits table |
| `No data returned` | Query returned null | Check if data exists in tables |
| `Cannot set balance below...` | Safety check | Wait for reservations or adjust by less |

---

## Debug Panel Shortcuts

- **Open/Close:** Click bug icon (bottom-right)
- **Clear Logs:** Click "Clear Logs" button
- **Expand Log:** Click on any log entry
- **Filter:** Use All/Error/Warning/Success buttons
- **Copy Data:** Expand log, highlight JSON, copy

---

## Best Practices

### **Before Reporting Issues:**

1. ✅ Clear logs
2. ✅ Reproduce the issue
3. ✅ Screenshot the error in Debug Panel
4. ✅ Expand error and copy full details
5. ✅ Run relevant test function
6. ✅ Note which page/action caused it

### **When Testing New Features:**

1. ✅ Keep Debug Panel open
2. ✅ Watch logs in real-time
3. ✅ Run test functions first
4. ✅ Verify data before testing UI

### **During Development:**

1. ✅ Add console.log statements with `[Component]` prefix
2. ✅ Log both requests and responses
3. ✅ Include error details in catch blocks
4. ✅ Use Debug Panel to verify changes work

---

## Summary

The Debug Panel provides:
- ✅ Real-time error capture
- ✅ Built-in test functions
- ✅ Detailed error stack traces
- ✅ Easy filtering and searching
- ✅ Copy-paste friendly output
- ✅ No production impact (dev only)

**Always open the Debug Panel when something doesn't work!**

It will show you exactly what's failing and why. 🐛✨
