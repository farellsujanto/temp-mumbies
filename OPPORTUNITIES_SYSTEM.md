# Opportunities System - Gift Incentives Flow

## Overview
The Opportunities system gamifies partner engagement by allowing partners to send gift incentives to expiring leads, encouraging first purchases before the lead expires.

## Key Concepts

### Lead Lifecycle
1. **Registration**: User signs up via partner link → 90-day expiration timer starts
2. **Active Period**: Lead has 90 days to make their first purchase
3. **Expiration**: If no purchase after 90 days, lead status changes to "expired"

### Gift Incentive Mechanics
- **Source**: Partners send gifts from their earned commission balance
- **Duration**: Gifts expire in 14 days if unused
- **Conversion**: When lead purchases, they convert to customer and keep remaining balance
- **Refund**: Unused/expired gifts automatically return to partner balance

---

## Detailed Scenarios

### Scenario 1: Successful Conversion (Win-Win)
**Timeline:**
- Day 1: Lead registers (90 days until expiration)
- Day 76: Partner sees lead expiring soon in Opportunities tab
- Day 76: Partner sends $10 gift (14-day expiration → expires Day 90)
- Day 80: Lead uses $10 to purchase $35 product
- **Outcome**:
  - Lead converts to customer
  - Partner earns 5% commission on $35 = $1.75
  - Net cost to partner: $10 - $1.75 = $8.25
  - Customer ROI: Partner may earn much more over customer lifetime

### Scenario 2: Partial Use Before Expiration
**Timeline:**
- Day 70: Partner sends $15 gift to lead
- Day 78: Lead makes $12 purchase (uses $12 of gift)
- Remaining balance: $3
- **Outcome**:
  - Lead converts to customer
  - Partner earns commission on $12 sale
  - Customer keeps $3 balance for future purchases
  - Partner's actual cost: $15 - commission earned

### Scenario 3: Gift Expires Unused (Auto-Refund)
**Timeline:**
- Day 75: Partner sends $10 gift (expires Day 89)
- Day 89: Gift expires unused
- System automatically refunds $10 to partner balance
- Day 90: Lead expires without purchasing
- **Outcome**:
  - Partner gets full $10 refund
  - Zero net cost to partner
  - Lead opportunity lost

### Scenario 4: Lead Expires Before Gift Used
**Timeline:**
- Day 85: Partner sends $5 gift (expires Day 99)
- Day 90: Lead's 90-day window expires (no purchase)
- System marks lead as "expired"
- System refunds unused $5 gift to partner
- **Outcome**:
  - Partner gets full refund
  - Zero net cost
  - Lead permanently expired

### Scenario 5: Multiple Gifts Strategy
**Timeline:**
- Day 70: Partner sends $5 gift
- Day 75: Lead doesn't purchase, partner sends another $10
- Day 80: Lead makes $30 purchase
- **Outcome**:
  - Total gifts sent: $15
  - Lead uses $15 toward purchase
  - Partner earns commission on $30 sale
  - Aggressive engagement strategy converted lead

### Scenario 6: Last-Minute Conversion
**Timeline:**
- Day 88: Only 2 days until lead expires
- Partner sends urgent $20 gift
- Day 89: Lead makes $50 purchase
- **Outcome**:
  - High-risk, high-reward strategy succeeds
  - Partner earns commission on $50 sale
  - Net: $20 gift cost minus $2.50 commission = $17.50 investment
  - Now has lifetime customer worth potentially hundreds in commissions

---

## Business Logic

### Gift Expiration Rules
```
Gift Expiration Date = MIN(
  Gift Created Date + 14 days,
  Lead Expiration Date
)
```

### Balance Calculations
```
Lead Balance = SUM(active_gifts) - SUM(spent_amounts)
Partner Available Balance = commissions_earned + referral_earnings - active_gifts_sent
```

### Auto-Refund Triggers
1. Gift reaches 14-day expiration without use
2. Lead expires before gift is used
3. Nightly batch job runs `expire_and_refund_incentives()`

---

## UI/UX Flow

### Opportunities Tab - Partner View
1. **Stats Dashboard**
   - Total expiring leads (30-day window)
   - Available balance to send
   - High priority count (< 14 days)

2. **Lead Cards** (sorted by urgency)
   - Color-coded by days remaining:
     - Red: ≤7 days
     - Orange: 8-14 days
     - Yellow: 15-30 days
   - Shows current gift balance if any
   - Quick-send buttons: $5, $10, $15, custom
   - One-click send with confirmation

3. **Gift History** (future enhancement)
   - Track all gifts sent
   - See conversion rates
   - ROI calculations

### Customer View (Lead receives gift)
1. Email notification: "{Partner Name} sent you $X to shop at Mumbies!"
2. Balance shows in cart/checkout
3. Clear expiration date displayed
4. Can apply to any purchase

---

## Database Schema

### Tables Created
1. **partner_leads**: Track all referred leads with expiration dates
2. **partner_incentives**: Record of all gifts sent
3. **lead_balances**: Current balance for each lead

### Key Functions
- `upsert_lead_balance()`: Add gift amount to lead balance
- `expire_and_refund_incentives()`: Nightly batch process

---

## ROI Examples

### Conservative Strategy
- Send $5 gifts only to leads expiring in < 7 days
- If 20% convert: 1 in 5 converts
- Customer LTV: $200 in commissions
- Cost: $25 (5 × $5)
- Revenue: $200
- ROI: 700%

### Aggressive Strategy
- Send $15 gifts to all leads expiring in < 14 days
- If 30% convert: 3 in 10 convert
- Customer LTV: $200 each = $600 total
- Cost: $150 (10 × $15)
- Revenue: $600
- ROI: 300%

---

## Success Metrics to Track
1. **Conversion Rate**: Leads with gifts vs without
2. **Average Gift Amount**: Optimal amount for conversion
3. **Time to Convert**: Days from gift to purchase
4. **ROI**: Commission earned vs gift cost
5. **Refund Rate**: % of gifts that expire unused

---

## Future Enhancements
1. A/B testing different gift amounts
2. Automated gift suggestions based on AI
3. Gift scheduling (send automatically at Day X)
4. Tiered rewards (bigger gifts for higher-value leads)
5. Gift matching from Mumbies corporate
6. Leaderboard for best conversion rates
