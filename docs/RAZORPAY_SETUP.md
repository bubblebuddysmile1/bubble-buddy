# Razorpay setup (Task 1)

1. Go to [https://dashboard.razorpay.com](https://dashboard.razorpay.com) and create an account.
2. Switch to **Test Mode** (toggle in dashboard).
3. Open **Settings → API Keys** and generate Key ID + Key Secret.
4. Copy keys into `.env.local`:

```env
MOCK_PAYMENTS=false
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

5. Restart the dev server: `npm run dev`.

## Test cards (Test Mode)

Use Razorpay docs for latest test card numbers. Example:

- Success: card payment with test card from Razorpay docs
- UPI / wallets also available in test mode

## Mock mode (no account)

Leave `MOCK_PAYMENTS=true` or omit Razorpay keys. Checkout simulates payment and redirects to success.
