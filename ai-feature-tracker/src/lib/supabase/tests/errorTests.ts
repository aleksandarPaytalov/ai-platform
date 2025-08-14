import { normalizeSupabaseError } from '@/lib/supabase/utils/errorHandler';

export function runErrorTests() {
  const authLike = normalizeSupabaseError({
    message: 'permission denied for table ai_tools',
    details: null,
    hint: null,
    code: '42501',
  } as any);

  if (!authLike || (authLike as any).code !== 'AUTH') {
    throw new Error('Expected AUTH normalization for permission errors');
  }
}


