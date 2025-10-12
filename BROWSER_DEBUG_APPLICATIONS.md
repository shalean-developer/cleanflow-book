# Browser Console Debug: Applications Not Showing

If you prefer to debug from the browser instead of running SQL scripts, follow these steps.

## Step 1: Open Browser Developer Console

1. Go to your Admin Dashboard page
2. Press `F12` (or `Cmd+Option+I` on Mac) to open Developer Tools
3. Click on the "Console" tab

## Step 2: Check Current User

Paste this in the console:

```javascript
// Check who you're logged in as
const { data: { user } } = await supabase.auth.getUser();
console.log('👤 Current User:', user?.email);
console.log('🆔 User ID:', user?.id);
```

## Step 3: Check Your Role

```javascript
// Check your role in profiles table
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

console.log('👔 Your Profile:', profile);
console.log('🎭 Your Role:', profile?.role);
console.log('❌ Profile Error:', profileError);

// Check user_roles table too
const { data: userRoles, error: rolesError } = await supabase
  .from('user_roles')
  .select('*')
  .eq('user_id', user.id);

console.log('📋 User Roles:', userRoles);
console.log('❌ Roles Error:', rolesError);
```

## Step 4: Try to Fetch Applications

```javascript
// Try to fetch applications
const { data: applications, error: appError } = await supabase
  .from('cleaner_applications')
  .select('*');

console.log('📝 Applications Count:', applications?.length || 0);
console.log('📄 Applications:', applications);
console.log('❌ Applications Error:', appError);
```

## Step 5: Check RLS Policies

If you see an error about RLS or permissions, the issue is with Row Level Security policies.

**Error Message Meanings:**
- `"new row violates row-level security policy"` → RLS is blocking INSERT
- `"permission denied for table"` → RLS is blocking SELECT
- `"could not verify the JWT"` → Authentication issue

## Step 6: What the Error Means

### If you see applications in the database but can't fetch them:
**Problem:** RLS policy is blocking SELECT queries for your user

**Solution:** Run the SQL fix script (`QUICK_FIX_APPLICATIONS.sql`)

### If applications array is empty:
**Problem:** Either no applications exist OR you can't see them

**Check by running this in console:**
```javascript
// Try with RLS disabled (admin bypass)
const { count, error } = await supabase
  .from('cleaner_applications')
  .select('*', { count: 'exact', head: true });

console.log('Total applications in database:', count);
```

### If you're not an admin:
**Problem:** Your user doesn't have the admin role

**Solution:** Run the SQL fix to make yourself admin

## Step 7: Force Reload Admin Dashboard

After running the SQL fix:

```javascript
// Clear cache and reload
window.location.reload(true);

// Or if that doesn't work:
window.location.href = window.location.href;
```

## Complete Debug Script

Copy and paste this entire block into the console for a full diagnostic:

```javascript
(async function debugApplications() {
  console.log('🔍 Starting Diagnostic...\n');
  
  // 1. Check user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('1️⃣ Current User:');
  console.log('   Email:', user?.email);
  console.log('   ID:', user?.id);
  console.log('');
  
  // 2. Check profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  console.log('2️⃣ Profile:');
  console.log('   Role:', profile?.role || 'NOT SET');
  console.log('   Full Profile:', profile);
  console.log('');
  
  // 3. Check user_roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id);
  console.log('3️⃣ User Roles Table:');
  console.log('   Roles:', userRoles);
  console.log('');
  
  // 4. Check if admin
  const isAdmin = profile?.role === 'admin' || 
                  userRoles?.some(r => r.role === 'admin');
  console.log('4️⃣ Admin Status:');
  console.log('   Is Admin?', isAdmin ? '✅ YES' : '❌ NO');
  console.log('');
  
  // 5. Try to fetch applications
  const { data: applications, error: appError } = await supabase
    .from('cleaner_applications')
    .select('*');
  console.log('5️⃣ Applications Query:');
  console.log('   Count:', applications?.length || 0);
  console.log('   Error:', appError);
  if (applications?.length > 0) {
    console.log('   ✅ Applications loaded successfully!');
    console.log('   Sample:', applications[0]);
  } else if (appError) {
    console.log('   ❌ ERROR:', appError.message);
  } else {
    console.log('   ⚠️  No applications found (but no error)');
  }
  console.log('');
  
  // 6. Recommendation
  console.log('6️⃣ Recommendation:');
  if (!isAdmin) {
    console.log('   ⚠️  You are not an admin!');
    console.log('   → Run QUICK_FIX_APPLICATIONS.sql in Supabase');
  } else if (appError) {
    console.log('   ⚠️  RLS is blocking your query!');
    console.log('   → Run QUICK_FIX_APPLICATIONS.sql to fix policies');
  } else if (!applications || applications.length === 0) {
    console.log('   ⚠️  No applications in database');
    console.log('   → Check if applications were actually submitted');
  } else {
    console.log('   ✅ Everything looks good!');
    console.log('   → If dashboard still empty, try hard refresh (Ctrl+Shift+R)');
  }
  
  console.log('\n🏁 Diagnostic Complete!');
})();
```

## After Running the SQL Fix

Once you've run the SQL fix (`QUICK_FIX_APPLICATIONS.sql`), verify it worked:

```javascript
// Verify fix
(async function verifyFix() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  const { data: applications, error } = await supabase
    .from('cleaner_applications')
    .select('*');
    
  console.log('Admin Role:', profile?.role);
  console.log('Can fetch applications:', !error);
  console.log('Applications count:', applications?.length || 0);
  
  if (profile?.role === 'admin' && !error && applications?.length > 0) {
    console.log('✅ FIX SUCCESSFUL! Refresh the page.');
  } else {
    console.log('❌ Still not working. Check errors above.');
  }
})();
```

## Common Issues

### "supabase is not defined"
The Supabase client is not available in the global scope. Check if it's exposed:
```javascript
// Try accessing through window
window.supabase
// Or import it (if in a module context)
import { supabase } from '@/integrations/supabase/client';
```

### "Cannot read property 'from' of undefined"
The page hasn't loaded the Supabase client yet. Wait for page to fully load or reload.

### Applications show in console but not in UI
The UI might be cached. Try:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Open in incognito/private window

