# Quick Setup Guide - Supabase + Paystack

## 🎯 One-Page Setup Instructions

### Part 1: Supabase Connection (5 minutes)

#### 1. Get Supabase Credentials
- Go to https://supabase.com/dashboard
- Select your project → **Settings** → **API**
- Copy:
  - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
  - **anon public key**: `eyJhbGci...` (very long string)

#### 2. Create `.env` File
Create `.env` in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Test Connection
```bash
npm run dev
```
Open http://localhost:8080 and try to sign up!

---

### Part 2: Paystack Setup (10 minutes)

#### 1. Get Paystack Keys
- Go to https://dashboard.paystack.com/
- **Settings** → **API Keys & Webhooks**
- Copy both TEST keys:
  - Public: `pk_test_xxxxxxxxxx`
  - Secret: `sk_test_xxxxxxxxxx`

#### 2. Add Keys to Supabase (Critical!)
- Go to https://supabase.com/dashboard
- Select your project
- **Edge Functions** → **Manage Secrets**
- Add these TWO secrets:

```
Name: PAYSTACK_PUBLIC_KEY
Value: pk_test_xxxxxxxxxx

Name: PAYSTACK_SECRET_KEY  
Value: sk_test_xxxxxxxxxx
```

#### 3. Deploy Edge Functions
```bash
# Install Supabase CLI (one time only)
npm install -g supabase

# Login
supabase login

# Link your project (replace with your project ID)
supabase link --project-ref your-project-id

# Deploy payment functions
supabase functions deploy get-paystack-public-key
supabase functions deploy initialize-paystack-payment
supabase functions deploy verify-paystack-payment
```

#### 4. Test Payment
- Go through booking flow
- Use test card: `4084 0840 8408 4081`
- CVV: `408`, Expiry: any future date, PIN: `0000`

---

## ✅ Checklist

### Supabase Setup
- [ ] Created `.env` file with Supabase URL and key
- [ ] Restarted dev server (`npm run dev`)
- [ ] Can sign up / log in successfully

### Paystack Setup
- [ ] Added `PAYSTACK_PUBLIC_KEY` to Supabase secrets
- [ ] Added `PAYSTACK_SECRET_KEY` to Supabase secrets
- [ ] Deployed edge functions
- [ ] Payment popup appears in booking flow
- [ ] Test card payment works

---

## 🚨 Common Issues

### "Supabase connection failed"
→ Check `.env` file exists and has correct values
→ Restart dev server

### "Paystack public key not configured"
→ Keys must be in **Supabase Edge Function secrets**, NOT `.env` file
→ Go to Supabase Dashboard → Edge Functions → Manage Secrets

### "Edge function not found"
→ Deploy functions: `supabase functions deploy`

### Payment popup doesn't appear
→ Check browser console for errors
→ Verify Paystack keys in Supabase secrets
→ Ensure functions are deployed

---

## 📁 File Structure

```
cleanflow-book/
├── .env                          ← Create this (Supabase creds)
├── .gitignore                    ← .env is ignored (safe)
├── supabase/
│   └── functions/
│       ├── get-paystack-public-key/
│       ├── initialize-paystack-payment/
│       └── verify-paystack-payment/
└── src/
    └── integrations/
        └── supabase/
            └── client.ts         ← Uses .env variables
```

---

## 🔗 Detailed Guides

For more information, see:
- `SUPABASE_CONNECTION_GUIDE.md` - Complete Supabase setup
- `PAYSTACK_SETUP.md` - Complete Paystack guide

---

## 💡 Pro Tips

1. **Start with test keys** - Use `pk_test_` and `sk_test_` for development
2. **Don't commit `.env`** - It's already in `.gitignore`
3. **Keys go in Supabase** - Paystack keys belong in Supabase Edge Function secrets, not `.env`
4. **Deploy functions** - After updating code, redeploy: `supabase functions deploy`
5. **Check logs** - View Edge Function logs in Supabase Dashboard for debugging

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check Supabase Edge Function logs
3. Verify all credentials are correct
4. Ensure functions are deployed
5. Test with Paystack test cards

