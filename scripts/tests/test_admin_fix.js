// Test script to verify admin role fix
// Run this in browser console after applying the SQL fix

const testAdminAccess = async () => {
  console.log('Testing admin access...');
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('Current user:', user?.email);
  
  if (!user) {
    console.error('No user logged in');
    return;
  }
  
  // Check user_roles table
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  console.log('User role from user_roles table:', userRole);
  console.log('Role error:', roleError);
  
  // Check profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  console.log('Profile role:', profile);
  console.log('Profile error:', profileError);
  
  // Test has_role function if it exists
  try {
    const { data: hasRoleResult, error: hasRoleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });
    console.log('has_role function result:', hasRoleResult);
    console.log('has_role error:', hasRoleError);
  } catch (e) {
    console.log('has_role function not available:', e.message);
  }
  
  console.log('Test complete. If user_roles shows role: "admin", the fix worked!');
};

// Run the test
testAdminAccess();
