import { useState, useEffect, useCallback } from 'react';
import { categoriesService } from '@/lib/supabase/services/categoriesService';
import type { ToolCategory } from '@/types/database.types';

/**
 * Hook for fetching all categories
 * Similar to using a service in C# with async/await patterns for reference data
 * Categories are typically loaded once and cached, like lookup tables in enterprise apps
 */
export function useCategories() {
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesService.getAllCategories();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching categories:', fetchError);
    } else {
      setCategories(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(cat => cat.id === id) || null;
  }, [categories]);

  const getCategoryByName = useCallback((name: string) => {
    return categories.find(cat => cat.name === name) || null;
  }, [categories]);

  return { 
    categories, 
    isLoading, 
    error, 
    refetch,
    getCategoryById,
    getCategoryByName,
    count: categories.length 
  };
}

/**
 * Hook for fetching a single category by ID
 * Similar to DbContext.FindAsync(id) in Entity Framework
 */
export function useCategoryById(id: string | null) {
  const [category, setCategory] = useState<ToolCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async (categoryId: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesService.getCategoryById(categoryId);
    
    if (fetchError) {
      setError(fetchError.message);
      console.error(`Error fetching category by ID '${categoryId}':`, fetchError);
    } else {
      setCategory(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCategory(id);
    } else {
      setCategory(null);
      setIsLoading(false);
      setError(null);
    }
  }, [id, fetchCategory]);

  const refetch = useCallback(() => {
    if (id) {
      fetchCategory(id);
    }
  }, [id, fetchCategory]);

  return { 
    category, 
    isLoading, 
    error, 
    refetch,
    exists: category !== null 
  };
}

/**
 * Hook for fetching categories with tool counts
 * Similar to using aggregate functions and joins in C# LINQ queries
 * Useful for dashboard statistics and navigation with counts
 */
export function useCategoriesWithToolCount() {
  const [categories, setCategories] = useState<(ToolCategory & { tool_count: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesService.getCategoriesWithToolCount();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching categories with tool count:', fetchError);
    } else {
      setCategories(data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getTotalToolCount = useCallback(() => {
    return categories.reduce((total, cat) => total + cat.tool_count, 0);
  }, [categories]);

  const getCategoriesWithTools = useCallback(() => {
    return categories.filter(cat => cat.tool_count > 0);
  }, [categories]);

  const getEmptyCategories = useCallback(() => {
    return categories.filter(cat => cat.tool_count === 0);
  }, [categories]);

  return { 
    categories, 
    isLoading, 
    error, 
    refetch,
    getTotalToolCount,
    getCategoriesWithTools,
    getEmptyCategories,
    count: categories.length 
  };
}

/**
 * Hook for category statistics
 * Similar to dashboard analytics queries you'd run in C# for reporting
 */
export function useCategoryStatistics() {
  const [statistics, setStatistics] = useState<{
    total_categories: number;
    categories_with_tools: number;
    average_tools_per_category: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesService.getCategoryStatistics();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching category statistics:', fetchError);
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
 * Hook for category name availability checking
 * Similar to validation logic you'd implement in C# before saving entities
 * Useful for forms and admin interfaces
 */
export function useCategoryNameAvailability(name: string | null, excludeId?: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (categoryName: string, excludedId?: string) => {
    setIsChecking(true);
    setError(null);

    const { data, error: checkError } = await categoriesService.isCategoryNameAvailable(categoryName, excludedId);
    
    if (checkError) {
      setError(checkError.message);
      console.error(`Error checking category name availability '${categoryName}':`, checkError);
      setIsAvailable(null);
    } else {
      setIsAvailable(data);
    }
    
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (name && name.trim().length > 0) {
      // Debounce the availability check
      const timeoutId = setTimeout(() => {
        checkAvailability(name.trim(), excludeId);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setIsAvailable(null);
      setIsChecking(false);
      setError(null);
      return undefined;
    }
  }, [name, excludeId, checkAvailability]);

  const recheckAvailability = useCallback(() => {
    if (name && name.trim().length > 0) {
      checkAvailability(name.trim(), excludeId);
    }
  }, [name, excludeId, checkAvailability]);

  return { 
    isAvailable, 
    isChecking, 
    error, 
    recheckAvailability,
    hasValidName: Boolean(name && name.trim().length > 0)
  };
}

/**
 * Hook for getting the next available sort order
 * Similar to auto-increment logic or getting max values in C# before inserting
 */
export function useNextCategorySortOrder() {
  const [nextSortOrder, setNextSortOrder] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNextSortOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesService.getNextSortOrder();
    
    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching next sort order:', fetchError);
    } else {
      setNextSortOrder(data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNextSortOrder();
  }, [fetchNextSortOrder]);

  const refetch = useCallback(() => {
    fetchNextSortOrder();
  }, [fetchNextSortOrder]);

  return { 
    nextSortOrder, 
    isLoading, 
    error, 
    refetch
  };
}