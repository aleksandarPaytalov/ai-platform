import { useEffect, useState, useCallback } from 'react';
import { toolsService } from '@/lib/supabase/services/toolsService';
import type { AITool } from '@/types/database.types';

export function useTools() {
	const [tools, setTools] = useState<AITool[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		const { data, error } = await toolsService.getActiveTools();
		if (error) setError(error.message);
		setTools(data || []);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { tools, isLoading, error, refetch: fetchData };
}


