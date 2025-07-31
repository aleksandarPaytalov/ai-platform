import { useState, useEffect, useCallback } from 'react';
import { toolsService } from '@/lib/supabase/services/toolsService';
import type { AITool, ToolWithLatestUpdate, ToolCategory } from '@/types/database.types';

/**
 * Hook for fetching all active tools
 * Similar to using a service in C# with async/await patterns
 * Includes loading states and error handling like you'd expect in enterprise applications
 */
export function useTools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getAllTools();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching tools:', fetchError);
    } else {
      setTools(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const refetch = useCallback(() => {
    fetchTools();
  }, [fetchTools]);

  return { 
    tools, 
    isLoading, 
    error, 
    refetch,
    count: tools.length 
  };
}

/**
 * Hook for fetching tools with their latest updates (using database view)
 * This is like using a complex ViewModel in C# MVC - pre-joined data for efficient display
 */
export function useToolsWithLatestUpdates() {
  const [tools, setTools] = useState<ToolWithLatestUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolsWithLatestUpdates();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching tools with latest updates:', fetchError);
    } else {
      setTools(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const refetch = useCallback(() => {
    fetchTools();
  }, [fetchTools]);

  return { 
    tools, 
    isLoading, 
    error, 
    refetch,
    count: tools.length 
  };
}

/**
 * Hook for fetching a single tool by slug (for routing)
 * Similar to finding an entity by key in Entity Framework
 */
export function useToolBySlug(slug: string | null) {
  const [tool, setTool] = useState<AITool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTool = useCallback(async (toolSlug: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolBySlug(toolSlug);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching tool by slug '${toolSlug}':`, fetchError);
    } else {
      setTool(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchTool(slug);
    } else {
      setTool(null);
      setIsLoading(false);
      setError(null);
    }
  }, [slug, fetchTool]);

  const refetch = useCallback(() => {
    if (slug) {
      fetchTool(slug);
    }
  }, [slug, fetchTool]);

  return { 
    tool, 
    isLoading, 
    error, 
    refetch,
    exists: tool !== null 
  };
}

/**
 * Hook for fetching a single tool by ID
 * Similar to DbContext.FindAsync(id) in Entity Framework
 */
export function useToolById(id: string | null) {
  const [tool, setTool] = useState<AITool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTool = useCallback(async (toolId: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolById(toolId);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching tool by ID '${toolId}':`, fetchError);
    } else {
      setTool(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      fetchTool(id);
    } else {
      setTool(null);
      setIsLoading(false);
      setError(null);
    }
  }, [id, fetchTool]);

  const refetch = useCallback(() => {
    if (id) {
      fetchTool(id);
    }
  }, [id, fetchTool]);

  return { 
    tool, 
    isLoading, 
    error, 
    refetch,
    exists: tool !== null 
  };
}

/**
 * Hook for fetching tools by category
 * Similar to filtering a DbSet by foreign key in Entity Framework
 */
export function useToolsByCategory(categoryId: string | null) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async (catId: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolsByCategory(catId);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching tools for category '${catId}':`, fetchError);
    } else {
      setTools(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchTools(categoryId);
    } else {
      setTools([]);
      setIsLoading(false);
      setError(null);
    }
  }, [categoryId, fetchTools]);

  const refetch = useCallback(() => {
    if (categoryId) {
      fetchTools(categoryId);
    }
  }, [categoryId, fetchTools]);

  return { 
    tools, 
    isLoading, 
    error, 
    refetch,
    count: tools.length 
  };
}

/**
 * Hook for fetching tools with category information (joined data)
 * Similar to Include() operations in Entity Framework for related data
 */
export function useToolsWithCategories() {
  const [tools, setTools] = useState<(AITool & { category: ToolCategory | null })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolsWithCategories();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching tools with categories:', fetchError);
    } else {
      setTools(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const refetch = useCallback(() => {
    fetchTools();
  }, [fetchTools]);

  return { 
    tools, 
    isLoading, 
    error, 
    refetch,
    count: tools.length 
  };
}

/**
 * Hook for searching tools
 * Similar to implementing search functionality with LINQ Contains operations
 */
export function useToolSearch(searchTerm: string | null, debounceMs: number = 300) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async (term: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.searchTools(term);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error searching tools with term '${term}':`, fetchError);
    } else {
      setTools(data || []);
    }
    
    setIsLoading(false);
  }, []);

  // Debounce search to avoid excessive API calls (similar to implementing debouncing in C# with CancellationToken)
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setTools([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchTools(searchTerm.trim());
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debounceMs, fetchTools]);

  const refetch = useCallback(() => {
    if (searchTerm && searchTerm.trim().length >= 2) {
      fetchTools(searchTerm.trim());
    }
  }, [searchTerm, fetchTools]);

  return { 
    tools, 
    isLoading, 
    error, 
    refetch,
    count: tools.length,
    hasSearchTerm: Boolean(searchTerm && searchTerm.trim().length >= 2)
  };
}

/**
 * Hook for getting tool count by category (for statistics)
 * Similar to GroupBy operations in LINQ for aggregate data
 */
export function useToolCountByCategory() {
  const [categoryCounts, setCategoryCounts] = useState<{ category_id: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await toolsService.getToolCountByCategory();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching tool count by category:', fetchError);
    } else {
      setCategoryCounts(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const refetch = useCallback(() => {
    fetchCounts();
  }, [fetchCounts]);

  const getCountForCategory = useCallback((categoryId: string) => {
    const found = categoryCounts.find(c => c.category_id === categoryId);
    return found ? found.count : 0;
  }, [categoryCounts]);

  const totalTools = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);

  return { 
    categoryCounts, 
    isLoading, 
    error, 
    refetch,
    getCountForCategory,
    totalTools
  };
}