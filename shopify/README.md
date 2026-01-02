# Shopify Integration

This directory contains Shopify-related code and configurations for the referral tracking system.

## Structure

- `pixels/` - Custom Shopify Customer Events pixels
  - `referral-tracking-pixel.js` - Tracks referral codes and customer emails

## Webhook Endpoints

- `POST /api/v1/webhooks/track-shopify-referral` - Receives referral tracking data from Shopify pixel

## Setup Instructions

### 1. Install the Referral Tracking Pixel

1. Navigate to your Shopify Admin
2. Go to **Settings** > **Customer events**
3. Click **Add custom pixel**
4. Name it "Referral Tracking Pixel"
5. Copy the code from `pixels/referral-tracking-pixel.js`
6. Update the webhook URL to your production domain
7. Save and activate the pixel

### 2. Configure CORS

The webhook endpoint is configured to accept requests from:
- `https://dr00de-zt.myshopify.com`
- Any `*.myshopify.com` domain
- Local testing environments

### 3. Testing

Test the pixel by visiting your store with a referral code:
```
https://your-store.myshopify.com/products/any-product?MRC=TESTCODE
```

Check the browser console and your server logs to verify the tracking is working.

## How It Works

1. Customer visits store with `?MRC=CODE` parameter
2. Pixel extracts the referral code from URL
3. If customer is logged in, sends referral data immediately
4. If customer is not logged in, stores code in localStorage
5. When customer logs in/provides email, sends stored referral data
6. Backend webhook receives and processes the referral tracking data
