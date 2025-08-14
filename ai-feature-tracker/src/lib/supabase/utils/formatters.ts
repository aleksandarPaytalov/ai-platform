export function toIsoDateString(date: Date): string {
	return date.toISOString();
}

export function normalizeText(input: string): string {
	return input.normalize('NFKC').trim();
}

// Data transformers for API/UI consumption
export function pickToolCardFields<T extends { id: string; name: string; slug: string; logo_url: string | null }>(tool: T) {
	return {
		id: tool.id,
		name: tool.name,
		slug: tool.slug,
		logo_url: tool.logo_url
	};
}

export function serializeError(err: unknown): { name: string; message: string; stack?: string } {
	if (err instanceof Error) {
		const out: { name: string; message: string; stack?: string } = {
			name: err.name,
			message: err.message,
		};
		if (typeof err.stack === 'string') out.stack = err.stack;
		return out;
	}
	return { name: 'UnknownError', message: String(err) };
}


