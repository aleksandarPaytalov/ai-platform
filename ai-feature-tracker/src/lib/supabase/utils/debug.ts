import type { PostgrestError } from '@supabase/supabase-js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context || {}),
  };
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'debug' : level](entry);
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  log('debug', message, context);
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  log('info', message, context);
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  log('warn', message, context);
}

export function logError(message: string, error?: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { error };
  log('error', message, { ...context, ...err });
}

export function formatPostgrestError(error: PostgrestError | null) {
  if (!error) return null;
  return {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  };
}

export async function timeAsync<T>(_label: string, fn: () => Promise<T>): Promise<{ ms: number; result: T }> {
  const start = performance.now();
  try {
    const result = await fn();
    return { ms: performance.now() - start, result };
  } catch (error) {
    throw error;
  }
}


