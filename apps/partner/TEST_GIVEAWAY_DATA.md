# Giveaway Component Test Data

## Test Case: Null/Empty Field Handling

The component MUST handle these real database values without errors:

### Bundle with NULL tier (Cocorope Giveaway):
```json
{
  "id": "19f032d2-a5f3-4402-bde0-bd4e77be3404",
  "name": "Cocorope Giveaway",
  "description": "",  // EMPTY STRING
  "tier": null,       // NULL VALUE
  "featured_image_url": "",  // EMPTY STRING
  "total_value": "33.39",
  "unlock_requirement_type": "mumbies_cash",
  "unlock_requirement_value": 100
}
```

## All Fields Protected:
- ✅ `bundle?.name` - Uses optional chaining + fallback
- ✅ `bundle?.description` - Uses optional chaining + fallback
- ✅ `bundle?.tier` - REMOVED from display (no longer used)
- ✅ `bundle?.featured_image_url` - Uses optional chaining + fallback
- ✅ `bundle?.total_value` - Wrapped in Number() with fallback
- ✅ No `.toUpperCase()` calls on tier (removed completely)

## Partner Data (Test Partner Rescue):
- ID: 00000000-0000-0000-0000-000000000099
- Auth User ID: 0b92391a-0ec8-4b6f-84ea-6c2f9b2b4e4c
- Mumbies Cash: $75.00
- Should see Bronze Bundle (unlocked) and Silver Bundle (unlocked)
- Cocorope Giveaway should show as LOCKED ($100 requirement vs $75 balance)
