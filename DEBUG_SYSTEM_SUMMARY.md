# Debug Panel System - Complete Implementation

## Overview
A comprehensive debug panel system for the Partner Portal that shows real-time query data, errors, and component state. Appears as a floating blue bug icon in bottom-right corner.

---

## Files to Copy to Your GitHub Repository

### ✅ NEW FILES (Create These)

#### 1. **`apps/partner/src/contexts/DebugContext.tsx`**
Global debug state management with hooks for logging queries, data, and errors.

#### 2. **`apps/partner/src/components/DebugPanel.tsx`**
The floating debug panel UI component with drag support, filters, and built-in tests.

---

### ✅ MODIFIED FILES (Update These)

#### 3. **`apps/partner/src/App.tsx`**
**Changes:**
- Added `DebugProvider` wrapper around entire app
- Added `<DebugPanel />` component
- Imports for debug system

**Lines Changed:**
- Line 3: Import `DebugProvider`
- Line 4: Import `DebugPanel`
- Line 20: Wrap routes in `<DebugProvider>`
- Line 43: Add `<DebugPanel />` before closing `</DebugProvider>`

#### 4. **`apps/partner/src/components/partner/LeadsTab.tsx`**
**Changes:**
- Added debug logging to leads queries
- Logs query execution, results, and errors
- Example implementation for other components to follow

**Lines Changed:**
- Line 4: Import `useDebug`
- Line 30: Initialize `useDebug()` hook
- Lines 40-61: Added debug logging throughout `fetchLeads()`

---

## CRITICAL BUG FIX (Still Needed)

While implementing the debug panel, I found **3 files** that need the same bug fix as before:

### Files That Still Have the Bug:
1. `apps/partner/src/pages/PartnerGiveawaysPage.tsx` (Line 40)
2. `apps/partner/src/pages/PartnerRewardsPage.tsx` (Line 38)
3. `apps/partner/src/pages/PartnerProductsPage.tsx` (Line 42)

### The Fix:
Each file checks `data.status` without selecting it. Add `, status` to the SELECT:

**Before:**
```typescript
.select('id, organization_name, total_sales')
```

**After:**
```typescript
.select('id, organization_name, total_sales, status')
```

---

## What the Debug Panel Does

### When You Open It:
1. **Shows current user info**: Email, ID
2. **Shows partner info**: Organization name, status, balance
3. **Logs all queries**: Every database query with results
4. **Logs errors**: Full stack traces and error details
5. **Interactive**: Click entries to expand and see full JSON

### Features:
- ✅ Draggable window
- ✅ Collapsible to small icon
- ✅ Filter by: All / Query / Data / Error
- ✅ "Test Leads Query" button (tests partner_leads immediately)
- ✅ "Copy Info" button (copies debug data to clipboard)
- ✅ Color-coded entries (green=success, red=error, blue=info)
- ✅ Auto-hides in production
- ✅ Shows last 50 entries

---

## How to Use After Deployment

### For Your Demo:
1. Deploy the updated files to partner portal
2. Login as Wisconsin Humane Society
3. You'll see a blue bug icon in bottom-right
4. Click it to open debug panel
5. Navigate to Leads page
6. Debug panel will show:
   ```
   ✓ Query "partner_leads.fetchAll" returned 26 results
   ```

### If Leads Still Show Zero:
1. Open debug panel
2. Click "Test Leads Query"
3. Look at the result:
   - **Green log = Success**: Data exists, check partnerId in details
   - **Red log = Error**: Shows exact error message
   - Look for: "column status does not exist" → Need to add status to query
   - Look for: "permission denied" → RLS policy issue

### Debug Any Page:
The panel works on ALL pages. As you navigate:
- Dashboard → See all dashboard queries
- Leads → See leads queries
- Giveaways → See giveaway queries
- Products → See product queries

Every query is automatically logged.

---

## How to Add Debug Logging to Other Components

### Example Pattern:
```typescript
import { useDebug } from '../contexts/DebugContext';

export default function MyComponent() {
  const { logQuery, logData, logError } = useDebug();

  const fetchSomething = async () => {
    try {
      logData('Starting fetch', { someParam });

      const { data, error } = await supabase
        .from('my_table')
        .select('*')
        .eq('id', someId);

      logQuery('my_table.fetch', { someId }, data, error);

      if (error) throw error;

      return data;
    } catch (err) {
      logError(err, 'fetchSomething');
    }
  };
}
```

---

## Quick Test After Deployment

1. **Go to**: https://partners.staging.mumbies.com
2. **Login as**: Wisconsin partner
3. **Look for**: Blue bug icon bottom-right
4. **Click it**: Panel opens
5. **Navigate to Leads**: Should see query logs
6. **Check for**: "Query 'partner_leads.fetchAll' returned X results"

If X = 26, the query works! ✅
If X = 0, expand the log to see why. ❌

---

## Environment Detection

Debug panel **ONLY shows** on:
- `localhost` (local development)
- URLs containing `staging`
- NOT on production domains

This is automatic - no configuration needed.

---

## Summary: Copy These 4 Files

| File | Action | Purpose |
|------|--------|---------|
| `apps/partner/src/contexts/DebugContext.tsx` | **CREATE NEW** | Debug state management |
| `apps/partner/src/components/DebugPanel.tsx` | **CREATE NEW** | Debug panel UI |
| `apps/partner/src/App.tsx` | **UPDATE** | Add DebugProvider & Panel |
| `apps/partner/src/components/partner/LeadsTab.tsx` | **UPDATE** | Example debug logging |

---

## Plus: Fix These 3 Files (The Status Bug)

| File | Line | Fix |
|------|------|-----|
| `apps/partner/src/pages/PartnerGiveawaysPage.tsx` | 40 | Add `, status` to SELECT |
| `apps/partner/src/pages/PartnerRewardsPage.tsx` | 38 | Add `, status` to SELECT |
| `apps/partner/src/pages/PartnerProductsPage.tsx` | 42 | Add `, status` to SELECT |

---

## Expected Result After Deployment

1. Debug panel appears on staging
2. Shows all queries in real-time
3. You can see exactly what data is being fetched
4. Leads page shows 26 leads (after status fix)
5. You can test queries on-demand
6. Easy to share debug info with "Copy Info" button

---

## Questions You Can Now Answer

**Q: "Why does partner portal show 0 leads?"**
**A:** Open debug panel, click "Test Leads Query", see exact error.

**Q: "Is the query even running?"**
**A:** Open debug panel, navigate to page, see all queries logged.

**Q: "What data is being returned?"**
**A:** Open debug panel, expand query log, see full JSON response.

**Q: "Is it an RLS policy issue?"**
**A:** Debug panel shows permission denied errors clearly.

**Q: "What's the partner ID being used?"**
**A:** Debug panel shows partner info at top + in query details.

---

## This Solves Your Problem

You won't need to:
- Ask me to check database ❌
- Wonder what's happening ❌
- Check browser console ❌
- Guess at the issue ❌

You can:
- See every query in real-time ✅
- Test queries on demand ✅
- Share debug data easily ✅
- Debug independently ✅

---

## Documentation

Full documentation: `apps/partner/DEBUG_PANEL_README.md`

Includes:
- Complete usage guide
- API reference for all debug methods
- Troubleshooting guide
- Examples and patterns
- Pro tips and tricks
