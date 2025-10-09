import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    console.log('[AuthContext] Fetching user role for:', userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      console.log('[AuthContext] User role data:', data, 'Error:', error);
      
      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('customer'); // Default to customer on error
      } else if (data && data.length > 0) {
        // If user has multiple roles, prioritize admin > cleaner > customer
        const roles = data.map(r => r.role);
        console.log('[AuthContext] User roles:', roles);
        if (roles.includes('admin')) {
          console.log('[AuthContext] User is admin');
          setUserRole('admin');
        } else if (roles.includes('cleaner')) {
          console.log('[AuthContext] User is cleaner');
          setUserRole('cleaner');
        } else {
          console.log('[AuthContext] User role:', roles[0]);
          setUserRole(roles[0]);
        }
      } else {
        // If no role exists, default to customer
        console.log('[AuthContext] No role found, defaulting to customer');
        setUserRole('customer');
      }
    } catch (error) {
      console.error('Caught error fetching user role:', error);
      setUserRole('customer'); // Default to customer on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Setting up auth listeners...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed. Event:', event, 'User:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('[AuthContext] Fetching role for user:', session.user.id);
        await fetchUserRole(session.user.id);
      } else {
        console.log('[AuthContext] No user in session');
        setUserRole(null);
        setLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[AuthContext] Got existing session. User:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('[AuthContext] Fetching role for existing session user:', session.user.id);
        await fetchUserRole(session.user.id);
      } else {
        console.log('[AuthContext] No existing session');
        setLoading(false);
      }
    });

    return () => {
      console.log('[AuthContext] Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        return { error };
      }
      
      toast.success('Account created successfully! You can now sign in.');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      toast.success('Signed in successfully!');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
