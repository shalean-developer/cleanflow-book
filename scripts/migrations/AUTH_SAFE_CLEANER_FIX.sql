-- =====================================================
-- AUTH-SAFE CLEANER RLS FIX
-- =====================================================
-- This script fixes RLS issues without requiring authentication
-- and handles the case where auth.uid() might be null.

-- =====================================================
-- STEP 1: Add user_id column to cleaners table
-- =====================================================

ALTER TABLE public.cleaners 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cleaners_user_id ON public.cleaners(user_id);

-- =====================================================
-- STEP 2: Ensure profiles table has role column
-- =====================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';

-- =====================================================
-- STEP 3: Create user_roles table with proper constraints (if needed)
-- =====================================================

-- Create user_roles table with text type and proper constraints
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint on user_id only (one role per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: Drop existing policies (safely)
-- =====================================================

-- Drop existing policies only if they exist
DO $$
DECLARE
    policy_name text;
    policy_names text[] := ARRAY[
        'Cleaners are viewable by everyone',
        'Cleaners can view own profile',
        'Cleaners can update own profile',
        'Admins can insert cleaners',
        'Admins can update cleaners',
        'Admins can delete cleaners',
        'Admins can manage cleaners',
        'Anyone can view cleaners',
        'Cleaners can view own cleaner profile',
        'Admins can view all cleaners',
        'Active cleaners are viewable by everyone',
        'Anyone can view active cleaners'
    ];
BEGIN
    FOREACH policy_name IN ARRAY policy_names
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.cleaners', policy_name);
    END LOOP;
END $$;

-- =====================================================
-- STEP 5: Create new policies (safely)
-- =====================================================

-- Anyone can view active cleaners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Anyone can view active cleaners'
    ) THEN
        CREATE POLICY "Anyone can view active cleaners"
        ON public.cleaners
        FOR SELECT
        USING (active = true OR active IS NULL);
    END IF;
END $$;

-- Admins can insert cleaners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Admins can insert cleaners'
    ) THEN
        CREATE POLICY "Admins can insert cleaners"
        ON public.cleaners
        FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END $$;

-- Admins can update all cleaners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Admins can update all cleaners'
    ) THEN
        CREATE POLICY "Admins can update all cleaners"
        ON public.cleaners
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END $$;

-- Admins can delete cleaners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Admins can delete cleaners'
    ) THEN
        CREATE POLICY "Admins can delete cleaners"
        ON public.cleaners
        FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END $$;

-- Cleaners can view their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Cleaners can view own profile'
    ) THEN
        CREATE POLICY "Cleaners can view own profile"
        ON public.cleaners
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Cleaners can update their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cleaners' 
        AND policyname = 'Cleaners can update own profile'
    ) THEN
        CREATE POLICY "Cleaners can update own profile"
        ON public.cleaners
        FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- =====================================================
-- STEP 6: Create a simple admin user (if needed)
-- =====================================================

-- Create a default admin user if no admin exists
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if any admin users exist
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
        -- Create a default admin user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@shalean.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
        
        -- Create profile for the admin user
        INSERT INTO public.profiles (id, role, full_name, created_at)
        VALUES (admin_user_id, 'admin', 'System Admin', now());
        
        -- Create user role for the admin user
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin');
        
        RAISE NOTICE 'Created default admin user with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that user_id column exists
SELECT 'user_id column exists:' as info, 
       EXISTS (
         SELECT 1 FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = 'cleaners' 
         AND column_name = 'user_id'
       ) as column_exists;

-- Check that all policies exist
SELECT 'Current cleaners policies:' as info, policyname
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Check admin users in profiles table
SELECT 'Admin users in profiles:' as info;
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

-- Check admin users in user_roles table
SELECT 'Admin users in user_roles:' as info;
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';

-- Test admin access
SELECT 'Testing admin access...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- =====================================================
-- INSTRUCTIONS FOR MANUAL ADMIN SETUP
-- =====================================================

SELECT 'MANUAL SETUP INSTRUCTIONS:' as info;
SELECT 'If you need to manually set up an admin user:' as instruction_1;
SELECT '1. Log in to your application as the user you want to make admin' as instruction_2;
SELECT '2. Run this SQL to make them admin:' as instruction_3;
SELECT '   UPDATE public.profiles SET role = ''admin'' WHERE id = auth.uid();' as instruction_4;
SELECT '3. Or run this SQL to make a specific user admin:' as instruction_5;
SELECT '   UPDATE public.profiles SET role = ''admin'' WHERE id = ''USER_ID_HERE'';' as instruction_6;
