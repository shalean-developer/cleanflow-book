-- =============================================
-- Make admin@shalean.com an Admin
-- =============================================
-- This script adds the admin role to the user_roles table

-- First, ensure the app_role type exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'cleaner');
  END IF;
END $$;

-- Ensure user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Step 1: Update the existing role to 'admin' (or insert if doesn't exist)
-- The table has a unique constraint on user_id, so each user can only have one role
UPDATE public.user_roles
SET role = 'admin',
    created_at = COALESCE(created_at, now())
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@shalean.com'
);

-- If the user doesn't exist in user_roles yet, insert them
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@shalean.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@shalean.com')
  );

-- Step 3: Verify the changes
SELECT 
  u.email,
  u.id as user_id,
  p.full_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';

-- =============================================
-- Expected Result:
-- The query above should show:
-- - email: admin@shalean.com
-- - role: admin
-- =============================================

-- Additional: Check if user exists in auth.users
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'admin@shalean.com';

