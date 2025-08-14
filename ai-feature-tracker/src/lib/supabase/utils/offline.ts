import { isOffline } from './cache';
import { withRetry } from './retry';

type QueuedTask = {
  id: string;
  name: string;
  execute: () => Promise<unknown>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

const writeQueue: QueuedTask[] = [];
let processing = false;

export const OFFLINE_QUEUED_CODE = 'OFFLINE_QUEUED';

export function getOfflineQueueLength(): number {
  return writeQueue.length;
}

export function queueWrite(
  name: string,
  execute: () => Promise<unknown>,
  options?: { onSuccess?: () => void; onError?: (error: unknown) => void }
): { queued: boolean } {
  const task: QueuedTask = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    execute,
  };
  if (options?.onSuccess) task.onSuccess = options.onSuccess;
  if (options?.onError) task.onError = options.onError;
  writeQueue.push(task);
  processQueueIfOnline();
  return { queued: true };
}

export function offlineQueuedError(message: string) {
  return {
    message,
    details: null,
    hint: 'We will automatically retry when your connection is restored.',
    code: OFFLINE_QUEUED_CODE,
  } as const;
}

async function processQueue() {
  if (processing) return;
  processing = true;
  try {
    while (writeQueue.length > 0 && !isOffline()) {
      const task = writeQueue[0]!;
      try {
        await withRetry(async () => {
          await task.execute();
          return true as const;
        });
        task.onSuccess?.();
        writeQueue.shift();
      } catch (error) {
        task.onError?.(error);
        // Stop processing if network is still unstable; will retry on next online
        break;
      }
    }
  } finally {
    processing = false;
  }
}

export function processQueueIfOnline() {
  if (!isOffline()) {
    void processQueue();
  }
}

// Handle browser online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processQueueIfOnline();
  });
}

export async function withOfflineFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  if (isOffline()) {
    return fallback();
  }
  try {
    return await operation();
  } catch (e) {
    if (isOffline()) {
      return fallback();
    }
    throw e;
  }
}

