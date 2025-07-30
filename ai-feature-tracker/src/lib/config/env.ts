import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service role key is required'),

  // Anthropic API Configuration
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  ANTHROPIC_RATE_LIMIT_RPM: z.coerce.number().positive().default(50),
  ANTHROPIC_RATE_LIMIT_TPM: z.coerce.number().positive().default(100000),

  // Application Configuration
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Database Configuration (optional for direct connections)
  DATABASE_URL: z.string().optional(),

  // Optional: External Service Configuration
  WEBHOOK_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Optional: Feature Flags
  ENABLE_AI_VALIDATION: z.coerce.boolean().default(true),
  ENABLE_REALTIME: z.coerce.boolean().default(true),
  ENABLE_CACHING: z.coerce.boolean().default(true),
});

export type Env = z.infer<typeof envSchema>;

// Parse and validate environment variables with development fallbacks
let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  // In development/build time, provide fallbacks
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '⚠️ Environment validation failed, using development fallbacks'
    );

    // Provide safe fallbacks for development
    const fallbackEnv = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        'https://dummy-project-12345.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtMTIzNDUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0NzIwMCwiZXhwIjoxOTU4MTIzMjAwfQ.dummy-signature-for-testing',
      SUPABASE_SERVICE_ROLE_KEY:
        process.env['SUPABASE_SERVICE_ROLE_KEY'] ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtMTIzNDUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQyNTQ3MjAwLCJleHAiOjE5NTgxMjMyMDB9.dummy-service-signature',
      ANTHROPIC_API_KEY:
        process.env['ANTHROPIC_API_KEY'] ||
        'sk-ant-api03-dummy-key-for-build-testing-only-not-real',
      ANTHROPIC_RATE_LIMIT_RPM:
        Number(process.env['ANTHROPIC_RATE_LIMIT_RPM']) || 50,
      ANTHROPIC_RATE_LIMIT_TPM:
        Number(process.env['ANTHROPIC_RATE_LIMIT_TPM']) || 100000,
      NEXT_PUBLIC_APP_ENV:
        (process.env.NEXT_PUBLIC_APP_ENV as any) || 'development',
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      DATABASE_URL: process.env['DATABASE_URL'],
      WEBHOOK_SECRET: process.env['WEBHOOK_SECRET'],
      LOG_LEVEL: (process.env['LOG_LEVEL'] as any) || 'info',
      ENABLE_AI_VALIDATION:
        process.env['ENABLE_AI_VALIDATION'] === 'true' || false,
      ENABLE_REALTIME: process.env['ENABLE_REALTIME'] !== 'false',
      ENABLE_CACHING: process.env['ENABLE_CACHING'] !== 'false',
    };

    parsedEnv = fallbackEnv as Env;
  } else {
    // In production, fail fast
    throw error;
  }
}

export const env = parsedEnv;

// Environment utilities
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isStaging = env.NODE_ENV === 'staging';
