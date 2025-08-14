import type { PostgrestError } from '@supabase/supabase-js';

export class ValidationServiceError extends Error {
	code = '400';
	details?: unknown;

	constructor(message: string, details?: unknown) {
		super(message);
		this.name = 'ValidationServiceError';
		this.details = details;
	}
}

export class NetworkServiceError extends Error {
	code = 'NETWORK';
	details?: unknown;

	constructor(message: string, details?: unknown) {
		super(message);
		this.name = 'NetworkServiceError';
		this.details = details;
	}
}

export class UnknownServiceError extends Error {
	code = '500';
	details?: unknown;

	constructor(message: string, details?: unknown) {
		super(message);
		this.name = 'UnknownServiceError';
		this.details = details;
	}
}

export function toServiceError(error: PostgrestError | null | unknown): Error | null {
	if (!error) return null;
	if (typeof window !== 'undefined' && !navigator.onLine) {
		return new NetworkServiceError('You appear to be offline.');
	}
	if ((error as PostgrestError)?.code) {
		const pg = error as PostgrestError;
		return new UnknownServiceError(pg.message, pg.details);
	}
	if (error instanceof Error) return error;
	return new UnknownServiceError('Unknown error', error);
}

// Normalize Supabase PostgrestError into a typed object that UI can reason about
export function normalizeSupabaseError(error: PostgrestError | null) {
  if (!error) return null;
  const code = error.code || '';
  // Authentication/authorization related codes
  if (code === '42501' || error.message.toLowerCase().includes('permission denied') || error.message.toLowerCase().includes('jwt')) {
    return {
      ...error,
      code: 'AUTH',
      message: 'Authentication required or insufficient permissions',
      hint: error.hint || 'Please sign in and ensure you have access rights.'
    } as PostgrestError;
  }
  return error;
}


