import { env } from './env';

export const apiConfig = {
  anthropic: {
    apiKey: env.ANTHROPIC_API_KEY,
    rateLimits: {
      requestsPerMinute: env.ANTHROPIC_RATE_LIMIT_RPM,
      tokensPerMinute: env.ANTHROPIC_RATE_LIMIT_TPM,
    },
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
    },
  },
  endpoints: {
    messages: 'https://api.anthropic.com/v1/messages',
    models: 'https://api.anthropic.com/v1/models',
  },
  defaultModel: 'claude-3-sonnet-20240229',
} as const;

export const appConfig = {
  name: 'AI Feature Tracker',
  description: 'Track feature updates across 15 popular AI development tools',
  url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: env.NEXT_PUBLIC_APP_ENV,
  version: process.env['npm_package_version'] || '1.0.0',
  features: {
    aiValidation: env.ENABLE_AI_VALIDATION,
    realtime: env.ENABLE_REALTIME,
    caching: env.ENABLE_CACHING,
  },
} as const;
