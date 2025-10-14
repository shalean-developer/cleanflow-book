-- Quick script to check and fix admin role assignment
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the user exists and what role they have
SELECT 
  u.id, 
  u.email, 
  u.created_at,
  p.full_name,
  ur.role as user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';

-- Step 2: If no role found, assign admin role
-- First, ensure the user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Step 3: Insert or update admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@shalean.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- Step 4: Add role column to profiles table if it doesn't exist (for backward compatibility)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Update profile role for backward compatibility
UPDATE public.profiles 
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@shalean.com');

-- Step 5: Verify the changes
SELECT 
  u.email,
  u.id as user_id,
  p.full_name,
  p.role as profile_role,
  ur.role as user_role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';
