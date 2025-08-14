import { supabase, supabaseAdmin } from '@/lib/supabase/client';
import { SELECTS, SORTING } from '@/lib/supabase/constants/queries';
import { TABLES, VIEWS } from '@/lib/supabase/constants/tables';
import { sanitizeSearchQuery } from '@/lib/supabase/utils/validators';
import { getFromCache, setInCache, invalidateCache } from '@/lib/supabase/utils/cache';
import { withRetry } from '@/lib/supabase/utils/retry';
import { DEFAULTS } from '@/lib/supabase/constants/defaults';
import { getRateLimiter } from '@/lib/supabase/utils/rateLimiter';
import { normalizeSupabaseError } from '@/lib/supabase/utils/errorHandler';
import { isOffline } from '@/lib/supabase/utils/cache';
import { queueWrite, offlineQueuedError } from '@/lib/supabase/utils/offline';
// offline fallback handled via cache short-circuit above
import type { 
  AITool, 
  AIToolInsert,
  AIToolUpdate,
  ToolCategory, 
  ToolWithLatestUpdate,
  SupabaseResponse,
  SupabaseArrayResponse 
} from '@/types/database.types';

/**
 * Tools Service Layer
 * This provides a clean API similar to C# service classes for tool operations
 * Think of this as your ToolRepository pattern from .NET development
 */
export const toolsService = {
  
  /**
   * Get all active tools
   * Similar to: context.Tools.Where(t => t.IsActive).OrderBy(t => t.Name).ToListAsync()
   */
  async getAllTools(): Promise<SupabaseArrayResponse<AITool & { category: ToolCategory | null }>> {
    try {
      const cacheKey = 'tools:all-with-category';
      const cached = getFromCache<(AITool & { category: ToolCategory | null })[]>(cacheKey);
      if (cached) return { data: cached, error: null } as SupabaseArrayResponse<AITool & { category: ToolCategory | null }>;

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools').execute(async () =>
          await supabase
            .from(TABLES.ai_tools)
            .select(SELECTS.toolsWithCategory)
            .order(SORTING.toolsByName.column, { ascending: SORTING.toolsByName.ascending })
        )
      );

      if (!error && data) setInCache(cacheKey, data as any, DEFAULTS.cache.toolsTtlMs);
      
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tools: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tool by slug (for URL routing)
   * Similar to: context.Tools.FirstOrDefaultAsync(t => t.Slug == slug && t.IsActive)
   */
  async getToolBySlug(slug: string): Promise<SupabaseResponse<AITool>> {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tool by slug '${slug}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tool by ID
   * Similar to: context.Tools.FindAsync(id)
   */
  async getToolById(id: string): Promise<SupabaseResponse<AITool>> {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tool by ID '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tools by category
   * Similar to: context.Tools.Where(t => t.CategoryId == categoryId && t.IsActive).OrderBy(t => t.Name).ToListAsync()
   */
  async getToolsByCategory(categoryId: string): Promise<SupabaseArrayResponse<AITool>> {
    try {
      const cacheKey = `tools:category:${categoryId}`;
      const cached = getFromCache<AITool[]>(cacheKey);
      if (cached) return { data: cached, error: null } as SupabaseArrayResponse<AITool>;

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools').execute(async () =>
          await supabase
            .from(TABLES.ai_tools)
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order(SORTING.toolsByName.column, { ascending: SORTING.toolsByName.ascending })
        )
      );

      if (!error && data) setInCache(cacheKey, data, DEFAULTS.cache.toolsTtlMs);
      
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tools for category '${categoryId}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tools with their latest updates (using database view)
   * Similar to: complex LINQ query with joins and subqueries
   */
  async getToolsWithLatestUpdates(): Promise<SupabaseArrayResponse<ToolWithLatestUpdate>> {
    try {
      const cacheKey = 'tools:with-latest-updates';
      const cached = getFromCache<ToolWithLatestUpdate[]>(cacheKey);
      if (cached) return { data: cached, error: null } as SupabaseArrayResponse<ToolWithLatestUpdate>;

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('tools_with_latest_updates').execute(async () =>
          await supabase
            .from(VIEWS.tools_with_latest_updates)
            .select(SELECTS.toolsWithLatestUpdatesView)
            .order('latest_update_date', { ascending: false, nullsFirst: false })
        )
      );

      if (!error && data) setInCache(cacheKey, data, DEFAULTS.cache.toolsWithUpdatesTtlMs);
      
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tools with latest updates: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tools with category information (with join)
   * Similar to: context.Tools.Include(t => t.Category).Where(t => t.IsActive).ToListAsync()
   */
  async getToolsWithCategories(): Promise<SupabaseArrayResponse<AITool & { category: ToolCategory | null }>> {
    try {
      const cacheKey = 'tools:with-category';
      const cached = getFromCache<(AITool & { category: ToolCategory | null })[]>(cacheKey);
      if (cached) return { data: cached, error: null } as SupabaseArrayResponse<AITool & { category: ToolCategory | null }>;

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools').execute(async () =>
          await supabase
            .from(TABLES.ai_tools)
            .select(SELECTS.toolsWithCategory)
            .eq('is_active', true)
            .order(SORTING.toolsByName.column, { ascending: SORTING.toolsByName.ascending })
        )
      );

      if (!error && data) setInCache(cacheKey, data as any, DEFAULTS.cache.toolsTtlMs);
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch tools with categories: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Search tools by name or description
   * Similar to: context.Tools.Where(t => t.Name.Contains(term) || t.Description.Contains(term)).ToListAsync()
   */
  async searchTools(searchTerm: string): Promise<SupabaseArrayResponse<AITool>> {
    try {
      const term = sanitizeSearchQuery(searchTerm);
      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools').execute(async () =>
          await supabase
            .from(TABLES.ai_tools)
            .select('*')
            .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
            .eq('is_active', true)
            .order(SORTING.toolsByName.column, { ascending: SORTING.toolsByName.ascending })
        )
      );
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to search tools with term '${searchTerm}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /** Return only active/enabled tools */
  async getActiveTools(): Promise<SupabaseArrayResponse<AITool>> {
    return this.getAllTools();
  },

  /**
   * Admin: Create new tool
   * Similar to: context.Tools.Add(newTool); await context.SaveChangesAsync()
   * Note: Uses admin client for elevated privileges
   */
  async createTool(tool: AIToolInsert): Promise<SupabaseResponse<AITool>> {
    try {
      // Validate required fields
      if (!tool.name || !tool.slug) {
        return {
          data: null,
          error: {
            message: 'Name and slug are required fields',
            details: 'Validation failed',
            hint: 'Please provide both name and slug',
            code: '400'
          } as any
        };
      }

      if (isOffline()) {
        queueWrite('createTool', async () => {
          await supabaseAdmin.from('ai_tools').insert(tool);
          invalidateCache('tools:');
        });
        return { data: null, error: offlineQueuedError('Change queued while offline') as any };
      }

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools_admin').execute(async () =>
          await supabaseAdmin
            .from('ai_tools')
            .insert(tool)
            .select()
            .single()
        )
      );
      
      if (!error) invalidateCache('tools:');
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to create tool: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Update tool
   * Similar to: var tool = await context.Tools.FindAsync(id); update properties; await context.SaveChangesAsync()
   */
  async updateTool(id: string, updates: AIToolUpdate): Promise<SupabaseResponse<AITool>> {
    try {
      if (isOffline()) {
        queueWrite('updateTool', async () => {
          await supabaseAdmin
            .from('ai_tools')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);
          invalidateCache('tools:');
        });
        return { data: null, error: offlineQueuedError('Change queued while offline') as any };
      }

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools_admin').execute(async () =>
          await supabaseAdmin
            .from('ai_tools')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()
        )
      );
      
      if (!error) invalidateCache('tools:');
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to update tool '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Soft delete tool (set is_active to false)
   * Similar to: var tool = await context.Tools.FindAsync(id); tool.IsActive = false; await context.SaveChangesAsync()
   */
  async deactivateTool(id: string): Promise<SupabaseResponse<AITool>> {
    try {
      if (isOffline()) {
        queueWrite('deactivateTool', async () => {
          await supabaseAdmin
            .from('ai_tools')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id);
          invalidateCache('tools:');
        });
        return { data: null, error: offlineQueuedError('Change queued while offline') as any };
      }

      const { data, error } = await withRetry(async () =>
        await getRateLimiter('ai_tools_admin').execute(async () =>
          await supabaseAdmin
            .from('ai_tools')
            .update({ 
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()
        )
      );
      
      if (!error) invalidateCache('tools:');
      return { data, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to deactivate tool '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Permanently delete tool
   * Similar to: context.Tools.Remove(tool); await context.SaveChangesAsync()
   * Note: Use with caution - this is permanent
   */
  async deleteTool(id: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await withRetry(async () =>
        await getRateLimiter('ai_tools_admin').execute(async () =>
          await supabaseAdmin
            .from('ai_tools')
            .delete()
            .eq('id', id)
        )
      );
      
      if (!error) invalidateCache('tools:');
      return { data: null, error: normalizeSupabaseError(error) as any };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to delete tool '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Check if slug is available for new tools
   * Similar to: context.Tools.AnyAsync(t => t.Slug == slug)
   */
  async isSlugAvailable(slug: string, excludeId?: string): Promise<SupabaseResponse<boolean>> {
    try {
      let query = supabase
        .from('ai_tools')
        .select('id')
        .eq('slug', slug);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query.limit(1);
      
      if (error) {
        return { data: null, error };
      }

      return { data: data.length === 0, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to check slug availability '${slug}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get tool count by category for dashboard statistics
   * Similar to: context.Tools.GroupBy(t => t.CategoryId).Select(g => new { CategoryId = g.Key, Count = g.Count() }).ToListAsync()
   */
  async getToolCountByCategory(): Promise<SupabaseArrayResponse<{ category_id: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('category_id')
        .eq('is_active', true);

      if (error) {
        return { data: null, error };
      }

      // Group by category and count (JavaScript equivalent of LINQ GroupBy)
      const grouped = data.reduce((acc: Record<string, number>, tool) => {
        const categoryId = tool.category_id || 'uncategorized';
        acc[categoryId] = (acc[categoryId] || 0) + 1;
        return acc;
      }, {});

      const result = Object.entries(grouped).map(([category_id, count]) => ({
        category_id,
        count
      }));

      return { data: result, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to get tool count by category: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  }
};