# Environment Configuration

## Overview

The AI Feature Tracker uses a comprehensive environment configuration system with type-safe validation and multi-environment support.

## Required Environment Variables

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations (server-side only)

### Anthropic API Configuration

- `ANTHROPIC_API_KEY`: Your Anthropic API key for AI features
- `ANTHROPIC_RATE_LIMIT_RPM`: Requests per minute limit (default: 50)
- `ANTHROPIC_RATE_LIMIT_TPM`: Tokens per minute limit (default: 100,000)

### Application Configuration

- `NODE_ENV`: Node environment (development, staging, production)
- `NEXT_PUBLIC_APP_ENV`: Application environment for client-side
- `NEXT_PUBLIC_APP_URL`: Public URL of your application

## Setup Instructions

1. Copy `.env.local.example` to `.env.local`
2. Fill in your actual API keys and URLs
3. Verify configuration with `npm run dev`

## Environment Validation

The application validates all environment variables at startup and provides detailed error messages for missing or invalid configurations.

## Environment Files

- `.env.local.example` - Development environment template
- `.env.staging.example` - Staging environment template
- `.env.production.example` - Production environment template

## Configuration Structure

The environment configuration is organized into several modules:

- `src/lib/config/env.ts` - Main environment schema and validation
- `src/lib/config/database.ts` - Supabase-specific configuration
- `src/lib/config/api.ts` - API and application configuration
- `src/lib/config/validation.ts` - Environment validation utilities
- `src/lib/config/index.ts` - Central export point

## Feature Flags

The following feature flags are available:

- `ENABLE_AI_VALIDATION`: Enable/disable AI-powered content validation
- `ENABLE_REALTIME`: Enable/disable real-time features
- `ENABLE_CACHING`: Enable/disable caching mechanisms

## Anthropic API Rate Limits

Configure rate limits based on your Anthropic tier:

- **Tier 1**: RPM=5, TPM=10,000
- **Tier 2**: RPM=50, TPM=100,000
- **Tier 3**: RPM=100, TPM=200,000

## Security Notes

- Never commit actual environment files (`.env.local`, `.env.staging`, `.env.production`)
- Use different API keys for different environments
- Store production secrets securely in your deployment platform
- Validate all environment variables at application startup
