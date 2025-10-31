# Mumbies Platform - Complete Functional Scope Documentation

## Platform Overview
Mumbies is a mission-driven e-commerce platform selling premium pet products while supporting animal rescue organizations. The platform enables rescues/shelters to become partners and earn lifetime commissions (5% of sales) from customers they refer.

---

## CUSTOMER-FACING FUNCTIONALITY

### 1. Public Shopping Experience

#### Homepage (`/`)
- **Hero Banner Carousel**: Rotating promotional banners with CTA buttons
- **Featured Products Section**: Curated product showcase
- **Brand Showcase**: Featured brand partners
- **Rescue Impact Section**: Mission-driven messaging about supporting rescues
- **Navigation**: Links to Shop, Brands, Rescues, Impact pages

#### Shop Page (`/shop`)
- **Product Grid**: All products displayed as cards
- **Filtering System**:
  - Category filter (Food, Treats, Toys, Accessories)
  - Brand filter (multi-select)
  - Price range slider
  - Attribute filters (Grain-Free, Made in USA, etc.)
- **Sorting Options**: Price (low-high, high-low), Name (A-Z, Z-A), Newest
- **Search**: Product name search
- **Pagination**: Product list with load more

#### Product Detail Page (`/product/:slug`)
- Product images
- Price and availability
- Full description
- Product attributes (ingredients, features)
- Brand information with link
- "Add to Cart" functionality
- Variant selection (size, flavor) when applicable
- Product reviews section with star ratings
- Review submission form (authenticated users only)
- Related products suggestions

#### Shopping Cart (`/cart`)
- Line item display with product images
- Quantity adjustment (+/- buttons)
- Remove item functionality
- Subtotal calculation
- "Continue Shopping" button
- "Proceed to Checkout" button
- Empty cart state

#### Checkout Flow (`/checkout`)
- **Demo Mode Warning**: Clear notice this is non-transactional
- **Donation Slider** (0-5%):
  - Slider left: 5% cashback to customer
  - Slider right: 5% donation to general rescue pool
  - Real-time calculation display
  - If customer has rescue attribution: Additional fixed 5% to their rescue
- Order summary
- Shipping address form
- "Place Order" button (creates demo order in database)

### 2. Authentication & User Account

#### Login System (`/login`)
- **Magic Link Authentication** (passwordless)
- User enters email
- Receives secure login link via email
- One-click login from email
- Auto-creates user profile on first login

#### Customer Dashboard (`/account`)
Six tabs of functionality:

**Tab 1: Account Info**
- Edit name, email
- View referral code
- Copy referral link

**Tab 2: Orders**
- Order history table
- Order details (items, amounts, dates)
- Order status
- Download receipts (future)

**Tab 3: Impact Tracking**
- Total lifetime spending
- Total donated to rescues
- Total cashback earned
- Number of orders placed
- Attribution to specific rescue (if applicable)
- "Your Impact" visualization

**Tab 4: Subscriptions**
- View active subscriptions
- Manage delivery frequency
- Pause/cancel subscriptions
- Edit subscription items

**Tab 5: Payment Methods**
- Saved credit cards (demo mode)
- Add/remove payment methods
- Set default payment

**Tab 6: Address Book**
- Saved shipping addresses
- Add/edit/delete addresses
- Set default address

### 3. Rescue/Nonprofit Directory

#### Rescues Page (`/rescues`)
- Directory of partner rescue organizations
- Search by name or location
- Filter by state/region
- Each rescue shows:
  - Logo
  - Name and mission
  - Location
  - Link to profile page
  - "Support This Rescue" button

#### Rescue Profile Page (`/rescue/:slug`)
- Rescue logo and hero image
- Mission statement
- About section
- Impact statistics
- Curated product recommendations
- "Shop & Support" functionality
- Unique referral link for rescue
- Social share buttons

### 4. Brand Directory

#### Brands Page (`/brands`)
- Grid of brand partners
- Brand logos and names
- Link to brand profile pages

#### Brand Profile Page (`/brand/:slug`)
- Brand story and mission
- Product line from this brand
- Brand values/certifications
- Link to brand website
- "Shop This Brand" filtered view

---

## PARTNER (RESCUE/NONPROFIT) FUNCTIONALITY

### Partner Dashboard (`/partner/dashboard`)
Seven comprehensive tabs:

### TAB 1: Overview

**Purpose**: Quick snapshot of partner performance and earnings

