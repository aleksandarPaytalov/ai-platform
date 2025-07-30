// Global type definitions
export type Status = 'active' | 'inactive' | 'deprecated' | 'beta' | 'planned';
export type Impact = 'low' | 'medium' | 'high';
export type UpdateType = 'new' | 'improved' | 'deprecated' | 'bugfix';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
