# Paystack Payment Integration Setup

## Quick Overview
Your app uses Paystack for processing payments. Paystack keys need to be configured in **Supabase Edge Functions** (not in your `.env` file).

## Step-by-Step Setup

### Step 1: Get Your Paystack Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign in to your account
3. Navigate to **Settings** → **API Keys & Webhooks**
4. You'll see two types of keys:

   **For Development (Use these first):**
   - Public Test Key: `pk_test_xxxxxxxxxxxxxxxxxx`
   - Secret Test Key: `sk_test_xxxxxxxxxxxxxxxxxx`

   **For Production (Use later):**
   - Public Live Key: `pk_live_xxxxxxxxxxxxxxxxxx`
   - Secret Live Key: `sk_live_xxxxxxxxxxxxxxxxxx`

### Step 2: Add Keys to Supabase (Critical!)

Your payment functions run on Supabase Edge Functions, so keys must be added there:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Edge Functions** in the left sidebar
4. Click **Manage Secrets** (or **Settings**)
5. Add these two secrets:

   ```
   Name: PAYSTACK_PUBLIC_KEY
   Value: pk_test_xxxxxxxxxxxxxxxxxx
   ```

   ```
   Name: PAYSTACK_SECRET_KEY
   Value: sk_test_xxxxxxxxxxxxxxxxxx
   ```

6. Click **Save**

### Step 3: Deploy Your Edge Functions (If Not Already Done)

If you haven't deployed your Supabase functions yet:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy all functions
supabase functions deploy
```

Or deploy specific payment functions:
```bash
supabase functions deploy get-paystack-public-key
supabase functions deploy initialize-paystack-payment
supabase functions deploy verify-paystack-payment
```

### Step 4: Test Payment Flow

1. Start your app: `npm run dev`
2. Go through the booking process
3. When you reach payment, Paystack popup should appear
4. Use these test cards:

   **Successful Payment:**
   - Card: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`

   **Failed Payment:**
   - Card: `5060 6666 6666 6666`
   - CVV: Any 3 digits
   - Expiry: Any future date

## How It Works

### Frontend (Your App)
1. User initiates booking
2. App calls `initialize-paystack-payment` Supabase function
3. Function creates booking and returns Paystack payment URL
4. Paystack popup opens for payment
5. After payment, `verify-paystack-payment` confirms the transaction

### Backend (Supabase Edge Functions)
- `get-paystack-public-key` - Returns public key to frontend
- `initialize-paystack-payment` - Creates transaction with Paystack
- `verify-paystack-payment` - Verifies payment was successful

## Troubleshooting

### "Paystack public key not configured" Error

**Solution:** Add `PAYSTACK_PUBLIC_KEY` to Supabase Edge Function secrets (Step 2)

### "Paystack secret key not configured" Error

**Solution:** Add `PAYSTACK_SECRET_KEY` to Supabase Edge Function secrets (Step 2)

### Payment Popup Doesn't Appear

**Checklist:**
- [ ] Paystack keys added to Supabase (not `.env` file)
- [ ] Edge functions are deployed
- [ ] Check browser console for errors
- [ ] Verify Paystack script is loaded (check `index.html`)

### Payment Succeeds but Booking Not Created

**Checklist:**
- [ ] Check Supabase Edge Function logs
- [ ] Verify user is authenticated
- [ ] Check RLS policies on `bookings` table
- [ ] Look for errors in browser console

## Important Notes

⚠️ **Security:**
- Never commit Paystack secret keys to git
- Never use secret keys in frontend code
- Always use test keys for development
- Switch to live keys only in production

✅ **Keys Location:**
- ❌ Don't put Paystack keys in `.env` file
- ✅ Put Paystack keys in Supabase Edge Function secrets
- The keys are used by server-side functions, not frontend

🔄 **Switching to Production:**
1. Get your live keys from Paystack
2. Update Supabase Edge Function secrets with live keys
3. Test thoroughly before going live
4. Monitor transactions in Paystack Dashboard

## Test Cards Reference

| Card Number | Scenario | Expected Result |
|-------------|----------|-----------------|
| 4084 0840 8408 4081 | Success | Payment successful |
| 5060 6666 6666 6666 | Decline | Payment declined |
| 5399 8383 8383 8381 | Timeout | Transaction timeout |

All test cards:
- CVV: Any 3 digits
- Expiry: Any future date
- PIN (when required): `0000`

## Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Test Cards](https://paystack.com/docs/payments/test-payments/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Function Secrets](https://supabase.com/docs/guides/functions/secrets)

