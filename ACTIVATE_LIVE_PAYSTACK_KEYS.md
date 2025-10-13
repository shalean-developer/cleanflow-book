# Activate Live Paystack Keys - Quick Guide

## 🎯 Your Project
**Project ID:** `utfvbtcszzafuoyytlpf`
**Direct Link:** https://supabase.com/dashboard/project/utfvbtcszzafuoyytlpf

---

## ✅ Step-by-Step Instructions

### Step 1: Update Paystack Keys in Supabase

1. **Go to Edge Functions:**
   - Visit: https://supabase.com/dashboard/project/utfvbtcszzafuoyytlpf/functions
   - Click **"Manage Secrets"** button (top right)

2. **Update PAYSTACK_PUBLIC_KEY:**
   - Find the secret named `PAYSTACK_PUBLIC_KEY`
   - Click the **Edit** icon (pencil) or **⋮** menu
   - Replace with your **live public key**: `pk_live_...`
   - Click **Save** or **Update**

3. **Update PAYSTACK_SECRET_KEY:**
   - Find the secret named `PAYSTACK_SECRET_KEY`
   - Click the **Edit** icon (pencil) or **⋮** menu
   - Replace with your **live secret key**: `sk_live_...`
   - Click **Save** or **Update**

---

### Step 2: Redeploy Payment Functions

After updating the secrets, redeploy these 3 functions:

1. **In Edge Functions page**, find each function and click the **⋮** menu (three dots)
2. Select **"Redeploy"** for each of these:
   - ✅ `get-paystack-public-key`
   - ✅ `initialize-paystack-payment`
   - ✅ `verify-paystack-payment`

**Alternative:** If you have the "Redeploy All" option, you can use that to redeploy all functions at once.

---

### Step 3: Verify It's Working

#### Test with a Small Transaction:
1. Go to your live app
2. Create a booking with the minimum amount
3. Use a **real card** (not test cards)
4. Complete the payment

#### Check Paystack Dashboard:
1. Go to: https://dashboard.paystack.com/
2. Make sure you're in **Live Mode** (toggle at the top)
3. Check **Transactions** - you should see your test payment
4. Verify the amount and status

#### Check Your App:
- Booking should be created successfully
- Payment status should show as "paid"
- You should be redirected to confirmation page

---

## 🔍 Verification Checklist

- [ ] `PAYSTACK_PUBLIC_KEY` updated to `pk_live_...`
- [ ] `PAYSTACK_SECRET_KEY` updated to `sk_live_...`
- [ ] All 3 payment functions redeployed
- [ ] Test booking completed successfully
- [ ] Payment visible in Paystack Live dashboard
- [ ] No errors in browser console (F12)

---

## ⚠️ Important Security Notes

### DO:
✅ Keep your live secret key private
✅ Monitor Paystack dashboard regularly
✅ Test with small amounts first
✅ Set up email notifications in Paystack for transactions

### DON'T:
❌ Share your secret key with anyone
❌ Commit keys to Git
❌ Use test cards with live keys (they won't work)
❌ Skip the test transaction

---

## 🐛 Troubleshooting

### "Payment failed" or "Invalid key" error:

**Check:**
1. Keys are correctly copied (no extra spaces)
2. Using `pk_live_...` not `pk_test_...`
3. Functions were redeployed after updating secrets

**Fix:**
- Go back to Supabase → Manage Secrets
- Verify both keys start with `pk_live_` and `sk_live_`
- Redeploy functions again

---

### Booking created but payment shows as "pending":

**Check:**
1. Paystack dashboard for the transaction status
2. Edge Function logs in Supabase (Functions → Click function → Logs tab)

**Fix:**
- Verify webhook URLs are set up in Paystack (if required)
- Check `verify-paystack-payment` function logs for errors

---

### Can't see transactions in Paystack Live dashboard:

**Check:**
1. You're in **Live Mode** (toggle at top of Paystack dashboard)
2. Using live keys, not test keys
3. Transaction actually completed (check your bank)

---

## 📊 Monitoring Your Live Payments

### In Paystack Dashboard:
1. Go to: https://dashboard.paystack.com/
2. Switch to **Live Mode**
3. Monitor:
   - **Transactions** - See all payments
   - **Customers** - View customer list
   - **Reports** - Financial summaries

### In Supabase:
1. Go to: https://supabase.com/dashboard/project/utfvbtcszzafuoyytlpf/editor
2. Check tables:
   - `bookings` - All booking records
   - `payment_records` - All payment data

### Set Up Alerts:
1. **Paystack:** Settings → Notifications
   - Enable email alerts for successful payments
   - Enable alerts for failed payments
2. **Email notifications** for large transactions

---

## 🔄 Rolling Back (If Needed)

If something goes wrong and you need to switch back to test keys:

1. **Update secrets** back to test keys:
   - `PAYSTACK_PUBLIC_KEY` → `pk_test_...`
   - `PAYSTACK_SECRET_KEY` → `sk_test_...`

2. **Redeploy functions** (same 3 functions)

3. **Investigate the issue** before going live again

---

## ✨ You're All Set!

Once you complete these steps:
- ✅ Your app accepts live payments
- ✅ Customers can book with real cards
- ✅ Money goes to your Paystack account
- ✅ Bookings are automatically created

**Remember:** Always test with a small transaction first! 🎉

---

## 📞 Need Help?

If you run into issues:
1. Check the **Edge Function Logs** in Supabase
2. Check **Transaction Details** in Paystack
3. Look for errors in **Browser Console** (F12)
4. Compare with this checklist to ensure all steps were completed

