export function ensureNonEmptyString(value: string, fieldName: string) {
	if (!value || value.trim().length === 0) {
		throw new Error(`${fieldName} is required`);
	}
}

export function sanitizeSearchQuery(query: string): string {
	return query.replace(/[%_]/g, '');
}

export function clampLimit(limit: number, min = 1, max = 100): number {
	if (Number.isNaN(limit)) return min;
	return Math.max(min, Math.min(limit, max));
}


