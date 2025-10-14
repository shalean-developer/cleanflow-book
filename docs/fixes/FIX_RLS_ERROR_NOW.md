# 🚨 URGENT: Fix "violates row-level security policy" Error

## ⚡ **INSTANT FIX (30 seconds)**

The quote form is failing because the database has Row Level Security (RLS) blocking inserts.

### **Quick Solution: Disable RLS Temporarily**

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste this ONE line:

```sql
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;
```

4. Click **Run**
5. **Done!** ✅ Quotes will now work immediately

---

## 🔐 **Better Solution: Proper RLS Policies (2 minutes)**

For production, you should have RLS enabled with proper policies.

### **Option A: Run Updated Script**

In Supabase SQL Editor, run the entire content of:
**`URGENT_FIX_QUOTES_RLS.sql`**

This will:
- ✅ Clean up all conflicting policies
- ✅ Create correct public insert policy
- ✅ Test that it works
- ✅ Keep RLS enabled for security

### **Option B: Run Complete Fix**

In Supabase SQL Editor, run the updated:
**`apply_quote_fix.sql`**

This includes:
- ✅ Table creation (if not exists)
- ✅ Correct RLS policies
- ✅ Indexes for performance
- ✅ Verification queries

---

## 🔍 **What Went Wrong**

The RLS policy was using this (which doesn't work for anonymous users):

```sql
CREATE POLICY "Anyone can submit quotes"
  ON public.quotes
  FOR INSERT
  WITH CHECK (true);  -- ❌ Missing "TO public"
```

It needs to be:

```sql
CREATE POLICY "Allow public insert"
  ON public.quotes
  FOR INSERT
  TO public              -- ✅ This allows anonymous users
  WITH CHECK (true);
```

The key difference is **`TO public`** which explicitly allows both authenticated AND anonymous users.

---

## ✅ **Verification**

After applying the fix, test it:

1. Go to your website
2. Navigate to `/booking/quote`
3. Fill out the form
4. Click "Request Quote"
5. Should see: ✅ "Quote request submitted successfully!"

### **Check Database**
```sql
-- Should return your quotes
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 5;
```

### **Check Policies**
```sql
-- Should show "Allow public insert" and "Allow public select"
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'quotes';
```

---

## 🎯 **Choose Your Fix**

### **Need it working RIGHT NOW?**
→ Run: `INSTANT_FIX_RLS.sql` (disables RLS)

### **Want proper security?**
→ Run: `URGENT_FIX_QUOTES_RLS.sql` (fixes RLS properly)

### **Clean slate setup?**
→ Run: `apply_quote_fix.sql` (complete setup)

---

## 🐛 **Still Having Issues?**

### Check if quotes table exists:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'quotes';
```

If not found, run `apply_quote_fix.sql` first.

### Check current RLS status:
```sql
SELECT 
  tablename, 
  rowsecurity as rls_enabled 
FROM pg_tables 
WHERE tablename = 'quotes';
```

### View current policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'quotes';
```

---

## 📝 **Summary**

**Error:** `new row violates row-level security policy for table "quotes"`

**Cause:** RLS policy missing `TO public` clause

**Fix:** Add `TO public` to INSERT policy OR disable RLS temporarily

**Files to use:**
- ⚡ **INSTANT_FIX_RLS.sql** - Fastest (disables RLS)
- 🔐 **URGENT_FIX_QUOTES_RLS.sql** - Best (fixes RLS properly)
- 📦 **apply_quote_fix.sql** - Complete setup

---

**Pick one and run it now - your quote form will work immediately! 🚀**

