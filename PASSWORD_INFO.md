# Password Protection Setup

## Demo Password

**Password**: `mumbies2025`

## How It Works

- Entire site is now password-protected
- Users must enter password on first visit
- Password is stored in session storage (lasts until browser tab is closed)
- Clean, professional lock screen with Mumbies branding

## Changing the Password

To change the demo password, edit this file:

`src/components/PasswordProtection.tsx`

Look for this line:
```typescript
const DEMO_PASSWORD = 'mumbies2025';
```

Change it to your desired password, then rebuild and redeploy.

## User Experience

1. User visits `next.mumbies.com`
2. Sees password protection screen with lock icon
3. Enters password: `mumbies2025`
4. Clicks "Access Demo"
5. Full site access for entire session
6. When browser tab closes, must re-enter password

## Sharing With Partners

When sending demo links to potential partners:

```
Hey [Partner Name],

Check out the new Mumbies platform preview at:
→ https://next.mumbies.com

Password: mumbies2025

Once you're in, you can explore the entire site including the Partner Dashboard.
```

## Security Note

This is **basic password protection** suitable for demos and previews. It:
- ✅ Keeps casual visitors out
- ✅ Works perfectly for partner demos
- ✅ Easy to share with select people
- ❌ Not meant for production security
- ❌ Password is visible in source code (by design)

For production, you'd use proper authentication (which you already have with Supabase Auth).

## Build & Deploy

After any changes:
```bash
npm run build
```

Then push to GitHub - Vercel will auto-deploy.
