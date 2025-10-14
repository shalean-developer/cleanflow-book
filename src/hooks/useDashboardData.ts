import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sbPage } from '@/lib/dataClient';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'> & {
  services?: Tables<'services'> | null;
  cleaners?: Tables<'cleaners'> | null;
};

/**
 * Hook for fetching paginated bookings based on user role
 * - Admins see all bookings
 * - Cleaners see assigned bookings
 * - Users see their own bookings
 */
export function useBookingsPage(pageSize = 10) {
  const { user, isAdmin, isCleaner, loading: authLoading } = useAuth();
  const [data, setData] = useState<Booking[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (!user || authLoading) {
        setLoading(authLoading);
        return;
      }

      setLoading(true);
      try {
        // For role-based filtering, we need to handle cleaners specially
        // since they're linked by cleaner_id not user_id
        let bookingsData: Booking[];

        if (isAdmin) {
          // Admin sees all bookings - start with basic query to avoid join issues
          const { data: adminData, error: adminError } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(pageSize);

          if (adminError) throw adminError;
          bookingsData = adminData || [];
        } else if (isCleaner) {
          // Cleaner sees assigned bookings - need to get cleaner_id first
          const { data: cleanerProfile } = await supabase
            .from('cleaners')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (cleanerProfile) {
            const { data: cleanerData, error: cleanerError } = await supabase
              .from('bookings')
              .select(`
                *,
                services(*)
              `)
              .eq('cleaner_id', cleanerProfile.id)
              .order('created_at', { ascending: false })
              .limit(pageSize);

            if (cleanerError) throw cleanerError;
            bookingsData = cleanerData || [];
          } else {
            bookingsData = [];
          }
        } else {
          // Regular user sees their own bookings
          const { data: userData, error: userError } = await supabase
            .from('bookings')
            .select(`
              *,
              services(*),
              cleaners(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(pageSize);

          if (userError) throw userError;
          bookingsData = userData || [];
        }

        if (!cancel) {
          setData(bookingsData);
          // Simple pagination: if we got full page, there might be more
          setNextCursor(bookingsData.length === pageSize ? 'has-more' : null);
        }
      } catch (e: any) {
        if (!cancel) {
          console.error('Error fetching bookings:', e);
          setError(e);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id, isAdmin, isCleaner, authLoading, cursor, pageSize]);

  return {
    rows: data,
    loading: loading || authLoading,
    error,
    next: () => setCursor(nextCursor),
    hasMore: !!nextCursor,
    refresh: () => {
      setCursor(null);
      setNextCursor(null);
    }
  };
}

/**
 * Hook for fetching dashboard statistics based on user role
 * - Admins see all stats
 * - Cleaners see their assigned booking stats
 * - Users see their own booking stats
 */
export function useDashboardStats() {
  const { user, isAdmin, isCleaner, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    scheduled: number;
    completed: number;
    cancelled?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (!user || authLoading) {
        setLoading(authLoading);
        return;
      }

      setLoading(true);
      try {
        const applyRoleFilter = (query: any) => {
          if (isAdmin) {
            return query; // No filter for admin
          } else if (isCleaner) {
            // For cleaners, we need their cleaner_id
            // This is a simplified approach - in practice you'd get the cleaner_id first
            return query; // Will be filtered below
          } else {
            return query.eq('user_id', user.id);
          }
        };

        let cleanerId: string | null = null;
        if (isCleaner) {
          const { data: cleanerProfile } = await supabase
            .from('cleaners')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          cleanerId = cleanerProfile?.id || null;
        }

        // Build base query
        const buildQuery = (status?: string) => {
          let q = supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true });

          if (status) {
            q = q.eq('status', status);
          }

          if (isAdmin) {
            // No filter
          } else if (isCleaner && cleanerId) {
            q = q.eq('cleaner_id', cleanerId);
          } else {
            q = q.eq('user_id', user.id);
          }

          return q;
        };

        const [total, pending, scheduled, completed, cancelled] = await Promise.all([
          buildQuery(),
          buildQuery('pending'),
          buildQuery('scheduled'),
          buildQuery('completed'),
          buildQuery('cancelled'),
        ]);

        if (!cancel) {
          setStats({
            total: total.count ?? 0,
            pending: pending.count ?? 0,
            scheduled: scheduled.count ?? 0,
            completed: completed.count ?? 0,
            cancelled: cancelled.count ?? 0,
          });
        }
      } catch (e: any) {
        if (!cancel) {
          console.error('Error fetching stats:', e);
          setError(e);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id, isAdmin, isCleaner, authLoading]);

  return { stats, loading: loading || authLoading, error };
}

/**
 * Hook for fetching payment statistics (primarily for admin)
 */
export function usePaymentStats() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    successful: number;
    pending: number;
    failed: number;
    revenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (!user || authLoading || !isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount, status');

        if (paymentsError) throw paymentsError;

        const paymentsList = payments || [];
        const revenue = paymentsList
          .filter(p => p.status === 'success')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        if (!cancel) {
          setStats({
            total: paymentsList.length,
            successful: paymentsList.filter(p => p.status === 'success').length,
            pending: paymentsList.filter(p => p.status === 'pending').length,
            failed: paymentsList.filter(p => p.status === 'failed').length,
            revenue,
          });
        }
      } catch (e: any) {
        if (!cancel) {
          console.error('Error fetching payment stats:', e);
          setError(e);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id, isAdmin, authLoading]);

  return { stats, loading, error };
}

/**
 * Hook for fetching cleaner statistics (for admin)
 */
export function useCleanerStats() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    active: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (!user || authLoading || !isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: cleaners, error: cleanersError } = await supabase
          .from('cleaners')
          .select('id, available');

        if (cleanersError) throw cleanersError;

        if (!cancel) {
          setStats({
            total: cleaners?.length ?? 0,
            active: cleaners?.filter(c => c.available).length ?? 0,
          });
        }
      } catch (e: any) {
        if (!cancel) {
          console.error('Error fetching cleaner stats:', e);
          setError(e);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id, isAdmin, authLoading]);

  return { stats, loading, error };
}

/**
 * Hook for fetching application statistics (for admin)
 */
export function useApplicationStats() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (!user || authLoading || !isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: applications, error: appsError } = await supabase
          .from('cleaner_applications')
          .select('status');

        if (appsError) throw appsError;

        if (!cancel) {
          const apps = applications || [];
          setStats({
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending' || a.status === 'new').length,
            approved: apps.filter(a => a.status === 'approved').length,
            rejected: apps.filter(a => a.status === 'rejected').length,
          });
        }
      } catch (e: any) {
        if (!cancel) {
          console.error('Error fetching application stats:', e);
          setError(e);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id, isAdmin, authLoading]);

  return { stats, loading, error };
}

