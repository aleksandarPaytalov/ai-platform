import { useEffect, useState, useCallback } from 'react';
import { toolsService } from '@/lib/supabase/services/toolsService';
import { updatesService } from '@/lib/supabase/services/updatesService';
import type { AITool, RecentFeatureUpdate } from '@/types/database.types';
import { DEFAULTS } from '@/lib/supabase/constants/defaults';

type SearchType = 'tools' | 'updates';

export function useSearch(query: string | null, type: SearchType, debounceMs: number = DEFAULTS.search.debounceMs) {
	const [tools, setTools] = useState<AITool[]>([]);
	const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const search = useCallback(async (q: string) => {
		setIsLoading(true);
		setError(null);
		if (type === 'tools') {
			const { data, error } = await toolsService.searchTools(q);
			if (error) setError(error.message);
			setTools(data || []);
			setUpdates([]);
		} else {
			const { data, error } = await updatesService.searchUpdates(q);
			if (error) setError(error.message);
			setUpdates(data || []);
			setTools([]);
		}
		setIsLoading(false);
	}, [type]);

	useEffect(() => {
		if (!query || query.trim().length < DEFAULTS.search.minLength) {
			setTools([]);
			setUpdates([]);
			setIsLoading(false);
			setError(null);
			return;
		}
		const timeout = setTimeout(() => search(query.trim()), debounceMs);
		return () => clearTimeout(timeout);
	}, [query, debounceMs, search]);

	return { tools, updates, isLoading, error, refetch: () => query && search(query.trim()) };
}


