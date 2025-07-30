// Tool-related types
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  logo?: string;
  status: 'active' | 'inactive' | 'deprecated';
  lastUpdated: Date;
  features: ToolFeature[];
}

export interface ToolFeature {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'beta' | 'planned' | 'deprecated';
  category: string;
  lastUpdated: Date;
  impact: 'low' | 'medium' | 'high';
}
