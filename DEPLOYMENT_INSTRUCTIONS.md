# 🚀 Deployment Instructions

## Overview

You now have **two separate portals** that need to be deployed independently:
- **Admin Portal** → `admin.mumbies.com`
- **Partner Portal** → `partners.mumbies.com`

---

## 📋 Prerequisites

Before deploying, ensure you have:
1. Vercel account (or hosting provider of choice)
2. GitHub repository with this code
3. DNS access for mumbies.com domain
4. Supabase project URL and keys

---

## 🔧 Step-by-Step Deployment

### **1. Deploy Admin Portal (admin.mumbies.com)**

#### **On Vercel:**

1. **Create New Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Name it: `mumbies-admin-portal`

2. **Configure Build Settings**
   - **Root Directory:** `apps/admin`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add: `admin.mumbies.com`
   - Configure DNS (see DNS section below)

---

### **2. Deploy Partner Portal (partners.mumbies.com)**

#### **On Vercel:**

1. **Create New Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository (same repo, different project)
   - Name it: `mumbies-partner-portal`

2. **Configure Build Settings**
   - **Root Directory:** `apps/partner`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add: `partners.mumbies.com`
   - Configure DNS (see DNS section below)

---

## 🌐 DNS Configuration

### **For admin.mumbies.com:**

Add the following DNS records to your domain provider:

**Option A: Using CNAME (Recommended)**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: Using A Record**
```
Type: A
Name: admin
Value: 76.76.21.21
TTL: 3600
```

### **For partners.mumbies.com:**

**Option A: Using CNAME (Recommended)**
```
Type: CNAME
Name: partners
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: Using A Record**
```
Type: A
Name: partners
Value: 76.76.21.21
TTL: 3600
```

> **Note:** DNS propagation can take up to 24-48 hours, but usually completes within 1-2 hours.

---

## ✅ Verification Checklist

After deployment, verify each portal works:

### **Admin Portal (admin.mumbies.com)**
- [ ] Site loads without errors
- [ ] Login page displays correctly
- [ ] Can login with admin credentials
- [ ] Dashboard loads with statistics
- [ ] "All Accounts" page works
- [ ] "Partners" page works
- [ ] Navigation works
- [ ] Styling looks correct

### **Partner Portal (partners.mumbies.com)**
- [ ] Site loads without errors
- [ ] Login page displays correctly
- [ ] Can login with partner credentials
- [ ] Dashboard loads with partner data
- [ ] All tabs work (Opportunities, Rewards, etc.)
- [ ] Navigation works
- [ ] Styling looks correct

---

## 🔐 Test Accounts

### **Admin Account**
```
Email: admin@mumbies.com
Password: admin123
Test at: https://admin.mumbies.com/login
```

### **Partner Account**
```
Email: test@partner.com
Password: partner123
Test at: https://partners.mumbies.com/login
```

---

## 🐛 Troubleshooting

### **Build Fails**

**Issue:** Build fails with "Cannot resolve module"
**Solution:**
```bash
# Test build locally first
cd apps/admin && npm install && npm run build
cd ../partner && npm install && npm run build
```

### **Environment Variables Not Working**

**Issue:** Site loads but can't connect to Supabase
**Solution:**
1. Check environment variables in Vercel dashboard
2. Ensure they start with `VITE_` prefix
3. Redeploy after adding variables

### **404 on Refresh**

**Issue:** Page refreshes give 404 error
**Solution:** Vercel should auto-detect SPA routing, but if not:
1. Add `vercel.json` in app root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Custom Domain Not Working**

**Issue:** Domain shows "Not Found" or doesn't load
**Solution:**
1. Check DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check Vercel project has domain added
4. Ensure SSL certificate is generated (automatic on Vercel)

---

## 🔄 Continuous Deployment

Both portals are set up for **automatic deployments**:

- **Main branch push** → Auto-deploys to production
- **Pull request** → Creates preview deployment
- **Commit to any branch** → Creates branch preview

### **To trigger deployment:**
```bash
git add .
git commit -m "Update admin portal"
git push origin main
```

Vercel will automatically:
1. Detect changes in `apps/admin/` or `apps/partner/`
2. Build the affected portal
3. Deploy to production
4. Update DNS

---

## 📊 Monitoring

### **View Deployment Status:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select project (admin or partner)
3. View deployment logs

### **View Analytics:**
1. Vercel Dashboard → Project → Analytics
2. See page views, performance, errors

### **View Logs:**
1. Vercel Dashboard → Project → Logs
2. Filter by function, timeframe, or search

---

## 🚨 Emergency Rollback

If a deployment breaks production:

1. **Go to Vercel Dashboard**
2. **Select the project** (admin or partner)
3. **Click "Deployments"**
4. **Find the last working deployment**
5. **Click three dots** → **Promote to Production**

This instantly rolls back to the previous version.

---

## 🔧 Local Development

To test portals locally before deploying:

### **Admin Portal:**
```bash
npm run admin:dev
# Opens on http://localhost:5174
```

### **Partner Portal:**
```bash
npm run partner:dev
# Opens on http://localhost:5175
```

### **Both Portals:**
```bash
# In separate terminal windows
npm run admin:dev    # Terminal 1
npm run partner:dev  # Terminal 2
```

---

## 📝 Next Steps After Deployment

1. **Test all functionality** on both portals
2. **Update documentation** with live URLs
3. **Set up monitoring/alerts** in Vercel
4. **Configure Shopify webhooks** to point to Supabase edge functions
5. **Train team members** on using the admin portal

---

## 🆘 Support

If you encounter issues:

1. Check build logs in Vercel dashboard
2. Test build locally: `npm run build:all`
3. Review `ENTERPRISE_ARCHITECTURE.md` for architecture details
4. Check Supabase logs for database issues
5. Verify environment variables are set correctly

---

**Both portals deployed and ready for production!** 🎉
