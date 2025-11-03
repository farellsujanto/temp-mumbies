# Fix: Schema Cache Error - Balance Health

## The Error:
"Could not find the function public.admin_get_balance_health without parameters in the schema cache"

## What This Means:
The function exists in the database, but PostgREST (Supabase's API layer) hasn't detected it yet. This happens when:
1. Function was just created
2. PostgREST cache hasn't refreshed (refreshes every 5 min)

## Solutions (Pick One):

### Option 1: Refresh PostgREST Schema Cache (FASTEST)

**In Supabase Dashboard:**
1. Go to: **Settings** → **API**
2. Scroll down to **API Settings**
3. Click **"Reload Schema"** or **"Restart API"** button

**OR via SQL Editor:**
```sql
NOTIFY pgrst, 'reload schema';
```

Then refresh your admin page!

### Option 2: Wait 5 Minutes
PostgREST automatically refreshes its cache every 5 minutes. Just wait and try again.

### Option 3: Verify Function Exists First

```sql
-- Check if function exists
SELECT proname, proargnames
FROM pg_proc
WHERE proname = 'admin_get_balance_health';
```

**If NO ROWS:** Function missing! Run migration:
```
supabase/migrations/20251103120000_add_admin_balance_controls.sql
```

**If HAS ROWS:** Just refresh schema (Option 1)

### Option 4: Call Function Directly in SQL Editor (Test)

```sql
SELECT admin_get_balance_health();
```

If this works but the page doesn't, it's definitely a cache issue. Use Option 1!

## Quick Fix Commands:

```sql
-- 1. Check function exists
SELECT proname FROM pg_proc WHERE proname = 'admin_get_balance_health';

-- 2. If exists, reload schema
NOTIFY pgrst, 'reload schema';

-- 3. Test function works
SELECT admin_get_balance_health();
```

## After Fix:
1. Refresh admin portal
2. Click Balance Health
3. Should load successfully!
4. Debug Panel will show success

## Prevention:
After running any migration that creates functions, always:
1. Reload PostgREST schema
2. OR wait 5 minutes before testing

## TL;DR:
Run in Supabase SQL Editor:
```sql
NOTIFY pgrst, 'reload schema';
```
Then refresh your admin page!
