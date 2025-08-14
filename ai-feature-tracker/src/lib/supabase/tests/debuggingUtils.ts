import { logDebug, logError, logInfo, logWarn, formatPostgrestError } from '@/lib/supabase/utils/debug';

export function demoDebugging() {
  logInfo('Starting debugging demo');
  logDebug('Debug details', { example: true });
  logWarn('This is a warning');
  logError('This is an error example', new Error('Example'));
  const formatted = formatPostgrestError({ code: '42501', message: 'permission denied', details: null, hint: null } as any);
  return formatted;
}


