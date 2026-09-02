import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vcpolxmadkpzllvmjuap.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_11oRl5N41M1rvMSgUWBbBA_nbcSPx8p';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Subscribes to live queue events for a specific procurement center
 */
export function subscribeToMandiQueue(
  centerId: string,
  onQueueUpdate: (payload: any) => void,
) {
  const channel = supabase
    .channel(`mandi-queue:${centerId}`)
    .on('broadcast', { event: 'queue_state_changed' }, (payload) => {
      onQueueUpdate(payload.payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribes to center operational status updates (OPEN, BUSY, FULL, LIMITED_CAPACITY, etc.)
 */
export function subscribeToCenterStatus(
  centerId: string,
  onStatusChange: (payload: any) => void,
) {
  const channel = supabase
    .channel(`centre-status:${centerId}`)
    .on('broadcast', { event: 'status_updated' }, (payload) => {
      onStatusChange(payload.payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
