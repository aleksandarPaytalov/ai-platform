import { useState, useEffect, useCallback } from 'react';
import { updatesService } from '@/lib/supabase/services/updatesService';
import type { FeatureUpdate, RecentFeatureUpdate, ImpactLevel, ValidationStatus } from '@/types/database.types';

/**
 * Hook for fetching latest feature updates
 * Similar to getting recent records in C# with OrderByDescending and Take
 * This is the main feed for the dashboard showing what's new across all tools
 */
export function useLatestUpdates(limit: number = 10) {
  const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getLatestUpdates(limit);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching latest updates:', fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const refetch = useCallback(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length 
  };
}

/**
 * Hook for fetching updates for a specific tool
 * Similar to filtering by foreign key in Entity Framework
 * Used on tool detail pages to show recent changes
 */
export function useUpdatesByTool(toolId: string | null, limit: number = 5) {
  const [updates, setUpdates] = useState<FeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdatesByTool(id, limit);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching updates for tool '${id}':`, fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, [limit]);

  useEffect(() => {
    if (toolId) {
      fetchUpdates(toolId);
    } else {
      setUpdates([]);
      setIsLoading(false);
      setError(null);
    }
  }, [toolId, fetchUpdates]);

  const refetch = useCallback(() => {
    if (toolId) {
      fetchUpdates(toolId);
    }
  }, [toolId, fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length 
  };
}

/**
 * Hook for fetching updates by impact level
 * Similar to filtering by enum values in C# LINQ
 * Useful for showing high-impact changes or filtering by significance
 */
export function useUpdatesByImpact(impactLevel: ImpactLevel | null) {
  const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async (impact: ImpactLevel) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdatesByImpact(impact);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching updates by impact '${impact}':`, fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (impactLevel) {
      fetchUpdates(impactLevel);
    } else {
      setUpdates([]);
      setIsLoading(false);
      setError(null);
    }
  }, [impactLevel, fetchUpdates]);

  const refetch = useCallback(() => {
    if (impactLevel) {
      fetchUpdates(impactLevel);
    }
  }, [impactLevel, fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length 
  };
}

/**
 * Hook for searching updates
 * Similar to implementing full-text search in C# with LINQ Contains
 * Includes debouncing to avoid excessive API calls
 */
export function useUpdateSearch(searchTerm: string | null, debounceMs: number = 300) {
  const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async (term: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.searchUpdates(term);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error searching updates with term '${term}':`, fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, []);

  // Debounce search to avoid excessive API calls (similar to implementing debouncing in C# with CancellationToken)
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setUpdates([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchUpdates(searchTerm.trim());
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debounceMs, fetchUpdates]);

  const refetch = useCallback(() => {
    if (searchTerm && searchTerm.trim().length >= 2) {
      fetchUpdates(searchTerm.trim());
    }
  }, [searchTerm, fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length,
    hasSearchTerm: Boolean(searchTerm && searchTerm.trim().length >= 2)
  };
}

/**
 * Hook for fetching a single update by ID
 * Similar to DbContext.FindAsync(id) in Entity Framework
 * Used for update detail views and modals
 */
export function useUpdateById(id: string | null) {
  const [update, setUpdate] = useState<RecentFeatureUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdate = useCallback(async (updateId: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdateById(updateId);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching update by ID '${updateId}':`, fetchError);
    } else {
      setUpdate(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      fetchUpdate(id);
    } else {
      setUpdate(null);
      setIsLoading(false);
      setError(null);
    }
  }, [id, fetchUpdate]);

  const refetch = useCallback(() => {
    if (id) {
      fetchUpdate(id);
    }
  }, [id, fetchUpdate]);

  return { 
    update, 
    isLoading, 
    error, 
    refetch,
    exists: update !== null 
  };
}

/**
 * Hook for fetching updates with pagination
 * Similar to implementing pagination in C# with Skip and Take
 * Essential for performance with large datasets
 */
