# 🏢 Mumbies Enterprise Architecture

## Overview

Mumbies now uses a **three-portal enterprise architecture** separating customer shopping, partner management, and admin operations.

---

## 🏗️ Architecture Structure

```
mumbies-platform/
├── apps/
│   ├── admin/              # Admin Portal (admin.mumbies.com)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── admin/             # Admin pages
│   │   │   │   └── AdminLoginPage.tsx
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── dist/           # Build output
│   │   └── package.json
│   │
│   └── partner/            # Partner Portal (partners.mumbies.com)
│       ├── src/
│       │   ├── pages/
│       │   │   ├── PartnerDashboardPage.tsx
│       │   │   ├── PartnerLoginPage.tsx
│       │   │   └── PartnerApplyPage.tsx
│       │   ├── components/
│       │   │   ├── partner/           # Partner-specific components
│       │   │   └── ProtectedRoute.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── dist/           # Build output
│       └── package.json
│
├── packages/
│   └── shared/             # Shared Code (DRY Principle)
│       └── src/
│           ├── lib/
│           │   ├── supabase.ts
│           │   └── gifts.ts
│           ├── contexts/
│           │   ├── AuthContext.tsx
│           │   └── CartContext.tsx
│           ├── components/
│           │   ├── Button.tsx
│           │   ├── Badge.tsx
│           │   ├── Tooltip.tsx
│           │   └── ProtectedRoute.tsx
│           └── index.ts
│
└── supabase/               # Single Database (Supabase)
    └── migrations/         # Database migrations
```

---

## 🌐 Three-Portal System

### **1. mumbies.com** (Shopify)
- **Purpose:** Customer shopping experience
- **Platform:** Shopify hosted
- **Handles:** Product catalog, cart, checkout, orders
- **Not in this repo:** Managed by Shopify

### **2. partners.mumbies.com** (Custom React App)
- **Purpose:** Partner/nonprofit portal
- **Platform:** Vercel (or any hosting)
- **Users:** Approved rescue partners
- **Features:**
  - Track referrals & commissions
  - Request payouts
  - Manage giveaways
  - View opportunities
  - Access partner resources

### **3. admin.mumbies.com** (Custom React App)
- **Purpose:** Internal admin control center
- **Platform:** Vercel (or any hosting)
- **Users:** Mumbies team/admins only
- **Features:**
  - View all accounts (admins, partners, customers)
  - Manage partners (approve, suspend, track)
  - Process payouts
  - View analytics
  - Shopify integration dashboard
  - System configuration

---

## 🔐 Authentication Strategy

Each portal has **separate login pages** with role-based access:

| Portal | Domain | Role Required | Login Page |
|--------|--------|---------------|------------|
| Admin | admin.mumbies.com | `is_admin = true` | `/login` (Red theme) |
| Partner | partners.mumbies.com | `is_partner = true` | `/login` (Green theme) |
| Shopping | mumbies.com | Optional | Shopify handles |

**Security:**
- Row Level Security (RLS) in Supabase enforces data isolation
- Partners can only see THEIR data
- Admins can see ALL data
- Customers can only see THEIR orders

---

## 📦 Package Management

### **Shared Package** (`@mumbies/shared`)
Contains reusable code:
- Supabase client
- Auth context
- Cart context
- UI components (Button, Badge, Tooltip)
- Utility functions

**Import pattern:**
```typescript
import { supabase, useAuth, Button } from '@mumbies/shared';
import { sendGiftToLead } from '@mumbies/shared/lib/gifts';
```

---

## 🚀 Development Commands

### **Admin Portal**
```bash
# Development
npm run admin:dev      # Runs on localhost:5174

# Production build
npm run admin:build    # Outputs to apps/admin/dist/
```

### **Partner Portal**
```bash
# Development
npm run partner:dev    # Runs on localhost:5175

# Production build
npm run partner:build  # Outputs to apps/partner/dist/
```

### **Both Portals**
```bash
# Build both at once
npm run build:all
```

---

## 🔧 Deployment Strategy

### **Vercel Deployment**

**Admin Portal:**
1. Create new Vercel project
2. Import from GitHub
3. Set root directory: `apps/admin`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables: Copy from `.env`
7. Custom domain: `admin.mumbies.com`

