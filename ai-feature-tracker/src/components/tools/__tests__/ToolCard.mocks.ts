import type { AITool, ToolWithLatestUpdate } from '@/types/database.types';

export function createMockTool(overrides: Partial<AITool> = {}): AITool {
  return {
    id: 'tool_1',
    name: 'Mock Tool',
    description: 'A mock AI tool for testing.',
    slug: 'mock-tool',
    category_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    logo_url: null,
    metadata: null,
    website_url: 'https://example.com',
    ...overrides,
  } as AITool;
}

export function createMockToolWithUpdate(overrides: Partial<ToolWithLatestUpdate> = {}): ToolWithLatestUpdate {
  return {
    id: 'tool_1',
    name: 'Mock Tool',
    slug: 'mock-tool',
    description: 'A mock AI tool for testing.',
    category_id: null,
    category_name: 'Testing',
    category_color: '#2563eb',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    logo_url: null,
    metadata: null,
    website_url: 'https://example.com',
    latest_update_id: 'upd_1',
    latest_update_title: 'New Feature',
    latest_update_date: new Date().toISOString(),
    latest_update_impact: 'High',
    ...overrides,
  } as ToolWithLatestUpdate;
}


