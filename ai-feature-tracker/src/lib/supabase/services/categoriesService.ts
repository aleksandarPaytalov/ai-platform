import { supabase, supabaseAdmin } from '@/lib/supabase/client';
import type { 
  ToolCategory, 
  ToolCategoryInsert,
  ToolCategoryUpdate,
  SupabaseResponse,
  SupabaseArrayResponse 
} from '@/types/database.types';

/**
 * Categories Service Layer
 * This provides category management operations similar to C# service classes
 * Think of this as your CategoryRepository pattern from .NET development
 */
export const categoriesService = {

  /**
   * Get all categories ordered by sort_order
   * Similar to: context.Categories.OrderBy(c => c.SortOrder).ToListAsync()
   */
  async getAllCategories(): Promise<SupabaseArrayResponse<ToolCategory>> {
    try {
      const { data, error } = await supabase
        .from('tool_categories')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch categories: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get category by ID
   * Similar to: context.Categories.FindAsync(id)
   */
  async getCategoryById(id: string): Promise<SupabaseResponse<ToolCategory>> {
    try {
      const { data, error } = await supabase
        .from('tool_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch category by ID '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get category by name
   * Similar to: context.Categories.FirstOrDefaultAsync(c => c.Name == name)
   */
  async getCategoryByName(name: string): Promise<SupabaseResponse<ToolCategory>> {
    try {
      const { data, error } = await supabase
        .from('tool_categories')
        .select('*')
        .eq('name', name)
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch category by name '${name}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get categories with tool count
   * Similar to: context.Categories.Select(c => new { Category = c, ToolCount = c.Tools.Count(t => t.IsActive) }).ToListAsync()
   */
  async getCategoriesWithToolCount(): Promise<SupabaseArrayResponse<ToolCategory & { tool_count: number }>> {
    try {
      const { data, error } = await supabase
        .from('tool_categories')
        .select(`
          *,
          ai_tools(count)
        `)
        .order('sort_order', { ascending: true, nullsFirst: false });
      
      // Transform the data to have the correct tool_count structure
      const transformedData = data?.map(category => ({
        ...category,
        tool_count: Array.isArray(category.ai_tools) ? category.ai_tools.length : 0
      })) || null;
      
      return { data: transformedData, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch categories with tool count: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Create new category
   * Similar to: context.Categories.Add(newCategory); await context.SaveChangesAsync()
   */
  async createCategory(category: ToolCategoryInsert): Promise<SupabaseResponse<ToolCategory>> {
    try {
      // Validate required fields
      if (!category.name) {
        return {
          data: null,
          error: {
            message: 'Category name is required',
            details: 'Validation failed',
            hint: 'Please provide a category name',
            code: '400'
          } as any
        };
      }

      const { data, error } = await supabaseAdmin
        .from('tool_categories')
        .insert(category)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to create category: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Update category
   * Similar to: var category = await context.Categories.FindAsync(id); update properties; await context.SaveChangesAsync()
   */
  async updateCategory(id: string, updates: ToolCategoryUpdate): Promise<SupabaseResponse<ToolCategory>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('tool_categories')
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
          message: `Failed to update category '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Delete category
   * Similar to: context.Categories.Remove(category); await context.SaveChangesAsync()
   * Note: Will fail if category has associated tools (foreign key constraint)
   */
  async deleteCategory(id: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await supabaseAdmin
        .from('tool_categories')
        .delete()
        .eq('id', id);
      
      return { data: null, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to delete category '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Reorder categories
   * Similar to: bulk update operations with new sort orders
   */
  async reorderCategories(categoryOrders: { id: string; sort_order: number }[]): Promise<SupabaseResponse<ToolCategory[]>> {
    try {
      // Prepare batch update operations
      const updates = categoryOrders.map(({ id, sort_order }) => 
        supabaseAdmin
          .from('tool_categories')
          .update({ 
            sort_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()
      );

      // Execute all updates
      const results = await Promise.all(updates);
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        return {
          data: null,
          error: {
            message: `Failed to reorder ${errors.length} categories`,
            details: errors.map(e => e.error),
            hint: 'Some categories may not have been reordered',
            code: '500'
          } as any
        };
      }

      // Return successful results
      const data = results.map(result => result.data).filter(Boolean) as ToolCategory[];
      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to reorder categories: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Check if category name is available
   * Similar to: context.Categories.AnyAsync(c => c.Name == name)
   */
  async isCategoryNameAvailable(name: string, excludeId?: string): Promise<SupabaseResponse<boolean>> {
    try {
      let query = supabase
        .from('tool_categories')
        .select('id')
        .eq('name', name);

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
          message: `Failed to check category name availability '${name}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get next available sort order for new categories
   * Similar to: context.Categories.Max(c => c.SortOrder) + 1
   */
  async getNextSortOrder(): Promise<SupabaseResponse<number>> {
    try {
      const { data, error } = await supabase
        .from('tool_categories')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);
      
      if (error) {
        return { data: null, error };
      }

      const maxSortOrder = data && data.length > 0 ? (data[0]?.sort_order || 0) : 0;
      return { data: maxSortOrder + 10, error: null }; // Increment by 10 to allow easy reordering
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to get next sort order: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get category statistics
   * Returns summary information about categories
   */
  async getCategoryStatistics(): Promise<SupabaseResponse<{
    total_categories: number;
    categories_with_tools: number;
    average_tools_per_category: number;
  }>> {
    try {
      // Get total categories
      const { data: totalData, error: totalError } = await supabase
        .from('tool_categories')
        .select('id');

      if (totalError) {
        return { data: null, error: totalError };
      }

      // Get categories with tool counts
      const { data: categoryData, error: categoryError } = await supabase
        .from('tool_categories')
        .select(`
          id,
          ai_tools!inner(id)
        `);

      if (categoryError) {
        return { data: null, error: categoryError };
      }

      const totalCategories = totalData.length;
      const categoriesWithTools = categoryData.length;
      const totalTools = categoryData.reduce((sum, cat) => sum + (cat.ai_tools?.length || 0), 0);
      const averageToolsPerCategory = categoriesWithTools > 0 ? Math.round(totalTools / categoriesWithTools * 100) / 100 : 0;

      return {
        data: {
          total_categories: totalCategories,
          categories_with_tools: categoriesWithTools,
          average_tools_per_category: averageToolsPerCategory
        },
        error: null
      };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to get category statistics: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  }
};