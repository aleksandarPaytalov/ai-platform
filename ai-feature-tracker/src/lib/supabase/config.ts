import { env } from '@/lib/config/env';

export const supabaseConfig = {
	url: env.NEXT_PUBLIC_SUPABASE_URL,
	anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
	realtime: {
		enabled: env.ENABLE_REALTIME ?? true,
		heartbeatIntervalMs: 30000,
		reconnectDelayMs: 1000
	},
	monitoring: {
		enabled: env.LOG_LEVEL === 'debug'
	}
} as const;

export type SupabaseConfig = typeof supabaseConfig;


