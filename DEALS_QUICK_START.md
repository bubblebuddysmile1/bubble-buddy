# Quick Start Guide - Deal Management System

## 🚀 Getting Started

### For Admins: Creating a Deal

**Step 1: Navigate to Deal Management**
```
Go to: /admin/deals
```

**Step 2: Create a Limited Stock Deal**
1. Click "Create Deal"
2. Fill in the form:
   - **Title**: "Summer Flash Sale - 30% Off"
   - **Deal Type**: Limited Stock
   - **Urgency Level**: CRITICAL (shows in red)
   - **Discount**: 30%
   - **Quantity**: 50
   - **End Date**: 2026-07-31
3. Select Products from the list
4. Click "Create Deal"

**Step 3: Create a Coupon Deal**
1. Click "Create Deal"
2. Fill in:
   - **Title**: "100 Summer Coupons"
   - **Deal Type**: Coupon Code
   - **Urgency Level**: URGENT (shows in orange)
   - **Discount**: 20%
   - **Coupon Code**: SUMMER20
   - **Max Coupons**: 100
3. Select Products
4. Click "Create Deal"

### For Customers: Claiming Deals

**On Product Cards:**
1. Browse products in /shop
2. Look for colored badge showing deal info
   - 🔴 "Only 5 Left" (RED = CRITICAL urgency)
   - 🟠 "100 Coupons Available" (ORANGE = URGENT)
   - 🔵 Deal information (BLUE = NORMAL)
3. Click "Claim Fast" button
4. See success message with coupon code

### Deal Types Explained

| Type | Display | Use Case |
|------|---------|----------|
| **LIMITED_STOCK** | "Only X Left" | Limited inventory |
| **COUPON_CODE** | "Y Coupons Available" | Distributing codes |
| **FLASH_SALE** | Discount % | Time-sensitive sales |
| **BUNDLE_DEAL** | Special offer | Multiple products |

### Urgency Levels

| Level | Color | When to Use |
|-------|-------|------------|
| **CRITICAL** | 🔴 Red | Closing soon, almost sold out |
| **URGENT** | 🟠 Orange | Popular item, limited stock |
| **NORMAL** | 🔵 Blue | Regular sale, good availability |

## 📊 Admin Dashboard Features

**Deal List Table Shows:**
- Deal title and ID
- Type (with icon)
- Discount amount
- Progress bar (claimed/total)
- Status (Active/Inactive)
- Expiration date
- Edit/Delete buttons

**Quick Stats:**
- View claim progress in real-time
- See remaining quantity or coupons
- Check expiration dates at a glance

## 🎯 API Usage Examples

### Get All Active Deals
```bash
curl https://yoursite.com/api/deals?active=1
```

### Create a Deal
```bash
curl -X POST https://yoursite.com/api/deals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale",
    "dealType": "LIMITED_STOCK",
    "discountPercent": 30,
    "limitedQuantity": 100,
    "productIds": [1, 2, 3]
  }'
```

### Claim a Deal
```bash
curl -X POST https://yoursite.com/api/deals/1/claim \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## 💡 Tips & Best Practices

### Creating Effective Deals
- ✅ Use CRITICAL urgency only for truly limited items
- ✅ Set realistic quantities/coupon counts
- ✅ Always set an end date
- ✅ Assign deals to relevant products only
- ✅ Test on product cards before going live

### Customer Experience
- ✅ Badge appears automatically on eligible products
- ✅ One-click claiming with "Claim Fast" button
- ✅ Instant coupon code display
- ✅ Shows remaining stock in real-time

### Performance
- ✅ Deals are cached in product API responses
- ✅ Progress updates without page refresh
- ✅ Expired deals hide automatically

## 🐛 Troubleshooting

### Deal Badge Not Showing
- **Check**: Is the deal `isActive` = true?
- **Check**: Is the end date in the future?
- **Check**: Are products assigned to this deal?

### "Claim Fast" Button Not Working
- **Check**: Is the deal still active?
- **Check**: Are there remaining claims/stock?
- **Check**: Are you viewing an active deal?

### Admin Page Not Loading
- **Check**: Do you have ADMIN role?
- **Check**: Are you authenticated?

## 📁 File Structure

```
Admin Pages:
- /admin/deals               → List all deals
- /admin/deals/new           → Create deal
- /admin/deals/[id]          → Edit deal

API:
- GET /api/deals             → List deals
- POST /api/deals            → Create deal
- GET /api/deals/[id]        → Get deal details
- PUT /api/deals/[id]        → Update deal
- DELETE /api/deals/[id]     → Delete deal
- POST /api/deals/[id]/claim → Claim deal

Components:
- LimitedOfferBadge          → Shows deal info badge
- ClaimFastButton            → Claim action button
- ShopProductCard            → Product display with deals
```

## 🔄 Common Workflows

### Workflow 1: Launch 48-Hour Flash Sale
1. Go to `/admin/deals`
2. Create deal:
   - Type: FLASH_SALE
   - Urgency: CRITICAL
   - End in 48 hours
   - Apply to featured products
3. Monitor claims in real-time
4. Deal auto-hides when expired

### Workflow 2: Distribute Limited Coupons
1. Go to `/admin/deals`
2. Create deal:
   - Type: COUPON_CODE
   - Code: SUMMER20
   - Max: 100 coupons
   - End: 30 days
3. Customers claim instantly
4. See coupon usage in real-time

### Workflow 3: Clear Excess Inventory
1. Create LIMITED_STOCK deal
2. Set quantity to current stock
3. Set CRITICAL urgency
4. Monitor stock depletion
5. Auto-completes when sold out

## 📞 Support

For issues or feature requests, check:
- [DEALS_MANAGEMENT.md](./DEALS_MANAGEMENT.md) - Full documentation
- API response errors for specific issues
- Browser console for frontend errors

---
Last Updated: 2026-06-18
