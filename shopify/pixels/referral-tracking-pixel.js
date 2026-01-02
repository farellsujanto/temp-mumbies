/**
 * Shopify Customer Events Pixel - Referral Tracking
 * 
 * This pixel tracks referral codes from URL parameters and associates them with customer emails.
 * 
 * Installation:
 * 1. Go to Shopify Admin > Settings > Customer events
 * 2. Click "Add custom pixel"
 * 3. Paste this code
 * 4. Update the webhook URL to your production domain
 * 
 * URL Parameter: MRC (Mumbies Referral Code)
 * Example: https://your-store.com/products/item?MRC=TESTING
 */

analytics.subscribe('page_viewed', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const mrc = urlParams.get('mrc');
    const ts = urlParams.get('ts');
    const sg = urlParams.get('sg');

    if (!mrc || !ts || !sg) {
        return;
    }

    const customer = init.data.customer || null;
    const customerEmail = customer?.email || null;
    if (!customerEmail) {
        localStorage.setItem('storedMrc', mrc);
        return;
    }

    const storedMrc = localStorage.getItem('storedMrc');
    // Send data to partner platform
    const url = 'https://fbcaa03e51eb.ngrok-free.app/api/v1/webhooks/assign-shopify-referral';
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ts: Number(ts),
            fts: Date.now(),
            mrc: storedMrc || mrc,
            sg: sg,
            eventId: event.id,
            email: customerEmail,
        }),
    }).then(response => {
        if (response.ok) {
            localStorage.removeItem('storedMrc');
            return;
        }
        console.error('Failed to send referral data to partner platform');
    }).catch(error => {
        console.error('Error sending referral data to partner platform:', error);
    });
});


