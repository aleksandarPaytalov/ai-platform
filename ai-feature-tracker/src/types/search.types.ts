// Search and filter types
export interface SearchFilters {
  tools?: string[];
  categories?: string[];
  status?: string[];
  impact?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResult {
  id: string;
  type: 'tool' | 'feature' | 'update';
  title: string;
  description: string;
  relevance: number;
  data: any;
}

export interface SearchSuggestions {
  tools: string[];
  features: string[];
  categories: string[];
}
