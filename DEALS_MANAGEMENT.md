# Deal Management System Documentation

## Overview
Complete Limited Offers and Deal Management system for Bubble Buddy with support for:
- **Limited Stock Deals**: "Only 5 Left" style offers
- **Coupon Code Deals**: "100 Coupons Available" with "Claim Fast"
- **Flash Sales**: Time-sensitive discount offers
- **Bundle Deals**: Multi-product promotional packages

## Features Implemented

### 1. Database Models
**Deal Model** (`/prisma/schema.prisma`)
```typescript
model Deal {
  id: number
  title: string
  description?: string
  dealType: DealType (LIMITED_STOCK | COUPON_CODE | FLASH_SALE | BUNDLE_DEAL)
  urgencyLevel: UrgencyLevel (NORMAL | URGENT | CRITICAL)
  discountPercent?: number
  discountFixed?: Decimal
  limitedQuantity?: number
  claimedQuantity: number (default 0)
  couponCode?: string
  maxCoupons?: number
  usedCoupons: number (default 0)
  isActive: boolean
  startsAt?: DateTime
  endsAt?: DateTime
  products: Product[] (relation)
  dealClaims: DealClaim[] (relation)
}

model DealClaim {
  id: number
  dealId: number
  userId?: number
  email?: string
  claimedAt: DateTime
}
```

### 2. API Endpoints

#### Get All Deals
```
GET /api/deals?active=1
Response:
{
  deals: [
    {
      id: 1,
      title: "Summer Flash Sale",
      dealType: "LIMITED_STOCK",
      urgencyLevel: "CRITICAL",
      discountPercent: 30,
      limitedQuantity: 50,
      claimedQuantity: 23,
      isActive: true,
      ...
    }
  ]
}
```

#### Create Deal (Admin Only)
```
POST /api/deals
Body: {
  title: string,
  description?: string,
  dealType: "LIMITED_STOCK" | "COUPON_CODE" | "FLASH_SALE" | "BUNDLE_DEAL",
  urgencyLevel: "NORMAL" | "URGENT" | "CRITICAL",
  discountPercent?: number,
  discountFixed?: number,
  limitedQuantity?: number,
  couponCode?: string,
  maxCoupons?: number,
  isActive: boolean,
  startsAt?: DateTime,
  endsAt?: DateTime,
  productIds: number[]
}
```

#### Get Deal Details
```
GET /api/deals/:id
Response includes products, claims, and all deal info
```

#### Update Deal (Admin Only)
```
PUT /api/deals/:id
Body: Same as POST /api/deals
```

#### Delete Deal (Admin Only)
```
DELETE /api/deals/:id
```

#### Claim Deal (User Action)
```
POST /api/deals/:id/claim
Body: {
  email?: string
}
Response:
{
  success: true,
  claim: { id, dealId, userId, email, claimedAt },
  couponCode?: string,
  message: "Coupon code: SUMMER20" or "Deal claimed successfully!"
}
```

### 3. Frontend Components

#### LimitedOfferBadge Component
**Path**: `/src/components/store/LimitedOfferBadge.tsx`

Displays deal information on product cards:
- Shows remaining quantity: "Only 5 Left"
- Shows available coupons: "100 Coupons Available"
- Color-coded by urgency level (Red for Critical, Orange for Urgent)
- Displays discount amount (20% OFF or ₹500 OFF)
- Deal type icon (AlertCircle, Zap, Gift, Clock)

```tsx
<LimitedOfferBadge 
  deal={{
    id: 1,
    title: "Summer Sale",
    dealType: "LIMITED_STOCK",
    urgencyLevel: "CRITICAL",
    discountPercent: 30,
    limitedQuantity: 50,
    claimedQuantity: 23
  }} 
/>
```

#### ClaimFastButton Component
**Path**: `/src/components/store/ClaimFastButton.tsx`

Interactive button for users to claim deals:
- Shows "Claim Fast" button with lightning icon
- Displays success message with coupon code (if applicable)
- Handles API calls and error states
- Auto-resets after 3 seconds

```tsx
<ClaimFastButton 
  dealId={1}
  onSuccess={(couponCode) => {
    console.log("Claimed with code:", couponCode);
  }}
/>
```

#### Updated ShopProductCard
**Path**: `/src/components/store/ShopProductCard.tsx`

Enhanced to display:
- Deal badge with "Only X Left" or "Y Coupons Available"
- "Claim Fast" button when deal is active
- Deal information overlaid on product image
- Color-coded urgency levels

### 4. Admin Management

#### Deal List Page
**Path**: `/src/app/admin/deals/page.tsx`

Features:
- Table view of all deals
- Status indicator (Active/Inactive)
- Progress bars showing claimed/available ratio
- Expiration dates
- Quick actions (Edit/Delete)
- Create new deal button

