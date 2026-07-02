# Email System Overview - Bubble Buddy

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Events                            │
│  (Order Created, Payment Verified, Login, Status Updated)       │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Notification Layer                                  │
│  • src/lib/order-notifications.ts                               │
│  • src/lib/email.ts (sendLoginNotificationEmail)                │
│  • Triggers both Email + WhatsApp                               │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Email Service Layer                                 │
│  • src/lib/email.ts - Core Resend integration                   │
│  • src/lib/order-emails.ts - Order email templates              │
│  • Handles validation, logging, recipient management            │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Resend API                                    │
│  https://api.resend.com/emails                                  │
│  (Requires: Verified sender or recipients)                      │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│             Customer & Admin Inboxes                             │
│  • customer.email ← Order confirmations, status updates, login   │
│  • admin.email ← All customer events                             │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Email Service (`src/lib/email.ts`)

**Main Functions:**
- `sendEmail(payload)` - Low-level Resend API wrapper
  - Validates email addresses
  - Filters invalid recipients
  - Handles Resend responses
  - Logs all attempts

- `sendCustomerAndAdminEmail(payload)` - Dual-send helper
  - Sends to customer + admin email list
  - Deduplicates recipients
  - Validates all emails before sending

- `sendLoginNotificationEmail(user, event)` - Login events
  - Sends on successful login
  - Sends on failed login attempts
  - Recipients: customer + admin

**Configuration:**
```typescript
// Read from .env (fs-based for runtime updates)
RESEND_API_KEY=re_ZuyGz8X...
EMAIL_FROM=Bubble Buddy <onboarding@resend.dev>
ADMIN_EMAIL=bubblebuddysmile.developer@gmail.com
```

### 2. Order Emails (`src/lib/order-emails.ts`)

**Functions:**
- `sendOrderConfirmationEmail(orderNumber)` - Order placed
- `sendPaymentFailureEmail(orderNumber)` - Payment declined
- `sendOrderStatusUpdateEmail(orderNumber, status)` - Status changes
- `sendAdminOrderNotificationEmail(orderNumber, event, status)` - Admin alerts

**Email Content:**
- HTML + Plain text versions
- Complete order details (items, totals, addresses)
- Order tracking links
- Action buttons

### 3. Order Notifications (`src/lib/order-notifications.ts`)

**Functions:**
- `notifyOrderConfirmation(orderNumber)` - Email + WhatsApp
- `notifyPaymentFailure(orderNumber)` - Email + WhatsApp
- `notifyOrderStatusUpdate(orderNumber, status)` - Email + WhatsApp

### 4. Login Notifications (in `src/app/api/auth/signin/route.ts`)

Added three email triggers:
1. **Failed login** (wrong password) → `sendLoginNotificationEmail(user, "failed")`
2. **Account locked** (too many attempts) → `sendLoginNotificationEmail(user, "failed")`
3. **Successful login** → `sendLoginNotificationEmail(user, "success")`

## Email Triggers

| Event | Who Triggered | Recipients | File Location |
|-------|---------------|------------|---------------|
| Order Confirmation | Payment verified | Customer + Admin | `src/app/api/payments/verify/route.ts` |
| Payment Failure | Payment declined | Customer + Admin | `src/app/api/payments/verify/route.ts` |
| Order Status Update | Admin updates status | Customer + Admin | `src/app/api/admin/orders/route.ts` |
| Successful Login | User signs in | Customer + Admin | `src/app/api/auth/signin/route.ts` |
| Failed Login | Wrong password/locked | Customer + Admin | `src/app/api/auth/signin/route.ts` |

## Recent Improvements

✅ **Email Validation**
- All email addresses validated before sending
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Invalid emails filtered with warning logs

✅ **Better Logging**
- `[email]` prefix for all email logs
- Tracks which recipients receive emails
- Shows Resend API responses
- Warnings for configuration issues

✅ **Error Handling**
- 403 errors detected (verification needed)
- 401 errors detected (invalid API key)
- Missing recipient warnings
- Invalid email format warnings

