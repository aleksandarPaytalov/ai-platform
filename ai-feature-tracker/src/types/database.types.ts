// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_tools: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          metadata: Json | null
          name: string
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tool_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_updates: {
        Row: {
          ai_analyzed: boolean | null
          confidence_score: number | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          impact_level: string | null
          official_url: string | null
          published_date: string
          screenshot_urls: string[] | null
          title: string
          tool_id: string
          updated_at: string | null
          validation_status: string | null
        }
        Insert: {
          ai_analyzed?: boolean | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          official_url?: string | null
          published_date: string
          screenshot_urls?: string[] | null
          title: string
          tool_id: string
          updated_at?: string | null
          validation_status?: string | null
        }
        Update: {
          ai_analyzed?: boolean | null
          confidence_score?: number | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          official_url?: string | null
          published_date?: string
          screenshot_urls?: string[] | null
          title?: string
          tool_id?: string
          updated_at?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_updates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_updates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools_with_latest_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_categories: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      update_history: {
        Row: {
          change_reason: string | null
          change_type: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          update_id: string
        }
        Insert: {
          change_reason?: string | null
          change_type: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          update_id: string
        }
        Update: {
          change_reason?: string | null
          change_type?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "update_history_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "feature_updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "update_history_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "recent_feature_updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "update_history_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "tools_with_latest_updates"
            referencedColumns: ["latest_update_id"]
          },
        ]
      }
    }
    Views: {
      recent_feature_updates: {
        Row: {
          ai_analyzed: boolean | null
          category_color: string | null
          category_name: string | null
          confidence_score: number | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string | null
          impact_level: string | null
          official_url: string | null
          published_date: string | null
          screenshot_urls: string[] | null
          title: string | null
          tool_id: string | null
          tool_logo: string | null
          tool_name: string | null
          tool_slug: string | null
          updated_at: string | null
          validation_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_updates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_updates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools_with_latest_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      security_policy_summary: {
        Row: {
          cmd: string | null
          permissive: string | null
          policyname: unknown | null
          qual: string | null
          roles: unknown[] | null
          schemaname: unknown | null
          tablename: unknown | null
          with_check: string | null
        }
        Relationships: []
      }
      tools_with_latest_updates: {
        Row: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          latest_update_date: string | null
          latest_update_id: string | null
          latest_update_impact: string | null
          latest_update_title: string | null
          logo_url: string | null
          metadata: Json | null
          name: string | null
          slug: string | null
          updated_at: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tool_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_modify_data: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_read_sensitive_data: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Import PostgrestError for response types
import { PostgrestError } from '@supabase/supabase-js';

// Enhanced types for better application development (similar to C# model classes)
export type ToolCategory = Database['public']['Tables']['tool_categories']['Row'];
export type ToolCategoryInsert = Database['public']['Tables']['tool_categories']['Insert'];
export type ToolCategoryUpdate = Database['public']['Tables']['tool_categories']['Update'];

export type AITool = Database['public']['Tables']['ai_tools']['Row'];
export type AIToolInsert = Database['public']['Tables']['ai_tools']['Insert'];
export type AIToolUpdate = Database['public']['Tables']['ai_tools']['Update'];

export type FeatureUpdate = Database['public']['Tables']['feature_updates']['Row'];
export type FeatureUpdateInsert = Database['public']['Tables']['feature_updates']['Insert'];
export type FeatureUpdateUpdate = Database['public']['Tables']['feature_updates']['Update'];

export type UpdateHistory = Database['public']['Tables']['update_history']['Row'];
export type UpdateHistoryInsert = Database['public']['Tables']['update_history']['Insert'];
export type UpdateHistoryUpdate = Database['public']['Tables']['update_history']['Update'];

// View types for application queries (similar to C# ViewModels)
export type ToolWithLatestUpdate = Database['public']['Views']['tools_with_latest_updates']['Row'];
export type RecentFeatureUpdate = Database['public']['Views']['recent_feature_updates']['Row'];

// Enums for better type safety (similar to C# enums)
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type ValidationStatus = 'validated' | 'pending' | 'requires_review' | 'rejected';
export type ChangeType = 'created' | 'updated' | 'deleted' | 'ai_analyzed' | 'validated' | 'rejected';

// Utility types for API responses (similar to C# response DTOs)
export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export type SupabaseArrayResponse<T> = {
  data: T[] | null;
  error: PostgrestError | null;
};