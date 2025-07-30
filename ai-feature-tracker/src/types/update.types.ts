// Feature update types
export interface FeatureUpdate {
  id: string;
  toolId: string;
  featureId: string;
  title: string;
  description: string;
  type: 'new' | 'improved' | 'deprecated' | 'bugfix';
  impact: 'low' | 'medium' | 'high';
  date: Date;
  source: string;
  validated: boolean;
}

export interface UpdateTimeline {
  toolId: string;
  updates: FeatureUpdate[];
  lastChecked: Date;
}
