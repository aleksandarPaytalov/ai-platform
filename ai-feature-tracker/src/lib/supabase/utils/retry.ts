export async function withRetry<T>(
    operation: () => Promise<T>,
    retries = 2,
    baseDelayMs = 300,
    timeoutMs = 5000
): Promise<T> {
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const result = await withTimeout(operation(), timeoutMs);
            // If the result has a PostgREST-like error, decide whether to retry
            if (isRetriableResult(result)) {
                throw (result as any).error;
            }
            return result;
        } catch (error: unknown) {
            attempt++;
            if (attempt > retries) throw error as Error;
            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutHandle: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('Operation timed out')), ms);
    });
    try {
        // Race operation with timeout
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeoutHandle);
    }
}

function isRetriableResult(result: unknown): boolean {
    const maybe = result as any;
    const err = maybe?.error;
    if (!err) return false;
    const code = err.code || err.status || '';
    // Retry on 429 (rate limit) and generic network/server codes
    return code === '429' || code === 429 || code === '08006' || code === '08000';
}


