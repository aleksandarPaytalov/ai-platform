import React from 'react';
import { SkeletonImage, SkeletonText, SkeletonButton, SkeletonCard } from '../ui/loading';

export interface ToolDetailLoadingProps {
  /**
   * Whether to show the full detailed view or compact version
   */
  detailed?: boolean;
  /**
   * Whether to show related tools section
   */
  showRelated?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ToolDetailLoading - Loading state for detailed tool view
 * 
 * Comprehensive loading skeleton for the detailed tool page including
 * hero section, features, pricing, gallery, and related tools.
 * Maintains proper layout structure during content loading.
 */
export const ToolDetailLoading: React.FC<ToolDetailLoadingProps> = ({
  detailed = true,
  showRelated = true,
  className = '',
}) => {
  return (
    <div 
      className={`space-y-8 ${className}`}
      role="status"
      aria-label="Loading AI tool details..."
    >
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <SkeletonImage
              size="large"
              aspectRatio="square"
              rounded="large"
              showIcon={true}
            />
            
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="bg-gray-300 h-8 w-3/4 rounded animate-pulse" />
              
              {/* Subtitle/Company */}
              <div className="bg-gray-300 h-5 w-1/2 rounded animate-pulse" />
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 h-6 w-16 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="bg-gray-300 h-6 w-32 rounded animate-pulse" />
            <SkeletonText
              lines={6}
              size="medium"
              widthPattern="varied"
            />
          </div>

          {/* Key Features */}
          {detailed && (
            <div className="space-y-4">
              <div className="bg-gray-300 h-6 w-28 rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="bg-gray-300 w-4 h-4 rounded-full animate-pulse" />
                    <div className="bg-gray-300 h-4 flex-1 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots/Gallery */}
          {detailed && (
            <div className="space-y-4">
              <div className="bg-gray-300 h-6 w-24 rounded animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <SkeletonImage
                    key={index}
                    aspectRatio="video"
                    rounded="medium"
                    showIcon={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-pulse">
            {/* Pricing */}
            <div className="text-center space-y-2">
              <div className="bg-gray-300 h-8 w-24 rounded mx-auto" />
              <div className="bg-gray-300 h-4 w-16 rounded mx-auto" />
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <SkeletonButton size="large" width="full" variant="primary" />
              <SkeletonButton size="medium" width="full" variant="outline" />
            </div>
            
            {/* Links */}
            <div className="space-y-2 pt-4 border-t">
              <div className="bg-gray-300 h-4 w-20 rounded" />
              <div className="bg-gray-300 h-4 w-24 rounded" />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="bg-gray-300 h-5 w-16 rounded animate-pulse" />
            
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="bg-gray-300 h-4 w-20 rounded animate-pulse" />
                  <div className="bg-gray-300 h-4 w-12 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="bg-gray-300 h-5 w-20 rounded animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 h-6 w-16 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      {detailed && (
        <>
          {/* Pricing Plans */}
          <div className="space-y-4">
            <div className="bg-gray-300 h-7 w-32 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <SkeletonCard
                  key={index}
                  size="large"
                  showImage={false}
                  showActions={true}
                  textLines={5}
                />
              ))}
            </div>
          </div>

          {/* Reviews/Ratings */}
          <div className="space-y-4">
            <div className="bg-gray-300 h-7 w-28 rounded animate-pulse" />
            
            {/* Rating Summary */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-300 h-12 w-16 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 w-32 rounded animate-pulse" />
                  <div className="bg-gray-300 h-3 w-24 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Rating Bars */}
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="bg-gray-300 h-3 w-8 rounded animate-pulse" />
                    <div className="bg-gray-200 h-2 flex-1 rounded animate-pulse" />
                    <div className="bg-gray-300 h-3 w-6 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="bg-white border rounded-lg p-4 space-y-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-300 w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <div className="bg-gray-300 h-4 w-24 rounded" />
                      <div className="bg-gray-300 h-3 w-16 rounded" />
                    </div>
                  </div>
                  <SkeletonText lines={3} size="small" widthPattern="varied" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Related Tools */}
      {showRelated && (
        <div className="space-y-4">
          <div className="bg-gray-300 h-7 w-32 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonCard
                key={index}
                size="medium"
                showImage={true}
                showActions={true}
                textLines={3}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading Status */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          <span>Loading detailed information...</span>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailLoading;