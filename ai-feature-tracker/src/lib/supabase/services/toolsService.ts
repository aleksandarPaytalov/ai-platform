import { supabase, supabaseAdmin } from '@/lib/supabase/client';
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
  async getAllTools(): Promise<SupabaseArrayResponse<AITool>> {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      return { data, error };
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
      
      return { data, error };
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
      
      return { data, error };
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
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name');
      
      return { data, error };
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
      const { data, error } = await supabase
        .from('tools_with_latest_updates')
        .select('*')
        .order('latest_update_date', { ascending: false, nullsFirst: false });
      
      return { data, error };
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
      const { data, error } = await supabase
        .from('ai_tools')
        .select(`
          *,
          category:tool_categories(*)
        `)
        .eq('is_active', true)
        .order('name');
      
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
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .order('name');
      
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

      const { data, error } = await supabaseAdmin
        .from('ai_tools')
        .insert(tool)
        .select()
        .single();
      
      return { data, error };
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
      const { data, error } = await supabaseAdmin
        .from('ai_tools')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
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
      const { data, error } = await supabaseAdmin
        .from('ai_tools')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
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
      const { error } = await supabaseAdmin
        .from('ai_tools')
        .delete()
        .eq('id', id);
      
      return { data: null, error };
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