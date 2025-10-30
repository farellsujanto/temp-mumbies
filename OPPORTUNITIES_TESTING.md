# Opportunities System - Testing Guide

## What's Been Built

### 1. Email Preview Modal
When partners click "Send" on a gift, they see a beautiful email preview showing:
- Organization logo (or mail icon fallback)
- Gift amount in large, prominent display
- Expiration date (14 days from send)
- "Claim Gift" button
- Clear messaging about the gift terms

### 2. Automatic Balance Connection
- Balance automatically pulls from unpaid commissions + referral earnings
- Shows as "Available Balance" in the Opportunities tab
- Updates in real-time as gifts are sent

### 3. Fake Lead Data Stream
The migration creates 15 realistic test leads:
- Registered 60-90 days ago (various dates)
- Expiring in the next 0-30 days
- Sorted by urgency (soonest to expire first)
- 3 leads already have $10 gift balances
- Color-coded by urgency:
  - **RED**: 7 days or less
  - **ORANGE**: 8-14 days
  - **YELLOW**: 15-30 days

### 4. Gift Lifecycle Flow

#### Step 1: Partner Sends Gift
1. Partner sees expiring leads sorted by urgency
2. Clicks quick amount ($5, $10, $15) or enters custom
3. Email preview modal appears
4. Partner confirms send
5. Gift record created with status: `pending`
6. Email would be sent to lead (simulated)

#### Step 2: Lead Claims Gift
(To be implemented - currently pending)
- Lead receives email with "Claim Gift" link
- Clicks claim → gift status changes to `active`
- Amount added to their balance via `upsert_lead_balance()`

#### Step 3: Lead Uses Gift
(To be implemented)
- Lead makes purchase
- Gift balance applied to order
- Lead converts to customer
- Partner earns commission

#### Step 4: Gift Expires (Auto-Refund)
Handled by nightly batch function `expire_and_refund_incentives()`:
- Finds gifts past 14-day expiration
- Changes status from `active` to `refunded`
- Removes amount from lead balance
- Returns amount to partner balance
- **Activity item created** showing refund

## Testing the System

### Initial Setup
1. Log in as partner (Wisconsin Humane Society test account)
2. Navigate to Opportunities tab
3. You should see 15 test leads with varying expiration dates

### Test Scenarios

#### Scenario 1: Send a Gift
1. Find a lead expiring soon (red/orange)
2. Click "$10" quick button
3. Email preview modal appears
4. Review the email preview
5. Click "Confirm & Send Gift"
6. ✅ Success message appears
7. ✅ Lead list refreshes

#### Scenario 2: Check Balance
1. Look at "Available Balance" card
2. Should show total unpaid commissions
3. After sending gift, balance decreases by gift amount
4. (In production, this would be live)

#### Scenario 3: High Priority Leads
1. Check "High Priority" count (purple card)
2. Should show leads with ≤14 days
3. These are the hottest opportunities

#### Scenario 4: Custom Amount
1. Enter custom amount in text field
2. Click "Send $X.XX" button
3. Preview shows custom amount
4. Expiration date calculates correctly

## Database Tables

### partner_leads
Tracks all referred leads:
- `id`: Unique identifier
- `partner_id`: Which partner referred them
- `email`: Lead's email
- `registered_at`: When they signed up
- `expires_at`: 90 days from registration
- `status`: active | converted | expired
- `first_purchase_at`: NULL until they buy

### partner_incentives
Records of all gifts:
- `id`: Unique identifier
- `partner_id`: Who sent it
- `lead_id`: Who received it
- `amount`: Gift amount
- `expires_at`: 14 days from creation
- `status`: pending | active | used | expired | refunded
- `used_at`: When lead used it
- `refunded_at`: When it was refunded

### lead_balances
Current balance for each lead:
- `lead_id`: Primary key
- `balance`: Current available balance
- `lifetime_received`: Total ever received
- `lifetime_spent`: Total ever used

## Key Features

### Auto-Refund on Expiration
The system automatically:
1. Finds expired gifts (14+ days old, unused)
2. Marks them as `refunded`
3. Removes from lead balance
4. Returns to partner balance
5. Creates activity log entry

### Activity Tracking
(To be enhanced)
- Gift sent: "Sent $X to [email]"
- Gift claimed: "[email] claimed $X gift"
- Gift used: "[email] used $X toward purchase"
- Gift expired: "$X refunded from [email]"

## Future Enhancements

### Phase 2: Lead Claiming
- Email link to claim gift
- Add to user balance when claimed
- Send confirmation notification

### Phase 3: Activity Feed
- Complete activity log in Overview tab
- Filter by type (gifts, claims, refunds)
- Export for accounting

### Phase 4: Analytics
- Conversion rates with vs without gifts
- ROI tracking per lead
- Optimal gift amount suggestions
- A/B testing different strategies

### Phase 5: Automation
- Auto-send at X days before expiry
- Tiered gifts based on lead quality
- Scheduled reminders to leads
- Predictive conversion scoring

## Notes

### Balance Calculation
Currently uses:
```typescript
partnerBalance = total_commissions_earned + total_referral_earnings
```

In production, this should be:
```typescript
unpaidBalance = (total_commissions_earned + total_referral_earnings) - total_paid_out - active_gifts_sent
```

### Email Delivery
Currently simulated. In production:
- Use Supabase Edge Function
- Send via SendGrid/Postmark/similar
- Include unique claim token in URL
- Track email opens/clicks

### Security Considerations
- Gift sending requires authentication
- RLS policies prevent unauthorized access
- Balance checks prevent overspending
- Expiration prevents indefinite liability