**Partner Portal:**
1. Create new Vercel project
2. Import from GitHub
3. Set root directory: `apps/partner`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables: Copy from `.env`
7. Custom domain: `partners.mumbies.com`

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Shopify Store                        │
│                   (mumbies.com)                         │
│              Customer places order                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
             Shopify Webhook
                     │
                     ▼
     ┌───────────────────────────────┐
     │  Supabase Edge Function       │
     │  (shopify-order-webhook)      │
     │  - Store order in database    │
     │  - Calculate commissions      │
     │  - Update partner balance     │
     └────────────┬──────────────────┘
                  │
                  ▼
     ┌────────────────────────────────────┐
     │    Supabase Database (RLS)         │
     │    - orders table                  │
     │    - partner_transactions          │
     │    - nonprofits (partner balances) │
     └────────┬─────────────┬─────────────┘
              │             │
              │             │
              ▼             ▼
    ┌─────────────┐   ┌──────────────┐
    │   Partner   │   │    Admin     │
    │   Portal    │   │    Portal    │
    │  (Partner   │   │  (Admin sees │
    │  sees THEIR │   │  ALL data)   │
    │   data)     │   │              │
    └─────────────┘   └──────────────┘
```

---

## 🔮 Future: White-Label/Multi-Tenant

This architecture is ready for white-labeling:

### **Platform Level** (Future)
```
app.mumbiespartner.com → Platform admin for Mumbies team
```

### **Store Level** (Each customer gets)
```
Store A → partners.petstore.com
Store B → partners.animalrescue.com
Store C → partners.dogbrand.com
```

**Implementation:**
1. Add `tenant_id` column to all tables
2. Implement tenant isolation in RLS policies
3. Create platform admin for managing tenants
4. Add billing system per store
5. Support custom domains

---

## 💾 Database Design

**Single Supabase database** with proper RLS:

### **Key Tables:**
- `users` - All accounts (admins, partners, customers)
- `nonprofits` - Partner profiles
- `orders` - Synced from Shopify
- `partner_transactions` - Commission tracking
- `partner_leads` - Referral tracking
- `partner_giveaways` - Giveaway management

### **RLS Policies:**
```sql
-- Partners can only see THEIR data
CREATE POLICY "Partners see own data"
  ON partner_transactions
  FOR SELECT
  TO authenticated
  USING (nonprofit_id = (SELECT nonprofit_id FROM users WHERE id = auth.uid()));

-- Admins can see ALL data
CREATE POLICY "Admins see all data"
  ON partner_transactions
  FOR ALL
  TO authenticated
  USING ((SELECT is_admin FROM users WHERE id = auth.uid()));
```

---

## 🎯 Benefits of This Architecture

✅ **Clear Separation** - Each portal has one job
✅ **Shared Code** - DRY principle, reuse components
✅ **Independent Deploys** - Update admin without touching partner portal
✅ **Scalable** - Easy to add more portals
✅ **Secure** - RLS enforces data isolation
✅ **Future-Proof** - Ready for white-label/multi-tenant
✅ **Professional** - How Shopify, Stripe, AWS structure platforms

---

## 📝 Development Guidelines

### **When to add code to shared package:**
- Used by both admin AND partner portals
- General utility functions
- UI components with no portal-specific logic
- Database client & contexts

### **When to keep code in portal:**
- Portal-specific UI/logic
- Portal-specific routes/pages
- Portal-specific styling/branding

### **Import best practices:**
```typescript
// ✅ Good - Use shared package
import { supabase, useAuth } from '@mumbies/shared';

// ❌ Bad - Don't duplicate code
import { supabase } from './lib/supabase';  // Duplicate!
```

---

## 🚨 Important Notes

1. **Never mix portal concerns** - Admin code stays in admin, partner code in partner
2. **Always use RLS** - Every table must have proper security policies
3. **Shared package = DRY** - Don't duplicate code between portals
4. **Test builds regularly** - Run `npm run build:all` before committing
5. **Environment variables** - Keep `.env` in sync across portals

---

## 📞 Support

For questions about this architecture:
1. Check this documentation first
2. Review code in `apps/` and `packages/shared/`
3. Test locally with dev commands
4. Review deployment logs on Vercel

---

**Built for Mumbies with enterprise-grade architecture** 🐾
