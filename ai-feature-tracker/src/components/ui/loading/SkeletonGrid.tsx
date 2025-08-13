import React from 'react';

export interface SkeletonGridProps {
  /**
   * Number of skeleton items to display
   */
  itemCount?: number;
  /**
   * Grid column configuration
   */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  /**
   * Gap between grid items
   */
  gap?: 'small' | 'medium' | 'large';
  /**
   * Type of skeleton content to show in each grid item
   */
  itemType?: 'card' | 'image' | 'text' | 'mixed';
  /**
   * Size variant for grid items
   */
  itemSize?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show loading text
   */
  showLoadingText?: boolean;
}

/**
 * SkeletonGrid - Loading placeholder for grid layouts
 * 
 * Provides grid loading skeletons with responsive column layouts.
 * Similar to how you'd show placeholder items in data grids or card layouts,
 * maintaining proper spacing and responsive behavior during loading.
 */
export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  itemCount = 6,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  itemType = 'card',
  itemSize = 'medium',
  className = '',
  showLoadingText = false,
}) => {
  // Gap configurations
  const gapConfig = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  };

  // Grid column configurations using Tailwind responsive classes
  const getGridColumns = () => {
    const { mobile = 1, tablet = 2, desktop = 3 } = columns;
    return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  };

  // Item size configurations
  const itemSizeConfig = {
    small: 'h-32',
    medium: 'h-40',
    large: 'h-48',
  };

  /**
   * Render different types of skeleton items
   */
  const renderSkeletonItem = (index: number) => {
    const baseClasses = `
      bg-white 
      border 
      border-gray-200 
      rounded-lg 
      p-4 
      animate-pulse
      ${itemSizeConfig[itemSize]}
    `;

    switch (itemType) {
      case 'image':
        return (
          <div key={index} className={baseClasses}>
            <div className="bg-gray-300 w-full h-3/4 rounded-md mb-2" />
            <div className="bg-gray-300 h-4 w-2/3 rounded" />
          </div>
        );

      case 'text':
        return (
          <div key={index} className={baseClasses}>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 w-3/4 rounded" />
              <div className="bg-gray-300 h-4 w-full rounded" />
              <div className="bg-gray-300 h-4 w-5/6 rounded" />
              <div className="bg-gray-300 h-4 w-2/3 rounded" />
            </div>
          </div>
        );

      case 'mixed':
        // Alternate between different types for variety
        // Cycle through predefined templates by mapping index
        switch (index % 3) {
          case 0:
            return (
              <div key={index} className={baseClasses}>
                <div className="bg-gray-300 w-full h-1/2 rounded-md mb-3" />
                <div className="bg-gray-300 h-4 w-3/4 rounded mb-2" />
                <div className="space-y-2">
                  <div className="bg-gray-300 h-3 w-full rounded" />
                  <div className="bg-gray-300 h-3 w-5/6 rounded" />
                </div>
              </div>
            );
          case 1:
            return (
              <div key={index} className={baseClasses}>
                <div className="bg-gray-300 w-full h-3/4 rounded-md mb-2" />
                <div className="bg-gray-300 h-4 w-2/3 rounded" />
              </div>
            );
          default:
            return (
              <div key={index} className={baseClasses}>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 w-3/4 rounded" />
                  <div className="bg-gray-300 h-4 w-full rounded" />
                  <div className="bg-gray-300 h-4 w-5/6 rounded" />
                  <div className="bg-gray-300 h-4 w-2/3 rounded" />
                </div>
              </div>
            );
        }

      case 'card':
      default:
        return (
          <div key={index} className={baseClasses}>
            {/* Header with image */}
            <div className="bg-gray-300 w-full h-1/2 rounded-md mb-3" />
            
            {/* Title */}
            <div className="bg-gray-300 h-4 w-3/4 rounded mb-2" />
            
            {/* Content lines */}
            <div className="space-y-2">
              <div className="bg-gray-300 h-3 w-full rounded" />
              <div className="bg-gray-300 h-3 w-5/6 rounded" />
            </div>
            
            {/* Action area */}
            <div className="mt-3 flex gap-2">
              <div className="bg-gray-300 h-6 w-16 rounded" />
              <div className="bg-gray-300 h-6 w-12 rounded" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {/* Loading text indicator */}
      {showLoadingText && (
        <div className="mb-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          <span className="text-gray-600 text-sm">Loading content...</span>
        </div>
      )}

      {/* Grid layout */}
      <div
        className={`
          grid 
          ${getGridColumns()} 
          ${gapConfig[gap]}
        `}
        role="status"
        aria-hidden="true"
        aria-label={`Loading ${itemCount} items in grid layout...`}
      >
        {Array.from({ length: itemCount }, (_, index) => 
          renderSkeletonItem(index)
        )}
      </div>
    </div>
  );
};

export default SkeletonGrid;