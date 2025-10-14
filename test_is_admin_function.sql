-- Test and fix the is_admin function
-- This ensures the admin check works properly

-- Check if the function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- If the function doesn't exist or has issues, recreate it
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'
  );
$$;

-- Test the function with current user
SELECT 
    auth.uid() as current_user_id,
    public.is_admin(auth.uid()) as is_admin_result;

-- Check if there are any profiles with admin role
SELECT 
    id,
    role,
    full_name
FROM profiles 
WHERE role = 'admin';

-- If no admin profiles exist, create one for testing
-- (Replace 'your-user-id-here' with actual user ID)
-- INSERT INTO profiles (id, role, full_name)
-- VALUES ('your-user-id-here', 'admin', 'Admin User')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
