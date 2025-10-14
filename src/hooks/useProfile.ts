import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;
type UserRole = 'customer' | 'admin' | 'cleaner';

interface ProfileWithRole extends UserProfile {
  role?: UserRole;
}

/**
 * Hook for loading user profile data safely without blocking the UI.
 * Use this for non-critical profile data that shouldn't block authentication.
 * 
 * For role-based access control, prefer using the useAuth hook which includes
 * isAdmin, isCleaner, and isCustomer flags.
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error && status !== 406) {
        console.error('Profile loading error:', error);
      }

      // If there's no row yet, don't block the UI — provide a default profile
      setProfile(data ?? { 
        id: user.id,
        role: 'customer',
        full_name: user.email?.split('@')[0] || 'User',
        avatar_url: null,
        updated_at: new Date().toISOString()
      } as ProfileWithRole);
      
      setLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { profile, loading };
}

