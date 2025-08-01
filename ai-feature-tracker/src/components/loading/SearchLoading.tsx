import React from 'react';
import { SkeletonGrid, SkeletonText } from '../ui/loading';

export interface SearchLoadingProps {
  /**
   * Number of search result items to show
   */
  resultCount?: number;
  /**
   * Whether to show search suggestions
   */
  showSuggestions?: boolean;
  /**
   * Whether to show filters sidebar
   */
  showFilters?: boolean;
  /**
   * Search result layout
   */
  layout?: 'list' | 'grid' | 'compact';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SearchLoading - Loading state for search results
 * 
 * Provides comprehensive search loading experience including search bar,
 * filters, suggestions, and results in various layouts. Maintains good
 * user experience during search operations.
 */
export const SearchLoading: React.FC<SearchLoadingProps> = ({
  resultCount = 8,
  showSuggestions = true,
  showFilters = true,
  layout = 'grid',
  className = '',
}) => {
  return (
    <div 
      className={`space-y-6 ${className}`}
      role="status"
      aria-label="Loading search results..."
    >
      {/* Search Header */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="bg-gray-200 h-12 w-full rounded-lg animate-pulse" />
          <div className="absolute right-3 top-3 bg-gray-300 h-6 w-6 rounded animate-pulse" />
        </div>

        {/* Search Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="bg-gray-300 h-4 w-48 rounded animate-pulse" />
            <div className="bg-gray-300 h-3 w-32 rounded animate-pulse" />
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-3 w-12 rounded animate-pulse" />
            <div className="bg-gray-300 h-8 w-32 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="bg-gray-300 h-4 w-32 rounded animate-pulse" />
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-6 w-20 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${showFilters ? 'grid grid-cols-1 lg:grid-cols-4 gap-6' : ''}`}>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="space-y-6">
            {/* Filter Sections */}
            {Array.from({ length: 4 }, (_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                {/* Section Title */}
                <div className="bg-gray-300 h-5 w-24 rounded animate-pulse" />
                
                {/* Filter Options */}
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <div className="bg-gray-300 w-4 h-4 rounded animate-pulse" />
                      <div className="bg-gray-300 h-4 flex-1 rounded animate-pulse" />
                      <div className="bg-gray-300 h-3 w-6 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Clear Filters */}
            <div className="bg-gray-300 h-8 w-full rounded-md animate-pulse" />
          </div>
        )}

        {/* Search Results */}
        <div className={showFilters ? 'lg:col-span-3' : ''}>
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-6 w-24 rounded-full animate-pulse"
              />
            ))}
          </div>

          {/* Results Content */}
          {layout === 'list' ? (
            <div className="space-y-4">
              {Array.from({ length: resultCount }, (_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="bg-gray-300 w-16 h-16 rounded-md flex-shrink-0" />
                    
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-300 h-5 w-3/4 rounded" />
                      <SkeletonText lines={2} size="small" widthPattern="varied" />
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-300 h-3 w-16 rounded" />
                        <div className="bg-gray-300 h-3 w-20 rounded" />
                        <div className="bg-gray-300 h-5 w-12 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : layout === 'compact' ? (
            <div className="space-y-2">
              {Array.from({ length: resultCount }, (_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded p-3 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-300 w-8 h-8 rounded" />
                    <div className="flex-1 bg-gray-300 h-4 rounded" />
                    <div className="bg-gray-300 h-3 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid Layout */
            <SkeletonGrid
              itemCount={resultCount}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
              gap="medium"
              itemType="card"
              itemSize="medium"
              showLoadingText={false}
            />
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-8">
            <div className="bg-gray-300 h-8 w-20 rounded animate-pulse" />
            
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 h-8 w-8 rounded animate-pulse"
                />
              ))}
            </div>
            
            <div className="bg-gray-300 h-8 w-16 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search Status */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          <span>Searching AI tools and features...</span>
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;