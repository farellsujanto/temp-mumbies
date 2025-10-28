# Mumbies Pet Marketplace - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Modern web browser

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with Supabase credentials.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## 🎮 Demo Walkthrough

### 1. Browse Products
- Visit the homepage to see the banner carousel
- Click **"Shop"** in navigation or homepage
- Use filters to browse by category, brand, price, or attributes
- Click any product to view details

### 2. Add Items to Cart
- Click the shopping cart icon on product cards
- Navigate to `/cart` to view your cart
- Adjust quantities or remove items

### 3. Test Authentication
- Click **"Login"** in navigation
- Enter any email address (e.g., `test@example.com`)
- Check your email inbox for the magic link
- Click the link to authenticate
- User profile is auto-created on first login

### 4. Complete Demo Checkout
- With items in cart, proceed to checkout
- **Important**: You must be logged in to checkout
- Fill in dummy shipping information
- **Try the Donation Slider!**
  - Slide left for more cash back
  - Slide right for more general rescue donations
  - See real-time calculations
- Click "Place Demo Order"
- View the order summary modal

### 5. View Customer Dashboard
- After login, click **"Account"** in navigation
- See impact metrics (will be $0 for new users)
- View rescue attribution section (if attributed)
- Explore referral program options

### 6. Browse Rescue Directory
- Click **"Partner Rescues"** in navigation
- View Wisconsin Humane Society profile
- See their curated product recommendations
- Search and filter rescues

### 7. Apply as Nonprofit Partner
- Navigate to `/partner/apply`
- Fill out the partnership application form
- Submit (application will appear in admin queue)

## 📊 Database Contents

The database has been seeded with demo data:

### Brands (4)
- **Mumbies** - House brand with premium products
- **Stella & Chewy's** - Raw-inspired dog food
- **Yummies** - Bulk treats brand
- **Natural Paws** - Eco-friendly accessories

### Products (12)
- 4 Food products
- 3 Treats
- 2 Toys
- 3 Accessories

### Nonprofit Partners (1)
- **Wisconsin Humane Society**
  - Location: Milwaukee, WI
  - Status: Active
  - View profile at: `/rescues/wisconsin-humane-society`

### Homepage Banners (5)
- Welcome banner
- Brand spotlight (Stella & Chewy's)
- Treats promotion
- Partner spotlight (WHS)
- Impact dashboard CTA

## 🎯 Key Features to Test

### ✅ Donation Slider
The star feature! At checkout:
- Slider ranges from 0-5%
- Left end = 5% cashback to customer
- Right end = 5% to general rescue pool
- Attributed customers get additional 5% to their rescue
- Real-time calculation updates

### ✅ Rescue Attribution
To test attribution:
1. Log out if logged in
2. Visit rescue profile: `/rescues/wisconsin-humane-society`
3. Click "Start Shopping" or register through their link
4. Create account while on rescue-attributed session
5. Make demo purchase
6. Check dashboard - shows WHS attribution

### ✅ Product Filtering
On `/shop` page:
- Filter by category (food, treats, toys, accessories)
- Filter by brand (Mumbies, Stella & Chewy's, etc.)
- Filter by price range
- Filter by attributes (Made in USA, Organic, B Corp, etc.)
- Sort by name or price
- Multiple filters combine

### ✅ Responsive Design
- Test on mobile devices or resize browser
- Mobile navigation menu
- Touch-friendly interactions
- Responsive product grids

## 🔐 Authentication Flow

### Magic Link Process:
1. User enters email on `/login`
2. Supabase sends magic link email
3. User clicks link in email
4. Auto-redirected to app as authenticated
5. User profile auto-created with referral code
6. Dashboard and account features unlocked

### First-Time User:
- Profile automatically created
- Unique referral code generated
- Ready to make purchases
- Can be attributed to rescue

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Preview production build
npm run preview
```

## 📁 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with carousel |
| `/shop` | Product catalog with filtering |
| `/product/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with donation slider |
| `/login` | Magic link authentication |
| `/account` | Customer dashboard |
| `/rescues` | Rescue directory |
| `/rescues/:slug` | Individual rescue profile |
| `/partner/apply` | Nonprofit application form |

## 🎨 Design Features

- **Color Scheme**: Green (growth/sustainability) with natural tones
- **Typography**: Clean, modern sans-serif
- **Badges**: Visual indicators for product attributes
- **Animations**: Smooth transitions and hover states
- **Icons**: Lucide React icon library
- **Cards**: Consistent elevation and shadows

## 💡 Tips for Demo

1. **Show the slider first** - It's the unique differentiator
2. **Highlight rescue attribution** - Show how it locks for life
3. **Demonstrate filtering** - Show how easy it is to find products
4. **Show impact tracking** - Dashboard metrics are compelling
5. **Mobile responsive** - Show it works on all devices

## 🐛 Known Limitations (Demo Mode)

- **No real payment processing** - Checkout is demo only
- **No email sending** - Magic link works but relies on Supabase
- **Demo data only** - Limited product catalog
- **No admin panel** - Planned for production
- **No brand pages** - Planned for production
- **No partner center** - Planned for production

## 📝 Next Steps for Production

After stakeholder approval:
1. Build admin panel for managing applications
2. Create nonprofit Partner Center dashboard
3. Build brand profile pages
4. Integrate Stripe for real payments
5. Implement payout system
6. Add email notifications
7. Build analytics and reporting
8. Create Shopify integration
9. Add video content support
10. Develop mobile app

## 🎉 Success!

You now have a fully functional prototype demonstrating:
- Mission-driven e-commerce experience
- Innovative donation slider mechanism
- Rescue attribution system
- Customer impact tracking
- Nonprofit partnership flow
- Production-quality design

**Ready to validate the concept and secure buy-in for the full platform!**
