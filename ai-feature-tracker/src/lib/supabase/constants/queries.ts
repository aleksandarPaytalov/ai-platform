export const QUERY_LIMITS = {
	default: 20,
	latestUpdates: 10,
	toolUpdates: 5,
	max: 100
} as const;

export const SORTING = {
	toolsByName: { column: 'name', ascending: true } as const,
	updatesByPublishedDesc: { column: 'published_date', ascending: false } as const,
	categoriesBySortOrder: { column: 'sort_order', ascending: true } as const
} as const;

export const SELECTS = {
	toolsWithCategory: `*, category:tool_categories(*)`,
	toolsWithLatestUpdatesView: `*`,
	recentFeatureUpdatesView: `*`
} as const;