export function useUpdatesPaginated(page: number = 0, limit: number = 20) {
  const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const offset = page * limit;

  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdatesPaginated(offset, limit);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching paginated updates (page ${page}):`, fetchError);
    } else {
      setUpdates(data || []);
      setHasMore((data || []).length === limit); // If we got fewer than limit, we're at the end
    }
    
    setIsLoading(false);
  }, [offset, limit, page]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const refetch = useCallback(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    hasMore,
    currentPage: page,
    count: updates.length 
  };
}

/**
 * Hook for fetching updates by date range
 * Similar to date filtering in C# LINQ with DateTime comparisons
 * Useful for historical analysis and reporting
 */
export function useUpdatesByDateRange(startDate: string | null, endDate: string | null) {
  const [updates, setUpdates] = useState<RecentFeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async (start: string, end: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdatesByDateRange(start, end);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching updates for date range ${start} to ${end}:`, fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchUpdates(startDate, endDate);
    } else {
      setUpdates([]);
      setIsLoading(false);
      setError(null);
    }
  }, [startDate, endDate, fetchUpdates]);

  const refetch = useCallback(() => {
    if (startDate && endDate) {
      fetchUpdates(startDate, endDate);
    }
  }, [startDate, endDate, fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length,
    hasDateRange: Boolean(startDate && endDate)
  };
}

/**
 * Hook for fetching update statistics
 * Similar to dashboard analytics queries you'd run in C# for reporting
 * Provides aggregate data for admin dashboards
 */
export function useUpdateStatistics() {
  const [statistics, setStatistics] = useState<{
    total_updates: number;
    validated_updates: number;
    pending_updates: number;
    requires_review_updates: number;
    recent_updates_count: number;
    high_impact_updates: number;
    average_confidence_score: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdateStatistics();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching update statistics:', fetchError);
    } else {
      setStatistics(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const refetch = useCallback(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { 
    statistics, 
    isLoading, 
    error, 
    refetch
  };
}

/**
 * Hook for fetching trending tools based on update activity
 * Similar to implementing trending algorithms in C# with GroupBy and OrderBy
 * Shows which tools are most active recently
 */
export function useTrendingTools(days: number = 7, limit: number = 10) {
  const [trendingTools, setTrendingTools] = useState<{
    tool_id: string;
    tool_name: string;
    tool_slug: string;
    update_count: number;
    latest_update_date: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getTrendingTools(days, limit);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching trending tools (${days} days):`, fetchError);
    } else {
      setTrendingTools(data || []);
    }
    
    setIsLoading(false);
  }, [days, limit]);

  useEffect(() => {
    fetchTrendingTools();
  }, [fetchTrendingTools]);

  const refetch = useCallback(() => {
    fetchTrendingTools();
  }, [fetchTrendingTools]);

  return { 
    trendingTools, 
    isLoading, 
    error, 
    refetch,
    count: trendingTools.length,
    period: days 
  };
}

/**
 * Hook for admin operations - fetching updates by validation status
 * Similar to admin queries in C# for content moderation workflows
 * Used in admin interfaces for managing content approval
 */
export function useUpdatesByValidationStatus(status: ValidationStatus | null) {
  const [updates, setUpdates] = useState<FeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async (validationStatus: ValidationStatus) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getUpdatesByValidationStatus(validationStatus);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching updates by validation status '${validationStatus}':`, fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (status) {
      fetchUpdates(status);
    } else {
      setUpdates([]);
      setIsLoading(false);
      setError(null);
    }
  }, [status, fetchUpdates]);

  const refetch = useCallback(() => {
    if (status) {
      fetchUpdates(status);
    }
  }, [status, fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length 
  };
}

/**
 * Hook for admin operations - fetching pending updates for AI analysis
 * Similar to queue processing patterns in C# background services
 * Used by AI processing workflows to get unprocessed content
 */
export function usePendingUpdates(limit: number = 50) {
  const [updates, setUpdates] = useState<FeatureUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await updatesService.getPendingUpdates(limit);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching pending updates:', fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setIsLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const refetch = useCallback(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return { 
    updates, 
    isLoading, 
    error, 
    refetch,
    count: updates.length 
  };
}