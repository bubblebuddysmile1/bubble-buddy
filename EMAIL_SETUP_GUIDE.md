# Resend Email Configuration Fix Guide

## Problem: 403 Errors on App-Triggered Emails

Your email code is **working correctly**, but Resend is rejecting emails because of **sandbox verification restrictions**.

### Why 403 Errors Occur

When using Resend's sandbox sender (`onboarding@resend.dev`), Resend requires:
- ✅ Verified recipient email addresses (in Resend dashboard), OR
- ✅ Verified custom domain

Currently:
- **Sender**: `onboarding@resend.dev` (sandbox - allowed)
- **Recipients**: `bubblebuddysmile.developer@gmail.com` (NOT verified - ❌ BLOCKED)

## Solution: Two Options

### Option 1: Verify Recipients (Quick Testing)

Go to https://dashboard.resend.com/ and verify your email addresses:

1. Navigate to **Audiences** → **Contacts**
2. Add and verify these emails:
   - `bubblebuddysmile.developer@gmail.com` (admin email)
   - Any customer test emails you want to use
3. Resend will send verification emails - click the link to confirm

**Timeline**: Instant once verified

**When to use**: For testing and development

---

### Option 2: Verify Custom Domain (Production Ready)

Use your custom domain (`bubblebuddysmile.com`) instead of sandbox sender:

1. Go to https://dashboard.resend.com/ → **Domains**
2. Click **Add Domain** and enter `bubblebuddysmile.com`
3. Add the DNS records provided by Resend to your domain's DNS settings
4. Wait for verification (usually 5-30 minutes)
5. Update `.env`:
   ```env
   EMAIL_FROM=Bubble Buddy <hello@bubblebuddysmile.com>
   ```

**When to use**: Production and professional use

---

## Implementation Steps

### Step 1: Choose Your Approach

Choose either Option 1 (quick) or Option 2 (production-ready).

### Step 2: Update Environment Variables

#### If using Option 1 (Verified Recipients):
```env
# Keep current settings - just verify the email in Resend dashboard
RESEND_API_KEY=re_ZuyGz8X7_MnYV8Uh4qBht3UpqUvyCeswp
EMAIL_FROM=Bubble Buddy <onboarding@resend.dev>
ADMIN_EMAIL=bubblebuddysmile.developer@gmail.com  # ← Add this to verified contacts
```

#### If using Option 2 (Custom Domain):
```env
RESEND_API_KEY=re_ZuyGz8X7_MnYV8Uh4qBht3UpqUvyCeswp
EMAIL_FROM=Bubble Buddy <hello@bubblebuddysmile.com>
ADMIN_EMAIL=bubblebuddysmile.developer@gmail.com
```

### Step 3: Test Emails

Once configured, emails will flow through these triggers:

#### Customer Emails:
- ✉️ Order confirmation → `order.user.email`
- ✉️ Payment failure → `order.user.email`
- ✉️ Order status updates → `order.user.email`
- ✉️ Login notifications → `user.email`

#### Admin Emails:
- ✉️ New orders → `ADMIN_EMAIL`
- ✉️ Payment failures → `ADMIN_EMAIL`
- ✉️ Status changes → `ADMIN_EMAIL`
- ✉️ Login notifications → `ADMIN_EMAIL`

---

## Verify Emails Are Working

### Test Endpoint 1: Send Test Email
```
GET /api/test-email
```
Sends a test email to `ADMIN_EMAIL`

### Test Endpoint 2: Email Diagnostics
```
GET /api/diagnostics/email
```
Shows current Resend configuration and runs a test send

### Check Resend Logs
1. Go to https://dashboard.resend.com/ → **Logs**
2. Look for recent email sends
3. Check status (200 = sent, 403 = verification issue, 401 = API key issue)

---

## Email Recipient Validation

The updated email service now:
✅ Validates all email addresses before sending
✅ Filters out invalid emails
✅ Logs which recipients will receive emails
✅ Shows clear 403 error reasons

### Email Address Validation Rules:
```
Must contain @ symbol
Must have domain extension (.com, .org, etc.)
Must not have spaces
```

---

## Current Application Emails

Your app now sends emails on these events:

### 1. Order Confirmation
- **File**: `/src/lib/order-emails.ts`
- **When**: Payment successful
- **Recipients**: Customer + Admin
- **Content**: Order details, items, shipping address, tracking link

### 2. Payment Failure
- **When**: Payment declined/failed
- **Recipients**: Customer + Admin
- **Content**: Failed payment notification, order cancellation notice

### 3. Order Status Updates
- **When**: Admin updates order status
- **Recipients**: Customer + Admin
- **Content**: Status-specific messages (SHIPPED, DELIVERED, CANCELLED, etc.)

### 4. Login Notifications
- **File**: `/src/lib/email.ts`
- **When**: Successful login or failed login attempts
- **Recipients**: Customer + Admin
- **Content**: Login event details, security notice, action links

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| 403 Forbidden | Recipient not verified | Verify email in Resend dashboard |
| 401 Unauthorized | Invalid API key | Check `RESEND_API_KEY` in .env |
| Email not received | Spam folder | Check spam/promotions folder |
| No email sent at all | App error | Check browser console and server logs |

---

## Files Updated for Better Email Handling

1. **`/src/lib/email.ts`**
   - ✅ Email validation function added
   - ✅ Better error logging
   - ✅ Recipient filtering

2. **`/src/lib/order-emails.ts`**
   - ✅ Improved logging for debugging
   - ✅ Better error messages

3. **`/src/app/api/diagnostics/email/route.ts`** (NEW)
   - ✅ Diagnostic endpoint for testing Resend

4. **`/src/app/api/test-email/route.ts`** (EXISTING)
   - ✅ Simple test email sender

---

## Next Steps

1. **Choose Option 1 or 2** from "Solution" section above
2. **Follow implementation steps** in your chosen option
3. **Test using the provided endpoints** (`/api/test-email` or `/api/diagnostics/email`)
4. **Check Resend logs** to confirm emails are being sent
5. **Monitor email delivery** when placing test orders

---

## Support

If emails still don't work after following this guide:

1. Run `/api/diagnostics/email` endpoint and note the response
2. Check Resend dashboard logs for exact error messages
3. Verify all recipients in the `ADMIN_EMAIL` environment variable are properly configured
4. Ensure `.env` file changes are saved and app is restarted
