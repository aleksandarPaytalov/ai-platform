// Development environment configuration
// This file provides fallback values when .env.local is not present

const developmentEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://dummy-project-12345.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtMTIzNDUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0NzIwMCwiZXhwIjoxOTU4MTIzMjAwfQ.dummy-signature-for-testing',
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtMTIzNDUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQyNTQ3MjAwLCJleHAiOjE5NTgxMjMyMDB9.dummy-service-signature',
  ANTHROPIC_API_KEY:
    process.env.ANTHROPIC_API_KEY ||
    'sk-ant-api03-dummy-key-for-build-testing-only-not-real',
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ENABLE_AI_VALIDATION: process.env.ENABLE_AI_VALIDATION || 'false',
  ENABLE_REALTIME: process.env.ENABLE_REALTIME || 'true',
  ENABLE_CACHING: process.env.ENABLE_CACHING || 'true',
  ANTHROPIC_RATE_LIMIT_RPM: process.env.ANTHROPIC_RATE_LIMIT_RPM || '50',
  ANTHROPIC_RATE_LIMIT_TPM: process.env.ANTHROPIC_RATE_LIMIT_TPM || '100000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Set environment variables if they don't exist
Object.entries(developmentEnv).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

module.exports = developmentEnv;
