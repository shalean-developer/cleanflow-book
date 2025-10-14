# Promo Code Fix for Standard Cleaning

## Issue
The promo code (NEW20SC) for 20% off Standard Cleaning was not being displayed in the Order Summary on the Review page, making users think the promo was not being applied.

## Root Cause
The `OrderSummary` component had two issues:
1. The TypeScript interface for `pricing` was missing the `promoDiscount` field
2. The component was not displaying the promo discount in the cost breakdown

## What Was Working
- ✅ Promo claiming and storage in booking store
- ✅ Promo validation for service types
- ✅ Promo discount calculation in `calculatePricing()` utility
- ✅ Promo discount included in final total
- ✅ `StickySummary` component already displaying promo correctly

## What Was Broken
- ❌ `OrderSummary` component not displaying promo discount
- ❌ TypeScript interface incomplete

## Fix Applied
Updated `src/components/booking/OrderSummary.tsx`:

### 1. Added `promoDiscount` to pricing interface
```typescript
pricing?: {
  subtotal: number;
  discount: number;
  promoDiscount: number;  // ← Added
  fees: number;
  total: number;
} | null;
```

### 2. Added promo to booking interface
```typescript
booking: {
  // ... other fields
  promo?: {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
  };
};
```

### 3. Added promo discount display in cost breakdown
```typescript
{pricing.promoDiscount > 0 && (
  <div className="flex justify-between text-sm text-green-600">
    <span>Promo Discount {booking.promo && `(${booking.promo.code})`}</span>
    <span className="font-medium tabular-nums">-{formatCurrencyZAR(pricing.promoDiscount)}</span>
  </div>
)}
```

## How Promo Code Works

### Promo Configuration
- **Code**: NEW20SC
- **Discount**: 20% off
- **Applies to**: Standard Cleaning only
- **Valid for**: 30 days from claim

### User Flow
1. User visits homepage
2. Promo modal appears after 2 seconds
3. User signs in (if not already)
4. User clicks "Claim 20% Off"
5. System:
   - Creates promo claim in database
   - Sets service to "Standard Cleaning"
   - Stores promo in booking state
   - Navigates to booking details
6. User completes booking flow
7. On Review page, promo discount is now visible:
   - Subtotal: R450.00 (base price)
   - Promo Discount (NEW20SC): -R90.00
   - Service Fee: R36.00
   - **Total: R396.00**

### Discount Calculation
The promo discount is applied AFTER frequency discount:
1. Calculate subtotal (base + bedrooms + bathrooms + extras)
2. Apply frequency discount (weekly 15%, bi-weekly 10%, monthly 5%)
3. Apply promo discount (20% of amount after frequency discount)
4. Calculate service fee on final amount
5. Calculate total

Example:
- Subtotal: R450.00
- After frequency discount (0%): R450.00
- Promo discount (20%): -R90.00
- Subtotal after discounts: R360.00
- Service fee (10%): R36.00
- **Total: R396.00**

## Validation
The `ServiceChangeValidator` component ensures:
- Promo is only valid for the service it was claimed for
- If user changes service, promo is automatically revoked
- User sees toast notification when promo is removed

## Files Modified
1. `src/components/booking/OrderSummary.tsx`
   - Added `promoDiscount` to pricing interface
   - Added `promo` to booking interface
   - Added promo discount display in cost breakdown

## Testing Checklist
- [ ] Promo modal appears on homepage
- [ ] User can claim promo with authentication
- [ ] Promo sets service to "Standard Cleaning"
- [ ] Promo discount appears in OrderSummary on Review page
- [ ] Promo discount shows correct code (NEW20SC)
- [ ] Total reflects 20% discount
- [ ] Promo is removed when changing to different service
- [ ] Payment includes correct discounted total
- [ ] Booking confirmation shows promo was applied

## Notes
- The promo system is fully functional and extensible
- Additional promo codes can be added by:
  1. Creating new config in promo modal component
  2. Configuring service slug and discount
  3. Setting expiry and eligibility rules
- Promo redemptions are tracked in `promo_redemptions` table
- Promo claims are tracked in `promo_claims` table with statuses: claimed, redeemed, revoked

