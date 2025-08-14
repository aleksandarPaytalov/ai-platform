import { DEFAULTS } from '@/lib/supabase/constants/defaults';

class SimpleRateLimiter {
    private lastExecution = 0;
    private minIntervalMs: number;
    private queue: Array<() => void> = [];
    private running = false;

    constructor(requestsPerMinute: number) {
        this.minIntervalMs = Math.max(1, Math.floor(60_000 / Math.max(1, requestsPerMinute)));
    }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        await this.waitTurn();
        try {
            return await operation();
        } finally {
            this.lastExecution = Date.now();
        }
    }

    private waitTurn(): Promise<void> {
        return new Promise((resolve) => {
            const tryRun = () => {
                const now = Date.now();
                const delta = now - this.lastExecution;
                if (delta >= this.minIntervalMs) {
                    resolve();
                } else {
                    setTimeout(tryRun, this.minIntervalMs - delta);
                }
            };

            // schedule
            this.queue.push(tryRun);
            if (!this.running) {
                this.running = true;
                const tick = () => {
                    const job = this.queue.shift();
                    if (job) {
                        job();
                        setTimeout(tick, this.minIntervalMs);
                    } else {
                        this.running = false;
                    }
                };
                tick();
            }
        });
    }
}

const limiters = new Map<string, SimpleRateLimiter>();

export function getRateLimiter(key: string): SimpleRateLimiter {
    if (!limiters.has(key)) {
        limiters.set(key, new SimpleRateLimiter(DEFAULTS.rateLimiting.requestsPerMinute));
    }
    return limiters.get(key)!;
}