**Key Metrics (4 stat cards)**:
- **Available Balance**: Current withdrawable commission balance in dollars
- **Lifetime Earnings**: Total all-time commissions + referral bonuses
- **Active Leads**: Number of registered users not yet converted (within 90-day window)
- **Total Customers**: Lifetime attributed customers who have purchased

**Recent Activity Feed**:
- Chronological list of recent events
- Shows: New leads, conversions, commission earnings, referral bonuses
- Each item shows: Action, customer email, amount, timestamp
- Scrollable list (last 20 activities)

**Quick Actions**:
- View detailed analytics (links to other tabs)
- Withdraw or convert balance (redirects to payout settings)

---

### TAB 2: Rewards (Challenges & Incentives)

**Purpose**: Gamification system where partners complete challenges to earn bonuses, products, and perks

#### Section 1: Top Stats + How It Works (Reorganized Layout)
**Left Side (1/3 width)**: "How Rewards Work" Box
- Explains challenge activation and completion
- 4 key bullet points about the system
- Blue info-style background

**Right Side (2/3 width)**: Three Stats Cards
- **Available**: Number of challenges ready to start
- **In Progress**: Active challenges being tracked
- **Completed**: Total claimed rewards

#### Section 2: Available Challenges
**Three Column Grid** showing challenge types:

**Column 1: Sales Challenges** (Green borders)
- Icon (outline style, no background)
- Challenge title (e.g., "First $1,000 Milestone")
- Description
- Reward callout (e.g., "$100 Cash Bonus")
- Goal requirement
- "Start Challenge" button

**Column 2: Lead Challenges** (Blue borders)
- Icon (outline style)
- Challenge title (e.g., "Refer 25 New Leads")
- Description
- Reward (e.g., "Free Product Bundle")
- Goal requirement
- "Start Challenge" button

**Column 3: Coming Soon** (Purple borders)
- Icon (outline style)
- Challenge title
- Description
- Reward preview
- Start date indicator
- No badge inside cards (badge stays in column header)

**Card Design**:
- Clean white background
- Colored border (varies by type)
- Outline icons with color coding (no solid backgrounds)
- Larger title font for readability
- Simplified reward display (no gradients)
- Hover effect: border color intensifies

#### Section 3: Challenge Activity Stream (NEW)
**Purpose**: Shows active and recently completed challenges in one scrollable feed

**For Active Challenges**:
- Challenge icon and title
- Reward description
- Progress bar with percentage
- Current value vs. target value
- "IN PROGRESS" badge (blue)

**For Completed Challenges**:
- Challenge icon and title
- Reward description
- Completion date
- "COMPLETED" badge (green with checkmark)

**Features**:
- Scrollable container (max height with overflow)
- Shows active challenges first, then 5 most recent completed
- Hover effect for each row
- Empty state if no challenges

#### Section 4: Completed Challenges Table (if partner has history)
- Tabular view of all claimed rewards
- Columns: Challenge name, Reward, Completed date, Status
- Filterable and sortable
- Shows earned badges/icons

---

### TAB 3: Giveaways

**Purpose**: Partners can run social media giveaways using unlocked product bundles to generate leads

#### Section 1: Giveaway Stats
- Total giveaway entries
- Total leads generated from giveaways
- Active giveaways count

#### Section 2: Active Giveaways (if any exist)
Each active giveaway displays as a card with:
- **Header Image**: Mumbies product bundle photo
- Giveaway title and description
- Status badge (ACTIVE/ENDED)
- **Two stat boxes**:
  - Total entries count (blue)
  - Total leads generated count (green)
- End date
- Shareable landing page URL
- "Copy Link to Share" button

#### Section 3: Available Giveaway Bundles
**Grid of unlockable bundles** (3 across):

Each bundle shows:
- **Product Image**: Mumbies variety box photo
- Tier badge (Starter/Deluxe/Ultimate/VIP)
- Bundle name and description
- Retail value displayed prominently
- Required sales threshold to unlock
- **For Locked Bundles**:
  - Progress bar showing sales toward goal
  - Dollar amount remaining
  - Grayed out appearance
- **For Unlocked Bundles**:
  - "UNLOCKED" badge (green)
  - Full color appearance
  - "Create Giveaway" button

**Bundle Tiers** (example):
- Starter Pack ($75 value) - Unlock at $500 sales
- Deluxe Bundle ($150 value) - Unlock at $1,500 sales
- Ultimate Package ($300 value) - Unlock at $5,000 sales
- VIP Year Supply ($1,000 value) - Unlock at $20,000 sales

