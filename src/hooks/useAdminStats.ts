import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type AdminStats = {
  total_bookings: number
  pending: number
  successful_payments: number
  active_cleaners: number
  total_revenue: number
}

export function useAdminStats() {
  const { user } = useAuth()
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user) { setData(null); setLoading(false); return }
      setLoading(true)
      try {
        const { data, error } = await supabase.rpc('admin_dashboard_stats')
        if (error) throw error
        const row = Array.isArray(data) ? data[0] : data
        if (!cancelled) setData(row ?? { total_bookings:0, pending:0, successful_payments:0, active_cleaners:0, total_revenue:0 })
      } catch (e:any) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [user?.id])

  return { data, loading, error }
}
