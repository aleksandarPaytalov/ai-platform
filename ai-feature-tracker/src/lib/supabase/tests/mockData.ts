import type { AITool, ToolCategory, FeatureUpdate } from '@/types/database.types';

export const mockCategory = (overrides: Partial<ToolCategory> = {}): ToolCategory => ({
  id: overrides.id || 'cat-1',
  name: overrides.name || 'NLP',
  description: overrides.description ?? null,
  sort_order: overrides.sort_order ?? 10,
  color_code: overrides.color_code ?? '#2563eb',
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});

export const mockTool = (overrides: Partial<AITool> = {}): AITool => ({
  id: overrides.id || 'tool-1',
  name: overrides.name || 'Test Tool',
  slug: overrides.slug || 'test-tool',
  description: overrides.description || 'A test AI tool',
  website_url: overrides.website_url || 'https://example.com',
  logo_url: overrides.logo_url || null,
  category_id: overrides.category_id || 'cat-1',
  is_active: overrides.is_active ?? true,
  metadata: overrides.metadata ?? {}, // <- required Json field
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});

export const mockUpdate = (overrides: Partial<FeatureUpdate> = {}): FeatureUpdate => ({
  id: overrides.id || 'upd-1',
  tool_id: overrides.tool_id || 'tool-1',
  title: overrides.title || 'Update Title',
  description: overrides.description || 'Update description',
  content: overrides.content || null,
  impact_level: overrides.impact_level || 'Medium',
  confidence_score: overrides.confidence_score ?? null, // <- add
  official_url: overrides.official_url ?? null,         // <- add
  screenshot_urls: overrides.screenshot_urls ?? null,   // <- add
  published_date: overrides.published_date || new Date().toISOString(),
  validation_status: overrides.validation_status || 'validated',
  ai_analyzed: overrides.ai_analyzed ?? true,
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});