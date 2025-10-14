/**
 * Authenticated API wrapper with automatic token refresh on 401
 * Use this for external API calls that require authentication
 */
import { supabase } from '@/lib/supabase';

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  
  let res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  // If we get a 401, try refreshing the session and retry once
  if (res.status === 401) {
    console.log('API call received 401, attempting to refresh session...');
    
    await supabase.auth.refreshSession();
    const token2 = (await supabase.auth.getSession()).data.session?.access_token;
    
    res = await fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
      },
      credentials: 'include',
    });

    // If still 401 after refresh, sign out
    if (res.status === 401) {
      console.log('API call still 401 after refresh, signing out...');
      await supabase.auth.signOut();
    }
  }

  return res;
}

