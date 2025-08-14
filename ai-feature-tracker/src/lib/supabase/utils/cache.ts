type CacheKey = string;

interface CacheItem<T> {
	value: T;
	expiresAt: number;
}

const memoryCache = new Map<CacheKey, CacheItem<unknown>>();

type Listener = (key: string) => void;
const listeners = new Set<Listener>();

export function getFromCache<T>(key: CacheKey): T | null {
	const item = memoryCache.get(key);
	if (!item) return null;
	if (Date.now() > item.expiresAt) {
		memoryCache.delete(key);
		return null;
	}
	return item.value as T;
}

export function setInCache<T>(key: CacheKey, value: T, ttlMs: number) {
	memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
    // notify listeners for specific key
    listeners.forEach(l => l(key));
}

export function invalidateCache(keyPrefix?: string) {
	if (!keyPrefix) {
		memoryCache.clear();
        listeners.forEach(l => l('*'));
		return;
	}
	for (const key of memoryCache.keys()) {
		if (key.startsWith(keyPrefix)) memoryCache.delete(key);
	}
    listeners.forEach(l => l(keyPrefix));
}

export function subscribeCache(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function isOffline(): boolean {
    try {
        return typeof navigator !== 'undefined' && navigator.onLine === false;
    } catch {
        return false;
    }
}



