import { ensureNonEmptyString, sanitizeSearchQuery, clampLimit } from '@/lib/supabase/utils/validators';

export function runValidationTests() {
  // ensureNonEmptyString
  let threw = false;
  try { ensureNonEmptyString('', 'name'); } catch { threw = true; }
  if (!threw) throw new Error('ensureNonEmptyString should throw on empty');

  // sanitizeSearchQuery
  const sanitized = sanitizeSearchQuery('%a_b%c');
  if (sanitized.includes('%') || sanitized.includes('_')) {
    throw new Error('sanitizeSearchQuery should remove % and _');
  }

  // clampLimit
  if (clampLimit(0, 1, 10) !== 1) throw new Error('clampLimit lower bound');
  if (clampLimit(999, 1, 10) !== 10) throw new Error('clampLimit upper bound');
}


