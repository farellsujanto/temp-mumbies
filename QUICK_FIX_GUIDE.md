# Quick Fix Guide - Balance Health Error

## 🔥 The Issue:
Balance Health page shows: "Failed to load balance health data"

## 🎯 Quick Diagnosis:
Run this in Supabase SQL Editor:
```sql
SELECT proname FROM pg_proc WHERE proname = 'admin_get_balance_health';
```

**NO ROWS = Function missing** → Solution A
**HAS ROWS = Permission issue** → Solution B

## ✅ Solution A: Run Missing Migration

1. Go to: Supabase Dashboard → SQL Editor
2. Copy ENTIRE file: `supabase/migrations/20251103120000_add_admin_balance_controls.sql`
3. Paste and Run
4. Verify: `SELECT admin_get_balance_health();`

## ✅ Solution B: Fix Admin Permission

```sql
UPDATE users SET role = 'admin', is_admin = true WHERE email = 'admin@mumbies.com';
```

## 🚀 Test in Debug Panel:
1. Click bug icon (bottom-right)
2. Click "Test Balance Health"
3. Should show ✅ Success

## 🐛 Common Errors:
| Error | Fix |
|-------|-----|
| function does not exist | Run migration #7 |
| Only admins can... | UPDATE users SET role='admin' |
| relation does not exist | Run migration #7 |

## TL;DR:
Run `supabase/migrations/20251103120000_add_admin_balance_controls.sql` in Supabase SQL Editor!
