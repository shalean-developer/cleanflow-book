# Supabase Remote Connection Guide

## Overview
Your app is already configured to connect to Supabase. You just need to add your remote Supabase credentials.

## Step-by-Step Setup

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 2. Create Environment Variables File

Create a new file named `.env` in your project root directory (same level as `package.json`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Paystack Configuration (Optional - for frontend)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxx
```

**Important:** Replace the values above with your actual credentials!

### 3. Restart Development Server

After creating the `.env` file:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. Test the Connection

Your app should now be connected to Supabase! To verify:

1. Open your browser at `http://localhost:8080`
2. Try to sign up or log in
3. Check the browser console for any errors
4. Go to Supabase Dashboard → **Authentication** → **Users** to see if new users appear

## How It Works

The Supabase client is configured in `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## Security Notes

- ✅ `.env` is now in `.gitignore` - it won't be committed to git
- ✅ The anon/public key is safe to use in frontend code
- ✅ Row Level Security (RLS) policies protect your data
- ⚠️ Never commit your `.env` file to version control
- ⚠️ Never use your service_role key in frontend code

## Troubleshooting

### Environment Variables Not Loading?

1. Make sure the `.env` file is in the root directory (same level as `package.json`)
2. Restart your dev server completely
3. Check that variable names start with `VITE_` (required for Vite)
4. No quotes needed around values in `.env` file

### Connection Errors?

1. Verify your Supabase URL is correct (should end with `.supabase.co`)
2. Verify your anon key is the full key (very long string)
3. Check browser console for specific error messages
4. Verify your Supabase project is active (not paused)

### Database Access Issues?

1. Check that RLS policies are set up correctly in Supabase
2. Go to **Authentication** → **Policies** in Supabase Dashboard
3. Make sure tables have appropriate RLS policies enabled

## Paystack Setup (Required for Payments)

Your app uses Paystack for payment processing. You need to configure it in **two places**:

### 1. Get Your Paystack Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign in to your account
3. Navigate to **Settings** → **API Keys & Webhooks**
4. Copy both keys:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Important:** Start with test keys (`pk_test_` and `sk_test_`) for development!

### 2. Add Paystack Keys to Supabase (Required)

Your payment functions run on Supabase Edge Functions and need the Paystack keys:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** → **Manage Secrets**
4. Click **Add Secret** and add these two secrets:

   **Secret 1:**
   - Name: `PAYSTACK_PUBLIC_KEY`
   - Value: `pk_test_xxxxxxxxxxxxxxxxxx` (your public key)

   **Secret 2:**
   - Name: `PAYSTACK_SECRET_KEY`
   - Value: `sk_test_xxxxxxxxxxxxxxxxxx` (your secret key)

5. Click **Save**

### 3. Verify Paystack Integration

After adding the keys:

1. Restart your dev server
2. Go through the booking flow in your app
3. Try to make a payment
4. Check that the Paystack payment popup appears
5. Use Paystack test cards to verify:
   - Success: `4084 0840 8408 4081` (any CVV, any future date)
   - Failure: `5060 6666 6666 6666` (any CVV, any future date)

## For Production Deployment

When deploying to production (e.g., Vercel, Netlify):

### Frontend Environment Variables (Hosting Platform)
1. Add these in your hosting platform's settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_PAYSTACK_PUBLIC_KEY` (optional)

### Backend Environment Variables (Supabase)
1. Update Supabase Edge Function secrets with **production** Paystack keys:
   - `PAYSTACK_PUBLIC_KEY` → Use `pk_live_...`
   - `PAYSTACK_SECRET_KEY` → Use `sk_live_...`

⚠️ **Critical:** Never use test keys in production!

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