#### Create Deal Page
**Path**: `/src/app/admin/deals/new/page.tsx`

Form with sections for:
- Basic Information (Title, Description)
- Deal Configuration (Type, Urgency Level, Active Status)
- Discount Settings (Percentage or Fixed Amount)
- Limits (Quantity, Coupons)
- Schedule (Start/End dates)
- Product Selection (Multi-select checkbox list)

#### Edit Deal Page
**Path**: `/src/app/admin/deals/[id]/page.tsx`

Same form as create page with pre-filled data and update functionality

### 5. Utilities

**Path**: `/src/lib/deals.ts`

Utility functions for:
- `isDealActive(deal)` - Check if deal is currently active
- `getRemainingQuantity(deal)` - Get stock remaining
- `getRemainingCoupons(deal)` - Get coupons remaining
- `isDealExhausted(deal)` - Check if deal is out of stock/coupons
- `getDiscountText(deal)` - Format discount display
- `getUrgencyColor(level)` - Get styling for urgency level
- `calculateFinalPrice(price, deal)` - Calculate discounted price

### 6. Updated API Integration

**Product API Enhanced** (`/src/app/api/products/route.ts`)

Now includes deal information in product responses:
```typescript
{
  id: 1,
  name: "Product Name",
  price: "1000",
  deal: {
    id: 1,
    title: "Summer Sale",
    dealType: "LIMITED_STOCK",
    urgencyLevel: "CRITICAL",
    discountPercent: 30,
    limitedQuantity: 50,
    claimedQuantity: 23,
    maxCoupons: 100,
    usedCoupons: 45,
    couponCode: "SUMMER20",
    isActive: true,
    endsAt: "2026-07-31"
  }
}
```

## Usage Examples

### Admin: Create Limited Stock Deal
1. Navigate to `/admin/deals`
2. Click "Create Deal"
3. Fill form:
   - Title: "Limited Summer Collection"
   - Deal Type: "LIMITED_STOCK"
   - Urgency: "CRITICAL"
   - Discount: 30%
   - Quantity: 100
   - End Date: July 31, 2026
4. Select products from list
5. Click "Create Deal"

### Admin: Create Coupon Deal
1. Navigate to `/admin/deals`
2. Click "Create Deal"
3. Fill form:
   - Title: "100 Summer Coupons"
   - Deal Type: "COUPON_CODE"
   - Urgency: "URGENT"
   - Discount: 20%
   - Coupon Code: "SUMMER20"
   - Max Coupons: 100
   - End Date: July 31, 2026
4. Select products
5. Click "Create Deal"

### Customer: Claim Deal
1. Browse products on shop page
2. See deal badge: "Only 5 Left" or "100 Coupons Available"
3. Click "Claim Fast" button
4. Success message shows coupon code (if applicable)
5. Code can be used at checkout

### View Deals Activity
- Admin can see all deals in `/admin/deals` table
- View progress bars for stock/coupons
- See expiration dates and status
- Edit or delete deals as needed

## Database Migration

Migration files created:
- `/prisma/migrations/add_deals_model/migration.sql`

Run migration:
```bash
npm run prisma migrate deploy
```

## Future Enhancements

1. **Email Notifications**: Send coupon codes to email
2. **Analytics**: Track deal performance and claim rates
3. **Bulk Operations**: Create multiple deals at once
4. **Deal Templates**: Save and reuse deal configurations
5. **Scheduled Deals**: Auto-activate/deactivate by schedule
6. **A/B Testing**: Test different urgency levels/discounts
7. **Referral Deals**: Allow customers to share and earn coupons
8. **Integration**: Connect with loyalty points system

## Troubleshooting

### Deals not appearing on product cards
- Check if deal `isActive` is true
- Verify deal end date is in the future
- Ensure products are assigned to the deal

### Claim Fast button not working
- Verify user is logged in (for user tracking)
- Check deal hasn't exhausted limits
- Check browser console for API errors

### Admin pages not accessible
- Verify user has ADMIN role
- Check authentication middleware

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   └── deals/
│   │       ├── page.tsx (list)
│   │       ├── new/
│   │       │   └── page.tsx (create)
│   │       └── [id]/
│   │           └── page.tsx (edit)
│   └── api/
│       └── deals/
│           ├── route.ts (GET/POST)
│           ├── [id]/
│           │   ├── route.ts (GET/PUT/DELETE)
│           │   └── claim/
│           │       └── route.ts (POST)
├── components/
│   └── store/
│       ├── LimitedOfferBadge.tsx
│       ├── ClaimFastButton.tsx
│       └── ShopProductCard.tsx (updated)
└── lib/
    └── deals.ts (utilities)
```

---
Last Updated: 2026-06-18
