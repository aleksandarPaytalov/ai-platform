import React from 'react';
import { SkeletonText, SkeletonImage } from '../ui/loading';

export interface UpdatesLoadingProps {
  /**
   * Number of update items to show
   */
  itemCount?: number;
  /**
   * Layout variant for updates
   */
  variant?: 'list' | 'timeline' | 'cards';
  /**
   * Whether to show filters
   */
  showFilters?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UpdatesLoading - Loading state for feature updates section
 * 
 * Provides loading skeletons for AI feature updates in various layouts.
 * Supports list, timeline, and card formats to match different presentation needs.
 */
export const UpdatesLoading: React.FC<UpdatesLoadingProps> = ({
  itemCount = 6,
  variant = 'list',
  showFilters = true,
  className = '',
}) => {
  /**
   * Render update item based on variant
   */
  const renderUpdateItem = (index: number) => {
    const baseKey = `update-${index}`;

    switch (variant) {
      case 'timeline':
        return (
          <div key={baseKey} className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
            
            {/* Timeline line */}
            {index < itemCount - 1 && (
              <div className="absolute left-1.5 top-5 w-0.5 h-16 bg-gray-200" />
            )}
            
            {/* Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 animate-pulse">
              {/* Date */}
              <div className="bg-gray-300 h-3 w-20 rounded" />
              
              {/* Title */}
              <div className="bg-gray-300 h-5 w-3/4 rounded" />
              
              {/* Description */}
              <SkeletonText lines={2} size="small" widthPattern="varied" />
              
              {/* Tags */}
              <div className="flex gap-1">
                <div className="bg-gray-300 h-5 w-12 rounded-full" />
                <div className="bg-gray-300 h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div key={baseKey} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
            {/* Header Image */}
            <SkeletonImage
              aspectRatio="banner"
              rounded="none"
              showIcon={true}
            />
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Date and Category */}
              <div className="flex items-center justify-between">
                <div className="bg-gray-300 h-3 w-20 rounded" />
                <div className="bg-gray-300 h-5 w-16 rounded-full" />
              </div>
              
              {/* Title */}
              <div className="bg-gray-300 h-5 w-4/5 rounded" />
              
              {/* Description */}
              <SkeletonText lines={3} size="small" widthPattern="varied" />
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="bg-gray-300 h-4 w-24 rounded" />
                <div className="bg-gray-300 h-6 w-16 rounded" />
              </div>
            </div>
          </div>
        );

      case 'list':
      default:
        return (
          <div key={baseKey} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex gap-4">
              {/* Icon/Image */}
              <div className="flex-shrink-0">
                <SkeletonImage
                  size="small"
                  aspectRatio="square"
                  rounded="medium"
                  showIcon={true}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="bg-gray-300 h-5 w-1/2 rounded" />
                  <div className="bg-gray-300 h-4 w-16 rounded" />
                </div>
                
                {/* Description */}
                <SkeletonText lines={2} size="small" widthPattern="varied" />
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="bg-gray-300 h-5 w-12 rounded-full" />
                    <div className="bg-gray-300 h-5 w-16 rounded-full" />
                  </div>
                  <div className="bg-gray-300 h-4 w-20 rounded" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`space-y-6 ${className}`}
      role="status"
      aria-label="Loading feature updates..."
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-gray-300 h-7 w-40 rounded animate-pulse" />
          <div className="bg-gray-300 h-4 w-64 rounded animate-pulse" />
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-gray-300 h-8 w-8 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filters */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-8 w-20 rounded-full animate-pulse"
              />
            ))}
          </div>
          
          {/* Date Filter */}
          <div className="bg-gray-300 h-8 w-32 rounded-md animate-pulse" />
          
          {/* Sort */}
          <div className="ml-auto bg-gray-300 h-8 w-28 rounded-md animate-pulse" />
        </div>
      )}

      {/* Updates Content */}
      <div className={`
        ${variant === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        ${variant === 'timeline' ? 'space-y-6' : ''}
      `}>
        {Array.from({ length: itemCount }, (_, index) => 
          renderUpdateItem(index)
        )}
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
        <div className="bg-gray-300 h-10 w-32 rounded-md animate-pulse mx-auto" />
      </div>

      {/* Loading Status */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          <span>Loading latest AI feature updates...</span>
        </div>
      </div>
    </div>
  );
};

export default UpdatesLoading;