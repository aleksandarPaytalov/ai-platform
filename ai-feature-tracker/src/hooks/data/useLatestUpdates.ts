import { useEffect, useState, useCallback } from 'react';
import { updatesService } from '@/lib/supabase/services/updatesService';
import type { RecentFeatureUpdate } from '@/types/database.types';

export function useLatestUpdates(limit: number = 10) {
	const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		const { data, error } = await updatesService.getLatestUpdates(limit);
		if (error) setError(error.message);
		setUpdates(data || []);
		setIsLoading(false);
	}, [limit]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { updates, isLoading, error, refetch: fetchData };
}