✅ **Recipient Management**
- Automatic deduplication
- Supports multiple admin emails
- Filters null/empty emails
- Logs all recipients

## Testing Endpoints

### 1. Simple Test Email
```
GET /api/test-email
```
Sends test email to `ADMIN_EMAIL`
Response: `{ success: true, message: "Email sent" }`

### 2. Email Diagnostics
```
GET /api/diagnostics/email
```
Shows:
- Configuration check
- API key validation
- Test send result
- Recommendations for fixing errors

## Debugging

### Check Server Logs
When email triggers, look for:
```
[email] Sending to recipients: customer@example.com, admin@example.com
[email] Email queued successfully. ID: c27e5bd4-877b-49dd-bc81-93b439d7e412
```

### Check Resend Dashboard
1. Go to https://dashboard.resend.com/
2. Click **Logs**
3. Find your email attempts
4. Check status:
   - ✅ 200 = Sent successfully
   - ❌ 403 = Recipient not verified
   - ❌ 401 = Invalid API key

### Run Diagnostics
```powershell
# Windows
.\test-emails.ps1

# Linux/Mac
bash test-emails.sh
```

## Email Content Examples

### Order Confirmation (Customer)
```
Subject: Order confirmed — #ORD-123456

Hi John,

Thanks for your purchase! Your order has been confirmed and 
is being prepared for shipping.

Order number: ORD-123456
Status: PENDING
Total: $99.99

Items:
- Coffee Maker x1 — $79.99
- Filters x2 — $19.99

[View order details button]

Thanks,
Bubble Buddy Team
```

### Admin Notification
```
Subject: New order received #ORD-123456

Customer: John Doe <john@example.com>
Order: #ORD-123456
Total: $99.99

[Full order details with items table]
[Customer addresses]
[Open order details button]
```

### Login Notification
```
Subject: Bubble Buddy sign-in successful

Hi John,

A new sign-in to your Bubble Buddy account was detected.

Time: Dec 20, 2024, 2:30 PM

If this was you, no further action is needed. 
If not, reset your password immediately.

[Visit Bubble Buddy button]
```

## Environment Variables

```env
# Resend Configuration
RESEND_API_KEY=re_ZuyGz8X7_MnYV8Uh4qBht3UpqUvyCeswp
EMAIL_FROM=Bubble Buddy <onboarding@resend.dev>

# Email Recipients
ADMIN_EMAIL=bubblebuddysmile.developer@gmail.com
SUPPORT_EMAIL=support@bubblebuddy.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://bubblebuddysmile.com/
```

## Troubleshooting

### "403 Forbidden" Errors
**Cause:** Recipient email not verified in Resend  
**Fix:** 
1. Go to https://dashboard.resend.com/
2. Verify your email addresses in Audiences → Contacts
3. Click verification link sent to your email

### "401 Unauthorized" Errors
**Cause:** Invalid or revoked API key  
**Fix:**
1. Check `RESEND_API_KEY` in `.env`
2. Generate new key from https://dashboard.resend.com/api-keys
3. Restart your app

### No emails sent
**Cause:** Multiple possibilities  
**Fix:**
1. Run `/api/test-email` endpoint
2. Check server logs for `[email]` prefix
3. Run `/api/diagnostics/email` for full report
4. Check spam folder

## Best Practices

✅ **Do:**
- Always validate email addresses
- Log all email attempts
- Test with verified recipients first
- Monitor Resend dashboard for delivery issues
- Use HTML + plain text versions

❌ **Don't:**
- Send to unverified email in sandbox mode
- Change EMAIL_FROM without updating Resend sender
- Ignore 403 errors (they need action)
- Send sensitive data in email body (GDPR)

## Future Enhancements

- [ ] Email templates in database
- [ ] Unsubscribe links
- [ ] Email delivery tracking
- [ ] A/B testing for email content
- [ ] Email scheduling/delays
- [ ] SMS as email fallback
- [ ] Email preferences center

## Support

See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for setup instructions.

For Resend documentation: https://resend.com/docs