#### Giveaway Creation Flow:
1. Click "Create Giveaway" on unlocked bundle
2. Modal opens with form:
   - Giveaway title (pre-filled, editable)
   - Description (pre-filled, editable)
   - Duration (7/14/30/60 days)
   - Preview of bundle
3. Click "Launch Giveaway"
4. System creates unique landing page
5. Partner receives shareable link

#### Giveaway Landing Page (`/giveaway/:slug`)
Public-facing page showing:
- Giveaway title and description
- Product bundle image
- Entry form (name + email)
- Timer showing time remaining
- Entry count
- "Powered by [Rescue Name]" attribution
- Social share buttons
- Terms and conditions

---

### TAB 4: Opportunities (Gift Incentives)

**Purpose**: View expiring leads (customers who signed up via partner link but haven't purchased yet) and send gift incentives to encourage conversion

#### Section 1: Header + How It Works
**Header**: Gradient banner explaining gift incentive system

**Layout Grid** (similar to Rewards tab):
**Left Side (1/3 width)**: "How Gift Incentives Work"
- 5 bullet points explaining the system
- Key facts: 14-day gift expiration, 90-day lead window
- Auto-refund policy

**Right Side (2/3 width)**: Four Stats Cards (2x2 grid)
- **Expiring Leads**: Count within 30 days
- **Balance**: Available balance to send
- **Active Gifts**: Number of gifts sent
- **Conversions**: All-time converted leads

#### Section 2: Two-Column Layout

**Left Column: Expiring Leads**
Shows leads within 30 days of expiration, sorted by urgency:

**Each lead card** displays:
- Email address
- Days until expiration (e.g., "15d left")
- Registration date
- Current gift balance (if any gifts sent)
- **Color-coded urgency**:
  - Red background: ≤7 days
  - Orange background: 8-14 days
  - Yellow background: 15-30 days

**Gift sending interface** (compact, inline):
- Quick-send buttons: $5, $10, $15
- Custom amount input field (restored)
- "Send $X" button
- Shows current partner balance
- Disables if insufficient balance

**Email Preview** (clicking Send opens modal):
- Preview of email lead will receive
- Shows partner organization name
- Gift amount prominently displayed
- Expiration date shown (14 days)
- "Claim Gift" button preview
- Partner can confirm or cancel

**Right Column: Two Sections**

**Section 1: Gifted Leads**
Shows leads who have received gifts:
- Lead email
- Gift amount sent
- Current balance remaining
- Status badge (Pending/Claimed)
- Days until gift expires
- Sent date

**Section 2: Recent Activity**
Activity stream of gift-related actions:
- "Sent $5.00 gift to [email]" entries
- Date/time of each action
- Amount displayed as "-$5.00" (deduction from balance)
- Scrollable list

**Empty States**:
- No expiring leads: Encouraging message
- No gifts sent: Prompt to send first gift
- No activity: Placeholder message

---

### TAB 5: Referrals

**Purpose**: Manage two separate referral programs - customer referrals and nonprofit referrals

#### Section 1: Referral Dashboard Stats
- Total referral link clicks
- Total new signups (leads)
- Active leads (within 90-day window)
- Converted customers
- Conversion rate percentage

#### Section 2: Your Referral Tools
**Unique Referral Link**:
- Display partner's custom link: `mumbies.com/r/[partner-code]`
- One-click copy button
- QR code for offline sharing
- Social media share buttons (Facebook, Twitter, Email, SMS)

**Email Template Generator**:
- Pre-written email templates
- Customizable with partner's story
- Copy template button
- Preview how link appears

**Social Media Posts**:
- Pre-designed post templates
- Image assets for Instagram/Facebook
- Copy-paste captions with link

#### Section 3: Customer Referral Program ($5/$5)
**How It Works**:
- Customer signs up via partner link
- Makes first purchase
- Both partner and customer get $5 bonus
- Customer becomes attributed to partner (5% lifetime commissions)

**Active Customer Referrals Table**:
Columns:
- Customer email
- Signup date
- Days remaining (of 90-day window)
- Status (Pending/Converted/Expired)
- First purchase date (if converted)
- Commission earned so far

**Filters**:
- Show: All / Pending / Converted / Expiring Soon

#### Section 4: Nonprofit Referral Program ($500 each)
**How It Works**:
- Partner refers another rescue/nonprofit
- Referred org completes application
- Both get $500 when referred org makes first $1,000 in attributable sales

**Nonprofit Referral Form**:
- Referred nonprofit name
- Contact person name
- Contact email
- Relationship to partner
- Submit button

**Pending Nonprofit Referrals**:
Shows submitted referrals with status:
- Nonprofit name
- Submitted date
- Status: Application Pending / Active / Qualified / Paid
- Progress toward $1,000 threshold (if active)
- Estimated payout date

**Completed Nonprofit Referrals**:
- List of successful referrals
- Payout date and amount
- Referred org performance stats

---

### TAB 6: Products

**Purpose**: Manage partner's curated product recommendations

#### Section 1: Curated Product List
Partners can create custom product lists for their supporters:

**Product Selection Interface**:
- Search all Mumbies products
- Filter by category, brand
- "Add to My List" button for each product
- Shows already-added products

**My Product List** (current selections):
- Draggable product cards for ordering
- Each shows: Image, name, price
- "Remove" button
- "Save Order" button
- These products appear on partner's public profile page

#### Section 2: Product Performance
Analytics showing which products partners' customers buy most:
- Product name and image
- Units sold via partner
- Revenue generated
- Commission earned
- Time period filter (30/60/90 days, all-time)

---

### TAB 7: Profile

**Purpose**: Manage partner organization's public profile and settings

#### Section 1: Organization Information
Editable fields:
- Organization name
- Mission statement (textarea)
- About section (rich text editor)
- Website URL
- Email address
- Phone number
- Physical address
- Tax ID / EIN

#### Section 2: Branding
- **Logo Upload**: Square logo (recommended 500x500px)
- **Cover Image Upload**: Banner for profile page (1200x400px)
- **Brand Colors**: Primary color picker
- Preview of how profile will appear

#### Section 3: Social Media Links
- Facebook URL
- Instagram URL
- Twitter URL
- YouTube URL
- TikTok URL

#### Section 4: Payout Information
**Bank Account Details**:
- Account holder name
- Bank name
- Routing number
- Account number
- Account type (Checking/Savings)

**PayPal Details**:
- PayPal email address

**Alternative: Check Payment**:
- Mailing address for physical checks

**Payout Preferences**:
- Minimum payout threshold ($25, $50, $100, $250)
- Payout frequency (Weekly/Monthly/Quarterly)
- Preferred method (Bank/PayPal/Check)

#### Section 5: Notification Settings
Email notification preferences:
- New lead signup
- Lead converts to customer
- Gift incentive claimed
- Gift incentive expired
- Commission earned (daily digest)
- Weekly summary report
- Monthly performance report

#### Section 6: Profile Visibility
- **Public Profile**: Toggle to show/hide profile in rescue directory
- **Accept New Leads**: Toggle to pause accepting new referrals temporarily
- **Profile URL**: Display public profile link

---

## PARTNER APPLICATION FLOW

### Apply to Become a Partner (`/partner/apply`)

Multi-step application form:

#### Step 1: Organization Type
- Select: Animal Rescue / Shelter / Sanctuary / Other
- 501(c)(3) status confirmation

#### Step 2: Basic Information
- Organization legal name
- DBA (if different)
- EIN/Tax ID
- Website
- Founded year
- Annual budget range

#### Step 3: Contact Information
- Primary contact name
- Title/role
- Email
- Phone
- Physical address

#### Step 4: Mission & Impact
- Mission statement (textarea)
- Animals served (species, count)
- Geographic area served
- Current funding sources
- Why interested in partnership

#### Step 5: Social Media & Audience
- Facebook URL and follower count
- Instagram URL and follower count
- Email list size
- Average monthly website visitors

#### Step 6: Supporting Documents (optional)
- Upload 501(c)(3) determination letter
- Upload recent annual report
- Upload promotional materials

#### Step 7: Agreement
- Partner terms and conditions display
- Commission structure explanation (5% lifetime)
- Checkbox: "I agree to terms"
- Electronic signature field

**Submit Button** → Application goes to admin review

#### Post-Submission
- Confirmation page with application ID
- Email confirmation sent
- Estimated review timeline (3-5 business days)
- Link to check application status

---

## ADMIN FUNCTIONALITY (Future Enhancement)

### Partner Applications Review
- View pending applications
- Application details review
- Approve/deny with reason
- Auto-sends approval email with login link

### Partner Management
- View all partners
- Filter by status, performance
- View partner dashboards
- Adjust commission rates
- Pause/suspend partners

### Payout Management
- View pending payouts
- Generate payout reports
- Process batch payments
- Track payment history

---

## TECHNICAL CAPABILITIES

### Database Structure (Supabase PostgreSQL)
**Core Tables**:
- `users` - All platform users (customers and partners)
- `nonprofits` - Partner organizations
- `products` - Product catalog
- `brands` - Brand partners
- `orders` - Customer orders
- `order_items` - Line items
- `partner_leads` - Referred leads with 90-day attribution
- `partner_incentives` - Gift incentives sent to leads
- `lead_balances` - Current gift balance for each lead
- `partner_rewards` - Available challenges
- `partner_reward_progress` - Partner progress on challenges
- `partner_giveaways` - Created giveaways
- `giveaway_entries` - Giveaway participants
- `product_reviews` - Customer reviews

### Authentication
- Supabase Auth (Magic Link)
- Row-Level Security (RLS) policies
- User sessions and JWT tokens
- Email verification flow

### Key Features
- Real-time data updates
- Secure file storage (logos, images)
- Automated background jobs (gift expiration, lead expiration)
- Email notifications (via Supabase)
- RESTful API architecture

### Frontend Architecture
- React 18 with TypeScript
- Vite build tool
- React Router for navigation
- Context API for state management (Auth, Cart)
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design (mobile-first)

---

## USER ROLES & PERMISSIONS

### Public User (Not Logged In)
- Browse products
- View brand and rescue profiles
- Add items to cart
- Cannot checkout or review products

### Authenticated Customer
- All public features
- Complete purchases
- View order history
- Track impact
- Write product reviews
- Refer friends

### Partner (Nonprofit)
- All customer features
- Access partner dashboard (7 tabs)
- View earnings and analytics
- Send gift incentives
- Create giveaways
- Manage curated products
- Refer other nonprofits

### Admin (Future)
- All platform access
- Review applications
- Manage partners
- Process payouts
- View analytics
- Manage products/brands

---

## KEY BUSINESS RULES

### Commission Structure
- 5% of every sale goes to attributed partner (lifetime)
- Additional 5% flexible based on customer's donation slider choice
- Commissions calculated on subtotal (before tax/shipping)

### Lead Attribution
- 90-day window to make first purchase
- First-click attribution model
- Lead converts to customer on first purchase
- Partner earns 5% commission forever on that customer

### Gift Incentive Rules
- Sent from partner's earned balance
- 14-day expiration period
- Auto-refunds if unused or lead expires
- No limit on number of gifts per lead
- Partner can only send what they have in balance

### Giveaway Rules
- Bundles unlock at sales thresholds
- Partners ship prizes directly (Mumbies provides)
- Lead must enter with email
- One entry per email address
- Winners drawn randomly at end date

### Withdrawal/Payout Rules
- Minimum $25 threshold
- Processed weekly/monthly based on preference
- Partner can convert balance to shopping credit (10% bonus)

---

## DEMO MODE LIMITATIONS

Currently the platform operates in **demo mode**, meaning:

### What Works (Fully Functional):
✅ User registration and authentication
✅ Product browsing and filtering
✅ Shopping cart
✅ Partner dashboard and all analytics
✅ Referral tracking
✅ Gift incentive system
✅ Challenge/rewards tracking
✅ Giveaway creation and management
✅ Product reviews

### What's Simulated (Demo Only):
⚠️ Checkout process (creates order record but no payment)
⚠️ Payout processing (shows interface but doesn't transfer funds)
⚠️ Email notifications (logs to console instead of sending)
⚠️ Inventory management (infinite stock)

### Future Production Requirements:
- Stripe payment integration
- Shippo shipping integration
- SendGrid email service
- Shopify product sync
- Real inventory management
- Fraud prevention
- Tax calculation service
- Customer service portal

---

## SUMMARY

This platform provides a complete ecosystem where:
1. **Customers** shop for premium pet products while supporting rescues
2. **Partners** earn sustainable revenue through referrals and engagement
3. **Brands** gain distribution and mission-aligned marketing
4. **Rescues** receive both direct donations and lifetime commissions

The partner dashboard is the heart of the system, giving rescues powerful tools to:
- Track their earnings and impact
- Engage leads with gift incentives
- Gamify performance through challenges
- Generate new leads via giveaways
- Build their brand through curated product lists
- Scale revenue through referral programs

All while maintaining a clean, intuitive interface with mission-driven design.
