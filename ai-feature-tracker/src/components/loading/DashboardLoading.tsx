import React from 'react';
import { SkeletonCard, SkeletonGrid, SkeletonText } from '../ui/loading';

export interface DashboardLoadingProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show all sections or just main content
   */
  showAllSections?: boolean;
}

/**
 * DashboardLoading - Loading state for main dashboard layout
 * 
 * Provides a comprehensive loading skeleton that matches the expected dashboard structure
 * with header stats, tool grid, and recent updates sections. This maintains layout
 * stability while data is being fetched, similar to how enterprise dashboards
 * handle initial loading states.
 */
export const DashboardLoading: React.FC<DashboardLoadingProps> = ({
  className = '',
  showAllSections = true,
}) => {
  return (
    <div 
      className={`space-y-6 ${className}`}
      role="status"
      aria-label="Loading dashboard content..."
    >
      {/* Dashboard Header with Stats */}
      {showAllSections && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonCard
              key={`stat-${index}`}
              size="small"
              showImage={false}
              showActions={false}
              textLines={2}
              className="bg-gradient-to-br from-blue-50 to-indigo-50"
            />
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools Section (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <SkeletonText 
              lines={1} 
              size="large" 
              widthPattern="uniform"
              className="w-32"
            />
            <div className="flex gap-2">
              <div className="bg-gray-300 h-8 w-20 rounded animate-pulse" />
              <div className="bg-gray-300 h-8 w-16 rounded animate-pulse" />
            </div>
          </div>

          {/* Tools Grid */}
          <SkeletonGrid
            itemCount={6}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            gap="medium"
            itemType="card"
            itemSize="medium"
          />

          {/* Load More Button */}
          <div className="flex justify-center pt-4">
            <div className="bg-gray-300 h-10 w-32 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Sidebar (1/3 width on large screens) */}
        {showAllSections && (
          <div className="space-y-6">
            {/* Recent Updates Section */}
            <div className="space-y-4">
              <SkeletonText 
                lines={1} 
                size="large" 
                widthPattern="uniform"
                className="w-28"
              />
              
              {/* Update Cards */}
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={`update-${index}`}
                    className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse"
                  >
                    {/* Date */}
                    <div className="bg-gray-300 h-3 w-20 rounded mb-2" />
                    
                    {/* Title */}
                    <div className="bg-gray-300 h-4 w-full rounded mb-2" />
                    
                    {/* Description */}
                    <div className="space-y-1">
                      <div className="bg-gray-300 h-3 w-full rounded" />
                      <div className="bg-gray-300 h-3 w-3/4 rounded" />
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-1 mt-2">
                      <div className="bg-gray-300 h-5 w-12 rounded-full" />
                      <div className="bg-gray-300 h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <SkeletonText 
                lines={1} 
                size="medium" 
                widthPattern="uniform"
                className="w-24"
              />
              
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={`stat-${index}`} className="flex justify-between items-center">
                    <div className="bg-gray-300 h-3 w-20 rounded animate-pulse" />
                    <div className="bg-gray-300 h-3 w-8 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator text */}
      <div className="text-center text-gray-500 text-sm py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          <span>Loading AI tools and features...</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;