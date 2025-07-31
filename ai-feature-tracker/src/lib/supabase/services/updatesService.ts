import { supabase, supabaseAdmin } from '@/lib/supabase/client';
import { 
  FeatureUpdate, 
  FeatureUpdateInsert,
  FeatureUpdateUpdate,
  RecentFeatureUpdate,
  ImpactLevel,
  ValidationStatus,
  SupabaseResponse,
  SupabaseArrayResponse 
} from '@/types/database.types';

/**
 * Feature Updates Service Layer
 * This provides comprehensive feature update operations similar to C# service classes
 * Think of this as your FeatureUpdateRepository pattern from .NET development
 */
export const updatesService = {

  /**
   * Get latest updates across all tools using the database view
   * Similar to: context.FeatureUpdates.Include(f => f.Tool).OrderByDescending(f => f.PublishedDate).Take(limit)
   */
  async getLatestUpdates(limit: number = 10): Promise<SupabaseArrayResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false })
        .limit(limit);
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch latest updates: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get updates for a specific tool
   * Similar to: context.FeatureUpdates.Where(f => f.ToolId == toolId && f.ValidationStatus == "validated").OrderByDescending(f => f.PublishedDate).Take(limit)
   */
  async getUpdatesByTool(toolId: string, limit: number = 5): Promise<SupabaseArrayResponse<FeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('feature_updates')
        .select('*')
        .eq('tool_id', toolId)
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false })
        .limit(limit);
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch updates for tool '${toolId}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get updates by impact level
   * Similar to: context.FeatureUpdates.Where(f => f.ImpactLevel == impactLevel && f.ValidationStatus == "validated").OrderByDescending(f => f.PublishedDate)
   */
  async getUpdatesByImpact(impactLevel: ImpactLevel): Promise<SupabaseArrayResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .eq('impact_level', impactLevel)
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch updates by impact '${impactLevel}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Search updates by text (title and description)
   * Similar to: context.FeatureUpdates.Where(f => f.Title.Contains(searchTerm) || f.Description.Contains(searchTerm) && f.ValidationStatus == "validated")
   */
  async searchUpdates(searchTerm: string): Promise<SupabaseArrayResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to search updates with term '${searchTerm}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get update by ID with tool information
   * Similar to: context.FeatureUpdates.Include(f => f.Tool).FirstOrDefaultAsync(f => f.Id == id)
   */
  async getUpdateById(id: string): Promise<SupabaseResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch update by ID '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get updates by date range
   * Similar to: context.FeatureUpdates.Where(f => f.PublishedDate >= startDate && f.PublishedDate <= endDate && f.ValidationStatus == "validated")
   */
  async getUpdatesByDateRange(startDate: string, endDate: string): Promise<SupabaseArrayResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .gte('published_date', startDate)
        .lte('published_date', endDate)
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch updates for date range ${startDate} to ${endDate}: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get updates with pagination
   * Similar to: context.FeatureUpdates.Skip(offset).Take(limit).OrderByDescending(f => f.PublishedDate)
   */
  async getUpdatesPaginated(offset: number = 0, limit: number = 20): Promise<SupabaseArrayResponse<RecentFeatureUpdate>> {
    try {
      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('*')
        .eq('validation_status', 'validated')
        .order('published_date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch paginated updates (offset: ${offset}, limit: ${limit}): ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Create new update
   * Similar to: context.FeatureUpdates.Add(newUpdate); await context.SaveChangesAsync()
   */
  async createUpdate(update: FeatureUpdateInsert): Promise<SupabaseResponse<FeatureUpdate>> {
    try {
      // Validate required fields
      if (!update.title || !update.tool_id || !update.published_date) {
        return {
          data: null,
          error: {
            message: 'Title, tool_id, and published_date are required fields',
            details: 'Validation failed',
            hint: 'Please provide all required fields',
            code: '400'
          } as any
        };
      }

      const { data, error } = await supabaseAdmin
        .from('feature_updates')
        .insert({
          ...update,
          validation_status: update.validation_status || 'pending'
        })
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to create update: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Update validation status (for AI processing workflow)
   * Similar to: var update = await context.FeatureUpdates.FindAsync(id); update.ValidationStatus = status; update.AiAnalyzed = true; await context.SaveChangesAsync()
   */
  async updateValidationStatus(
    id: string, 
    status: ValidationStatus, 
    confidenceScore?: number,
    _reason?: string
  ): Promise<SupabaseResponse<FeatureUpdate>> {
    try {
      const updates: FeatureUpdateUpdate = {
        validation_status: status,
        ai_analyzed: true,
        updated_at: new Date().toISOString(),
        ...(confidenceScore !== undefined && { confidence_score: confidenceScore }),
      };

      const { data, error } = await supabaseAdmin
        .from('feature_updates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to update validation status for update '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Update feature update
   * Similar to: var update = await context.FeatureUpdates.FindAsync(id); update properties; await context.SaveChangesAsync()
   */
  async updateFeatureUpdate(id: string, updates: FeatureUpdateUpdate): Promise<SupabaseResponse<FeatureUpdate>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('feature_updates')
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
          message: `Failed to update feature update '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Get updates pending AI analysis
   * Similar to: context.FeatureUpdates.Where(f => !f.AiAnalyzed).OrderBy(f => f.CreatedAt)
   */
  async getPendingUpdates(limit: number = 50): Promise<SupabaseArrayResponse<FeatureUpdate>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('feature_updates')
        .select('*')
        .eq('ai_analyzed', false)
        .order('created_at', { ascending: true })
        .limit(limit);
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch pending updates: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Get updates by validation status
   * Similar to: context.FeatureUpdates.Where(f => f.ValidationStatus == status).OrderByDescending(f => f.CreatedAt)
   */
  async getUpdatesByValidationStatus(status: ValidationStatus): Promise<SupabaseArrayResponse<FeatureUpdate>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('feature_updates')
        .select('*')
        .eq('validation_status', status)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to fetch updates by validation status '${status}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Admin: Delete update
   * Similar to: context.FeatureUpdates.Remove(update); await context.SaveChangesAsync()
   */
  async deleteUpdate(id: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await supabaseAdmin
        .from('feature_updates')
        .delete()
        .eq('id', id);
      
      return { data: null, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to delete update '${id}': ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get update statistics for dashboard
   * Returns summary information about updates
   */
  async getUpdateStatistics(): Promise<SupabaseResponse<{
    total_updates: number;
    validated_updates: number;
    pending_updates: number;
    requires_review_updates: number;
    recent_updates_count: number; // Last 7 days
    high_impact_updates: number;
    average_confidence_score: number;
  }>> {
    try {
      // Get all updates count
      const { data: allUpdates, error: allError } = await supabase
        .from('feature_updates')
        .select('validation_status, impact_level, confidence_score, published_date');

      if (allError) {
        return { data: null, error: allError };
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const totalUpdates = allUpdates.length;
      const validatedUpdates = allUpdates.filter(u => u.validation_status === 'validated').length;
      const pendingUpdates = allUpdates.filter(u => u.validation_status === 'pending').length;
      const requiresReviewUpdates = allUpdates.filter(u => u.validation_status === 'requires_review').length;
      const recentUpdates = allUpdates.filter(u => new Date(u.published_date) >= sevenDaysAgo).length;
      const highImpactUpdates = allUpdates.filter(u => u.impact_level === 'High').length;
      
      const confidenceScores = allUpdates
        .map(u => u.confidence_score)
        .filter(score => score !== null) as number[];
      const averageConfidenceScore = confidenceScores.length > 0 
        ? Math.round(confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length * 100) / 100 
        : 0;

      return {
        data: {
          total_updates: totalUpdates,
          validated_updates: validatedUpdates,
          pending_updates: pendingUpdates,
          requires_review_updates: requiresReviewUpdates,
          recent_updates_count: recentUpdates,
          high_impact_updates: highImpactUpdates,
          average_confidence_score: averageConfidenceScore
        },
        error: null
      };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to get update statistics: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  },

  /**
   * Get trending tools based on recent update activity
   * Returns tools with the most updates in recent period
   */
  async getTrendingTools(days: number = 7, limit: number = 10): Promise<SupabaseArrayResponse<{
    tool_id: string;
    tool_name: string;
    tool_slug: string;
    update_count: number;
    latest_update_date: string;
  }>> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const { data, error } = await supabase
        .from('recent_feature_updates')
        .select('tool_id, tool_name, tool_slug, published_date')
        .eq('validation_status', 'validated')
        .gte('published_date', dateThreshold.toISOString());

      if (error) {
        return { data: null, error };
      }

      // Group by tool and count updates (JavaScript equivalent of LINQ GroupBy)
      const toolGroups = data.reduce((acc: Record<string, any>, update) => {
        const toolId = update.tool_id;
        if (!toolId) return acc;

        if (!acc[toolId]) {
          acc[toolId] = {
            tool_id: toolId,
            tool_name: update.tool_name,
            tool_slug: update.tool_slug,
            update_count: 0,
            latest_update_date: update.published_date
          };
        }
        
        acc[toolId].update_count++;
        if (new Date(update.published_date!) > new Date(acc[toolId].latest_update_date)) {
          acc[toolId].latest_update_date = update.published_date;
        }
        
        return acc;
      }, {});

      const result = Object.values(toolGroups)
        .sort((a: any, b: any) => b.update_count - a.update_count)
        .slice(0, limit);

      return { data: result, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: `Failed to get trending tools: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err,
          hint: '',
          code: '500'
        } as any
      };
    }
  }
};