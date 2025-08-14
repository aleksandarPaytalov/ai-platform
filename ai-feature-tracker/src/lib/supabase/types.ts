import type { Database } from '@/types/database.types';
import type { PostgrestError } from '@supabase/supabase-js';

// Re-export generated Database types for convenience in this module namespace
export type { Database };

// Common result wrappers
export type SupabaseResult<T> = {
	data: T | null;
	error: PostgrestError | null;
};

export type SupabaseListResult<T> = {
	data: T[] | null;
	error: PostgrestError | null;
};

// Error typing used across services
export interface ServiceError {
	code: string;
	message: string;
	details?: unknown;
	hint?: string;
}


