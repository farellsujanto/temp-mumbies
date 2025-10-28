# Mumbies Pet Marketplace - Prototype

## Overview
A mission-driven pet product marketplace that enables animal rescues and shelters to generate sustainable revenue through customer referrals. Built with React, TypeScript, Supabase, and Tailwind CSS.

## ✅ Implemented Features

### Core Shopping Experience
- **Homepage** with rotating banner carousel and featured sections
- **Product Catalog** with advanced filtering (category, brand, price, attributes)
- **Product Detail Pages** with brand information
- **Shopping Cart** with quantity management
- **Checkout Flow** with donation slider (demo mode)

### Authentication & User Accounts
- **Magic Link Authentication** (passwordless login via Supabase)
- **Customer Dashboard** with impact tracking:
  - Total orders, spending, rescue donations, and cashback earned
  - Attribution to specific rescue organizations
  - Referral program access

### Rescue/Nonprofit Features
- **Rescue Directory** with search and filtering
- **Rescue Profile Pages** showing mission and curated products
- **Partner Application Flow** for new rescue organizations
- **Attribution System** - 5% lifetime commissions to attributed rescues

### Donation Slider
- Interactive slider at checkout (0-5%)
- Left: 5% cashback to customer | Right: 5% to general rescue pool
- Real-time calculation display
- Additional 5% fixed donation to attributed rescue (if applicable)

## 🗄️ Database Schema

### Tables
- `users` - Customer profiles with impact metrics
- `nonprofits` - Rescue organizations and shelters
- `brands` - Pet product brands with stories
- `products` - Product catalog with attributes
- `orders` - Order history (demo mode)
- `order_items` - Line items
- `banners` - Homepage carousel content
- `nonprofit_curated_products` - Rescue recommendations
- `referral_leads` - 90-day attribution tracking
- `nonprofit_referrals` - $500 nonprofit referral program
- `customer_referrals` - $5/$5 customer referral program

### Demo Data Seeded
- **4 Brands**: Mumbies, Stella & Chewy's, Yummies, Natural Paws
- **12 Products** across all categories (food, treats, toys, accessories)
- **1 Nonprofit**: Wisconsin Humane Society
- **5 Homepage Banners**

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Magic Link)
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── Badge.tsx
│   └── ProductCard.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/              # Route pages
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── AccountPage.tsx
│   ├── RescuesPage.tsx
│   ├── RescueProfilePage.tsx
│   └── PartnerApplyPage.tsx
├── lib/
│   └── supabase.ts     # Supabase client config
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## 🎯 Key User Flows

1. **New Customer Journey**
   - Browse products → Add to cart → Login/Signup → Checkout (demo) → View impact

2. **Rescue-Attributed Customer**
   - Click rescue link → Create account → Purchase → 5% goes to rescue forever

3. **Nonprofit Partnership**
   - Apply via form → Admin approves → Access Partner Center → Create storefront

4. **Donation Slider Interaction**
   - Adjust slider at checkout between cashback and general donations
   - See real-time impact calculations

## �� Authentication

Uses Supabase Magic Link authentication:
- User enters email → Receives link → Clicks to login
- Automatic user profile creation on first login
- Unique referral code generated for each user

## 💳 Demo Mode

**Important**: This is a prototype with demo checkout:
- Orders are tracked in the database
- No payment processing occurs
- Modal confirms "Demo Mode" at checkout
- All calculations are displayed but not executed

## 🎨 Design Principles

- Clean, natural aesthetic inspired by Grove.co and Thrive Marketplace
- Mission-driven messaging throughout
- Green color scheme representing growth and sustainability
- Prominent calls-to-action for nonprofit partnerships
- Mobile-first responsive design

## ⚙️ Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚧 Future Enhancements (Not Yet Built)

The comprehensive spec includes many additional features for the full production version:
- Real payment processing (Stripe)
- Nonprofit Partner Center dashboard
- Admin panel for managing applications and payouts
- Brand profile pages
- Advanced analytics
- Email notifications
- Shopify integration
- Video content
- Mobile app

## 🧪 Testing the Prototype

1. **Browse Products**: Navigate to `/shop` to see filtering and sorting
2. **View Product Details**: Click any product to see detail page
3. **Add to Cart**: Test shopping cart functionality
4. **Login**: Use any email - check inbox for magic link
5. **Checkout**: Complete demo checkout and see donation slider
6. **Dashboard**: View impact metrics at `/account`
7. **Rescues**: Browse partner directory at `/rescues`
8. **Apply**: Test nonprofit application at `/partner/apply`

## 📊 Database Stats

- Brands: 4
- Products: 12
- Nonprofits: 1 (Wisconsin Humane Society)
- Banners: 5

## 🎉 Success Criteria Met

This prototype successfully demonstrates:
✅ Complete shopping experience with mission-driven messaging
✅ Donation slider mechanism with real-time calculations
✅ Customer dashboard with impact tracking
✅ Rescue attribution system
✅ Nonprofit application flow
✅ Rescue directory and profiles
✅ Referral program structure
✅ Responsive, production-quality design

**Goal Achieved**: Validate the concept and secure buy-in for the full production platform.
