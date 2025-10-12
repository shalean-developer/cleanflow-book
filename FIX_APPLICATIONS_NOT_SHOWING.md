# Fix: Applications Not Showing in Admin Dashboard

## Problem
You have 3 applications in the database but they're not showing up in the admin dashboard.

## Root Cause
This is likely due to one of two issues:
1. **RLS Policy Issue**: The Row Level Security policies may be preventing you from viewing the data
2. **Admin Role Not Set**: Your user account may not have the `admin` role in the profiles table

## Quick Fix Steps

### Step 1: Diagnose the Issue
Run the diagnostic script in Supabase SQL Editor:
```bash
# Open Supabase Dashboard > SQL Editor
# Copy and paste the contents of: diagnose_applications_issue.sql
```

This will tell you:
- How many applications exist
- If your user has the admin role
- What RLS policies are active

### Step 2: Apply the Fix
Run the fix script in Supabase SQL Editor:
```bash
# Open Supabase Dashboard > SQL Editor
# Copy and paste the contents of: fix_applications_rls.sql
# IMPORTANT: Update the email in the script to YOUR email address
```

### Step 3: Verify the Fix
After running the fix:
1. Refresh your browser on the admin dashboard
2. Navigate to the "Applications" tab
3. You should now see all 3 applications

## Manual Quick Fix (If you prefer)

If you want to quickly check and fix without running the full scripts:

### Check Your Admin Status
```sql
-- Check if you're an admin
SELECT id, email, role FROM profiles WHERE id = auth.uid();
```

### Make Yourself Admin
```sql
-- Replace with your email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Check Applications
```sql
-- Verify applications exist
SELECT COUNT(*), status 
FROM cleaner_applications 
GROUP BY status;
```

## Alternative: Update RLS Policy

If you're sure you're an admin but still can't see applications, update the RLS policy:

```sql
-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Authenticated users can read applications" ON public.cleaner_applications;

-- Create new policy that allows authenticated users
CREATE POLICY "Allow authenticated users to view applications"
ON public.cleaner_applications
FOR SELECT
USING (auth.role() = 'authenticated');
```

## Troubleshooting

### Issue: "permission denied for table cleaner_applications"
**Solution**: RLS is blocking access. Run the fix script above.

### Issue: "Applications count shows 0"
**Solution**: Applications don't exist in database. Check if they were actually submitted.

### Issue: "Still showing 0 after fix"
**Solution**: 
1. Check browser console for errors (F12 > Console)
2. Verify you're logged in as admin
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## Console Commands to Debug

Open your browser's developer console (F12) on the admin dashboard and run:

```javascript
// Check if user is logged in
const { data: { user } } = await window.supabase.auth.getUser();
console.log('Current user:', user);

// Try to fetch applications directly
const { data, error } = await window.supabase
  .from('cleaner_applications')
  .select('*');
console.log('Applications:', data);
console.log('Error:', error);

// Check user profile
const { data: profile } = await window.supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
console.log('User profile:', profile);
```

## What the Fix Does

1. **Removes conflicting RLS policies** - Multiple SELECT policies can conflict
2. **Creates a single comprehensive policy** - Allows authenticated users to view applications
3. **Ensures admin role is set** - Updates your user profile to have admin role
4. **Verifies the fix** - Includes a query to confirm applications are now visible

## Need More Help?

If applications still don't show after following these steps:
1. Check the browser console (F12) for JavaScript errors
2. Check the Network tab to see if the API request is failing
3. Verify you're on the correct Supabase project
4. Ensure the Supabase client is properly configured in your app

## Files Created
- `diagnose_applications_issue.sql` - Diagnostic queries
- `fix_applications_rls.sql` - Fix script with detailed steps
- This guide - Step-by-step instructions

