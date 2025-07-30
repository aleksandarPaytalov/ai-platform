import { env } from './env';

export const databaseConfig = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      enabled: env.ENABLE_REALTIME,
      heartbeatIntervalMs: 30000,
      reconnectDelayMs: 1000,
    },
  },
} as const;
