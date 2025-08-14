export const DEFAULTS = {
	pagination: {
		pageSize: 20,
		maxPageSize: 100
	},
	search: {
		minLength: 2,
		debounceMs: 300
	},
	cache: {
		toolsTtlMs: 60_000,
		toolsWithUpdatesTtlMs: 30_000,
		updatesLatestTtlMs: 15_000,
		categoriesTtlMs: 5 * 60_000
	},
	limits: {
		maxUpdatesPageSize: 100,
		maxToolsPageSize: 100
	},
	rateLimiting: {
		requestsPerMinute: 120,
		burstLimit: 30
	},
	debug: {
		enabled: process.env.NODE_ENV !== 'production'
	}
} as const;

export const DEFAULT_ERROR_MESSAGES = {
	general: 'Something went wrong. Please try again.',
	network: 'Network error. Check your connection and try again.',
	validation: 'Some fields are invalid. Please review your input.'
} as const;


