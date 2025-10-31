# mumb.us Domain Setup Instructions

## Overview
The affiliate link system now uses `mumb.us` as the short link domain (e.g., `https://mumb.us/abc123`).

## Current Implementation
- Short links are generated in the format: `https://mumb.us/[code]`
- The app stores these links in the database with the full destination URL
- The system will work even if the redirect doesn't function - partners can still copy and share the links

## To Make Redirects Work - DNS Setup Required

You need to set up the `mumb.us` domain to point to your application and handle redirects.

### Option 1: Using Vercel (Recommended)

1. **Purchase/Transfer the domain `mumb.us`**
   - Buy from any domain registrar (Namecheap, GoDaddy, Google Domains, etc.)

2. **Add Domain to Vercel Project**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Domains
   - Click "Add Domain"
   - Enter `mumb.us`
   - Follow Vercel's instructions to verify domain ownership

3. **Configure DNS Records**

   At your domain registrar, add these DNS records:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 300

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 300
   ```

4. **Update Vercel Configuration**

   Make sure your `vercel.json` includes redirect handling:

   ```json
   {
     "redirects": [
       {
         "source": "/s/:code",
         "destination": "/s/:code",
         "permanent": false
       }
     ]
   }
   ```

5. **Wait for DNS Propagation**
   - DNS changes can take 1-48 hours to propagate globally
   - Vercel will automatically issue an SSL certificate once DNS is verified

### Option 2: Using Netlify

1. **Purchase domain `mumb.us`**

2. **Add Domain to Netlify**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter `mumb.us`

3. **Configure DNS at Registrar**

   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 300

   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   TTL: 300
   ```

4. **Update `_redirects` file**

   Create/update the `_redirects` file in your `dist` folder:

   ```
   /s/:code  /s/:code  200
   /*        /index.html  200
   ```

### Option 3: Custom Server with Redirect Handler

If you're hosting on your own server:

1. **Point domain to your server IP**

   ```
   Type: A
   Name: @
   Value: [your-server-ip]
   TTL: 300
   ```

2. **Configure Web Server (Nginx example)**

   ```nginx
   server {
       listen 80;
       server_name mumb.us www.mumb.us;

       location /s/ {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           return 301 https://yourmainsite.com$request_uri;
       }
   }
   ```

3. **Setup SSL Certificate**

   Use Let's Encrypt:
   ```bash
   sudo certbot --nginx -d mumb.us -d www.mumb.us
   ```

## How the System Works

1. **Short Link Generation**
   - Partner clicks share button on product page
   - System automatically generates a random 6-character code
   - Creates database entry linking code to full URL with partner ref
   - Displays link as `https://mumb.us/[code]`

2. **Short Link Redirect** (when DNS is configured)
   - User visits `https://mumb.us/abc123`
   - App catches the request at route `/s/:code`
   - Looks up the code in the `short_urls` table
   - Increments click counter
   - Redirects user to full product URL with partner tracking

3. **Fallback** (if DNS not configured)
   - Links still generate and can be copied
   - Partners can share them
   - Users will get a "site not found" error until DNS is setup
   - No data is lost - once DNS is configured, all existing links will work

## Testing

After DNS setup, test with:

1. Generate a short link in the app
2. Copy the `mumb.us/[code]` link
3. Open in incognito/private browser
4. Should redirect to product page with partner ref parameter
5. Check database - click_count should increment

## Database Structure

The `short_urls` table tracks:
- `short_code`: The random code (e.g., "abc123")
- `destination_url`: Full URL with partner tracking
- `partner_slug`: Which partner created the link
- `product_id`: Which product is being shared
- `click_count`: Number of times clicked
- `last_clicked_at`: Last click timestamp

## Monitoring

To see short link performance:
```sql
SELECT
  short_code,
  partner_slug,
  click_count,
  created_at,
  last_clicked_at
FROM short_urls
ORDER BY click_count DESC
LIMIT 20;
```

## Important Notes

- The app will continue to work without mumb.us setup - links just won't redirect yet
- Once DNS is configured, ALL previously generated links will start working
- Short codes are permanent and don't expire
- Partners can generate unlimited short links
- Each short link is unique per product/partner combination
