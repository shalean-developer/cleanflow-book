import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;
type UserRole = 'customer' | 'admin' | 'cleaner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isCleaner: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profileError && profileData) {
        setProfile(profileData);
      }

      // Fetch user role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      console.log('Role data:', roleData, 'Role error:', roleError);
      
      if (!roleError && roleData) {
        console.log('Setting user role from user_roles table:', roleData.role);
        setUserRole(roleData.role as UserRole);
      } else {
        // Fallback: try to get role from profile table for backward compatibility
        if (profileData?.role) {
          console.log('Setting user role from profile table:', profileData.role);
          setUserRole(profileData.role as UserRole);
        } else {
          // Default to customer if no role found
          console.log('No role found, defaulting to customer');
          setUserRole('customer');
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Default to customer on error
      setUserRole('customer');
    }
  };

  useEffect(() => {
    let cancelled = false;

    // ❶ Listen for auth state changes - use INITIAL_SESSION to end loading reliably
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (cancelled) return;
        
        console.log('Auth state changed:', event, 'Session:', !!currentSession);
        
        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);
        
        // End loading state on definitive events
        if (
          event === 'INITIAL_SESSION' ||
          event === 'SIGNED_IN' ||
          event === 'SIGNED_OUT' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        ) {
          setLoading(false);
        }
        
        // Fetch profile for authenticated users (non-blocking)
        if (currentSession?.user) {
          // Fire-and-forget: don't block auth loading on profile fetch
          fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // ❷ Also call getSession once to prime local state
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      // Note: don't set loading false here; onAuthStateChange INITIAL_SESSION will do it
    });

    // ❸ Hard-stop guard so we never spin forever (e.g., storage blocked)
    const failSafe = setTimeout(() => {
      if (!cancelled) {
        console.warn('Auth restoration timeout - forcing loading state to end');
        setLoading(false);
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/booking/review`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const redirectUrl = `${window.location.origin}/booking/review`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUserRole(null);
  };

  const isAdmin = userRole === 'admin';
  const isCleaner = userRole === 'cleaner';
  const isCustomer = userRole === 'customer';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile,
      userRole,
      signUp, 
      signIn, 
      signInWithMagicLink, 
      signOut, 
      loading,
      isAdmin,
      isCleaner,
      isCustomer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
