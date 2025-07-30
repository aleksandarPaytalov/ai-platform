import { env } from './env';

/**
 * Validates that all required environment variables are set
 * Throws descriptive errors for missing or invalid variables
 */
export function validateEnvironment(): void {
  const errors: string[] = [];

  // Check Supabase configuration
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  // Check Anthropic configuration
  if (!env.ANTHROPIC_API_KEY) {
    errors.push('ANTHROPIC_API_KEY is required for AI features');
  }

  // Production-specific validations
  if (env.NODE_ENV === 'production') {
    if (!env.NEXT_PUBLIC_APP_URL) {
      errors.push('NEXT_PUBLIC_APP_URL is required in production');
    }

    if (env.LOG_LEVEL === 'debug') {
      console.warn('Warning: Debug logging enabled in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map(err => `  - ${err}`).join('\n')}`
    );
  }
}

/**
 * Returns current environment information for debugging
 */
export function getEnvironmentInfo() {
  return {
    nodeEnv: env.NODE_ENV,
    appEnv: env.NEXT_PUBLIC_APP_ENV,
    supabaseConfigured:
      !!env.NEXT_PUBLIC_SUPABASE_URL && !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anthropicConfigured: !!env.ANTHROPIC_API_KEY,
    featuresEnabled: {
      aiValidation: env.ENABLE_AI_VALIDATION,
      realtime: env.ENABLE_REALTIME,
      caching: env.ENABLE_CACHING,
    },
  };
}
