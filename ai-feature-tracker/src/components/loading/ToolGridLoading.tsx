import React from 'react';
import { SkeletonGrid } from '../ui/loading';

export interface ToolGridLoadingProps {
  /**
   * Number of tool cards to show as loading
   */
  itemCount?: number;
  /**
   * Grid layout configuration
   */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  /**
   * Whether to show the filter/search bar loading
   */
  showFilters?: boolean;
  /**
   * Whether to show pagination loading
   */
  showPagination?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size of individual tool cards
   */
  cardSize?: 'small' | 'medium' | 'large';
}

/**
 * ToolGridLoading - Loading state for tool grid layout
 * 
 * Provides a realistic loading skeleton for the main tools grid view,
 * including filters, search, and pagination elements. This matches
 * the expected layout structure for browsing AI tools and maintains
 * visual consistency during data loading.
 */
export const ToolGridLoading: React.FC<ToolGridLoadingProps> = ({
  itemCount = 12,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  showFilters = true,
  showPagination = true,
  className = '',
  cardSize = 'medium',
}) => {
  return (
    <div 
      className={`space-y-6 ${className}`}
      role="status"
      aria-label="Loading AI tools grid..."
    >
      {/* Filters and Search Bar */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-gray-200 h-10 w-full rounded-md animate-pulse" />
            </div>
            <div className="bg-gray-300 h-10 w-24 rounded-md animate-pulse" />
          </div>

          {/* Filter Tags and Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={`filter-${index}`}
                  className="bg-gray-300 h-8 w-16 rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="bg-gray-300 h-8 w-32 rounded-md animate-pulse" />
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="bg-gray-300 h-5 w-40 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="bg-gray-300 h-8 w-8 rounded animate-pulse" />
              <div className="bg-gray-300 h-8 w-8 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <SkeletonGrid
        itemCount={itemCount}
        columns={columns}
        gap="medium"
        itemType="card"
        itemSize={cardSize}
        showLoadingText={false}
      />

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between pt-6">
          {/* Previous Button */}
          <div className="bg-gray-300 h-10 w-20 rounded-md animate-pulse" />

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={`page-${index}`}
                className="bg-gray-300 h-10 w-10 rounded-md animate-pulse"
              />
            ))}
          </div>

          {/* Next Button */}
          <div className="bg-gray-300 h-10 w-16 rounded-md animate-pulse" />
        </div>
      )}

      {/* Loading Status */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          <span>Loading {itemCount} AI tools...</span>
        </div>
      </div>
    </div>
  );
};

export default ToolGridLoading;