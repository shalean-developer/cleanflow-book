# How to Add Paystack Keys to Supabase - Step by Step

## 🎯 Quick Summary
Your "Continue to Payment" button is disabled because Supabase Edge Functions can't access your Paystack keys. Here's how to fix it:

---

## Step 1: Get Your Paystack Keys

### 1.1 Go to Paystack Dashboard
- Visit: https://dashboard.paystack.com/
- Sign in to your Paystack account

### 1.2 Navigate to API Keys
- Click **Settings** in the left sidebar
- Click **API Keys & Webhooks**

### 1.3 Copy Your Test Keys
You'll see two keys - copy both:

**Public Key (for frontend):**
```
pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Secret Key (for backend):**
```
sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important:** Use TEST keys first (they start with `pk_test_` and `sk_test_`)

---

## Step 2: Add Keys to Supabase Dashboard

### 2.1 Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project

### 2.2 Navigate to Edge Functions
- Click **Edge Functions** in the left sidebar
- Click **Manage Secrets** (or look for "Secrets" tab)

### 2.3 Add First Secret - Public Key
1. Click **Add Secret** button
2. Fill in:
   - **Name:** `PAYSTACK_PUBLIC_KEY`
   - **Value:** `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Click **Save**

### 2.4 Add Second Secret - Secret Key
1. Click **Add Secret** button again
2. Fill in:
   - **Name:** `PAYSTACK_SECRET_KEY`
   - **Value:** `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Click **Save**

### 2.5 Verify Secrets Added
You should now see both secrets listed:
- ✅ `PAYSTACK_PUBLIC_KEY`
- ✅ `PAYSTACK_SECRET_KEY`

---

## Step 3: Deploy Your Edge Functions

### 3.1 Get Your Project Reference ID
1. In Supabase Dashboard, go to **Settings** → **General**
2. Copy the **Project Reference ID** (looks like `vpbdcqzlvwtkumbtnxhe`)

### 3.2 Link Your Project (One-time setup)
```bash
supabase link --project-ref YOUR_PROJECT_REF_ID
```
Replace `YOUR_PROJECT_REF_ID` with your actual project ID.

### 3.3 Deploy Payment Functions
```bash
supabase functions deploy get-paystack-public-key
supabase functions deploy initialize-paystack-payment
supabase functions deploy verify-paystack-payment
```

### 3.4 Verify Functions are Deployed
- Go back to Supabase Dashboard → **Edge Functions**
- You should see all three functions listed and deployed

---

## Step 4: Test the Fix

### 4.1 Restart Your App
```bash
npm run dev
```

### 4.2 Test the Payment Button
1. Go through your booking flow
2. Reach the "Review & Pay" page
3. The "Continue to Payment • R 566,95" button should now be **active** (not grayed out)
4. Click it to test the Paystack popup

### 4.3 Test with Paystack Test Cards
When the payment popup appears, use these test cards:

**Successful Payment:**
- Card: `4084 0840 8408 4081`
- CVV: `408`
- Expiry: Any future date (e.g., 12/25)
- PIN: `0000`

**Failed Payment (to test error handling):**
- Card: `5060 6666 6666 6666`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 🔍 Troubleshooting

### Button Still Disabled?
1. **Check Browser Console (F12):**
   - Look for errors when loading the page
   - Check Network tab for failed requests to Supabase functions

2. **Check Supabase Function Logs:**
   - Go to Supabase Dashboard → **Edge Functions**
   - Click on `get-paystack-public-key`
   - Check the **Logs** tab for errors

3. **Verify Secrets are Correct:**
   - Make sure secret names are exactly: `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY`
   - Ensure values start with `pk_test_` and `sk_test_`

### Functions Not Deploying?
```bash
# Try deploying all functions at once
supabase functions deploy

# Or check if you're linked to the right project
supabase status
```

### "Unauthorized" Error?
```bash
# Re-login to Supabase
supabase login

# Then try linking again
supabase link --project-ref YOUR_PROJECT_REF_ID
```

---

## 📋 Checklist

Before testing, make sure you have:

- [ ] ✅ Added `PAYSTACK_PUBLIC_KEY` to Supabase secrets
- [ ] ✅ Added `PAYSTACK_SECRET_KEY` to Supabase secrets  
- [ ] ✅ Deployed `get-paystack-public-key` function
- [ ] ✅ Deployed `initialize-paystack-payment` function
- [ ] ✅ Deployed `verify-paystack-payment` function
- [ ] ✅ Restarted your dev server (`npm run dev`)
- [ ] ✅ Using Paystack TEST keys (not live keys)

---

## 🚀 What Happens Next?

Once you complete these steps:

1. **Button becomes active** - No longer grayed out
2. **Payment popup works** - Paystack payment form appears
3. **Bookings are created** - Successful payments create booking records
4. **Test cards work** - You can test the full payment flow

---

## 📞 Need Help?

If you're still having issues:

1. **Check the exact error** in browser console (F12)
2. **Verify your Paystack keys** are correct in Supabase secrets
3. **Make sure functions are deployed** in Supabase Dashboard
4. **Try the test cards** to see if payments work

The most common issue is forgetting to add the secrets to Supabase - make sure both `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` are added! 🔑
