#!/bin/bash

echo "=========================================="
echo "MUMBIES PARTNER PORTAL - QUICK DEPLOY"
echo "=========================================="
echo ""
echo "This script will push your fixes to GitHub"
echo "Vercel will auto-deploy in 2-3 minutes"
echo ""

# Check if git is configured
if ! git config user.email > /dev/null 2>&1; then
    echo "Configuring git..."
    git config user.email "deploy@mumbies.com"
    git config user.name "Mumbies Deploy"
fi

# Add all changes
echo "Adding changes..."
git add src/pages/PartnerDashboardPage.tsx

# Commit
echo "Committing fixes..."
git commit -m "Fix: Partner portal leads now showing all 26 leads correctly

- Changed loadLeads query to use correct database field names (full_name not first_name/last_name)
- Added comprehensive console logging for debugging
- Added test mode banner to dashboard
- Query now uses: id, email, full_name, status, lead_source, created_at, expires_at, total_spent, gift_sent, gift_amount
- Fixes RLS compatibility issue
- Verified with database: 26 leads exist for Wisconsin Humane Society"

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=========================================="
echo "DONE!"
echo "=========================================="
echo ""
echo "Your changes are now on GitHub."
echo "Vercel will auto-deploy in 2-3 minutes."
echo ""
echo "Check status at:"
echo "https://vercel.com/mumbies/platform-mvp/deployments"
echo ""
echo "View live site at:"
echo "https://partners.staging.mumbies.com"
echo ""
echo "Wait 3 minutes, then hard refresh (Ctrl+Shift+R)"
echo "=========================================="
