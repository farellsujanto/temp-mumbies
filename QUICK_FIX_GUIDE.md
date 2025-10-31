# Quick Fix Guide - Vercel Blank Page

## The Problem
✗ Blank white page at partners.staging.mumbies.com
✗ No errors in build logs
✗ Deployment shows "Ready" status

## The Cause
App crashed during initialization because Supabase environment variables were missing.

## The Fix (3 Steps)

### Step 1: Push Fixed Code
```bash
git add .
git commit -m "Fix blank page with error boundary and resilient init"
git push origin main
```

### Step 2: Add Environment Variables in Vercel
Go to: **Vercel Dashboard → Settings → Environment Variables**

Add these two variables:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://zsrkexpnfvivrtgzmgdw.supabase.co
Environments: Production, Preview, Development
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcmtleHBuZnZpdnJ0Z3ptZ2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODI3OTcsImV4cCI6MjA3NzI1ODc5N30.m9pP0MGu6n4d_UCzwo7T6v5diPcLnE2_PEm2JOzgFjU
Environments: Production, Preview, Development
```

### Step 3: Redeploy
- Go to: **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**
- Wait 2-3 minutes

## Verification

### Test the Fix
Visit: **`https://partners.staging.mumbies.com/test`**

Should see:
- ✅ "Site is Working" heading
- ✅ React Application: Green
- ✅ Routing: Green
- ✅ Environment Variables: Green (after adding them)
- ✅ Supabase Connection: Green (after adding them)

### Access the App
1. Visit: `https://partners.staging.mumbies.com/`
2. Enter password: `mumbies2025`
3. App should load fully
4. Shop page should work: `/shop`

## What Changed

**Files Added:**
- `src/components/ErrorBoundary.tsx` - Catches errors
- `src/pages/TestPage.tsx` - Diagnostic page at `/test`
- `vercel.json` - Proper SPA routing config

**Files Modified:**
- `src/lib/supabase.ts` - No longer throws error if vars missing
- `src/main.tsx` - Wrapped in ErrorBoundary
- `src/App.tsx` - Added /test route

## Troubleshooting

**Still blank page?**
- Visit `/test` to see diagnostics
- Check browser console (F12)
- Verify env vars in Vercel
- Hard refresh (Ctrl+Shift+R)

**Test page shows red indicators?**
- Red = missing environment variable
- Follow steps above to add them
- Redeploy after adding

**Password screen not showing?**
- Good sign! React is rendering
- Password: `mumbies2025`
- Clear browser cache if needed

## Documentation Files

- `VERCEL_DEPLOYMENT_FIX.md` - Complete guide
- `DEPLOYMENT_FIXES_SUMMARY.md` - Summary
- `FILES_CHANGED.md` - All changes listed
- `QUICK_FIX_GUIDE.md` - This file

## Support

If issues persist:
1. Read `VERCEL_DEPLOYMENT_FIX.md` for detailed steps
2. Check `/test` page for diagnostics
3. Verify both env vars are set correctly
4. Ensure vars are set for "Production" environment

---

**Total Time: ~5 minutes**
**Build Status: ✅ Verified**
**Ready to Deploy: ✅ Yes**
