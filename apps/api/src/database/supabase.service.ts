import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://vcpolxmadkpzllvmjuap.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_11oRl5N41M1rvMSgUWBbBA_nbcSPx8p';

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.logger.log(`Supabase Client initialized against ${supabaseUrl}`);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Generates or retrieves a stable Supabase Auth user identity for the given mobile number
   */
  async ensureSupabaseAuthUser(mobile: string, name?: string): Promise<string | null> {
    try {
      // In Supabase, phone or synthetic email can be used as unique auth identity
      const syntheticEmail = `farmer.${mobile}@kisanpehele.gov.in`;
      
      const { data, error } = await this.client.auth.signUp({
        email: syntheticEmail,
        password: `KP#Auth_${mobile}_2026!`,
        options: {
          data: {
            mobile,
            full_name: name || `Farmer ${mobile.slice(-4)}`,
            role: 'FARMER',
          },
        },
      });

      if (data?.user?.id) {
        this.logger.log(`Created new Supabase Auth user: ${data.user.id}`);
        return data.user.id;
      }

      if (error && error.message.includes('already registered')) {
        // Sign in to retrieve user id
        const signInRes = await this.client.auth.signInWithPassword({
          email: syntheticEmail,
          password: `KP#Auth_${mobile}_2026!`,
        });
        if (signInRes.data?.user?.id) {
          return signInRes.data.user.id;
        }
      }

      return null;
    } catch (err: any) {
      this.logger.warn(`Supabase Auth sync note: ${err.message}`);
      return null;
    }
  }

  /**
   * Broadcasts a live queue update event to Supabase Realtime channel
   */
  async broadcastQueueUpdate(centerId: string, payload: any) {
    try {
      const channel = this.client.channel(`mandi-queue:${centerId}`);
      await channel.send({
        type: 'broadcast',
        event: 'queue_state_changed',
        payload,
      });
    } catch (err: any) {
      this.logger.warn(`Realtime broadcast notice: ${err.message}`);
    }
  }
}
