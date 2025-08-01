import React from 'react';
import { SkeletonCard, SkeletonImage, SkeletonText, SkeletonButton } from '../ui/loading';

export interface ToolCardLoadingProps {
  /**
   * Size variant for the tool card
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show detailed information (pricing, features, etc.)
   */
  showDetails?: boolean;
  /**
   * Whether to show action buttons
   */
  showActions?: boolean;
  /**
   * Card layout variant
   */
  variant?: 'compact' | 'detailed' | 'featured';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ToolCardLoading - Loading state for individual AI tool cards
 * 
 * Provides realistic loading skeleton for tool cards matching the expected
 * layout with logo, title, description, tags, pricing, and action buttons.
 * Similar to how product cards load in e-commerce applications.
 */
export const ToolCardLoading: React.FC<ToolCardLoadingProps> = ({
  size = 'medium',
  showDetails = true,
  showActions = true,
  variant = 'detailed',
  className = '',
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'p-3',
      imageSize: 'small',
      spacing: 'space-y-2',
    },
    medium: {
      padding: 'p-4',
      imageSize: 'medium',
      spacing: 'space-y-3',
    },
    large: {
      padding: 'p-6',
      imageSize: 'large',
      spacing: 'space-y-4',
    },
  };

  const config = sizeConfig[size];

  if (variant === 'compact') {
    return (
      <div
        className={`
          bg-white border border-gray-200 rounded-lg 
          ${config.padding} ${config.spacing}
          animate-pulse
          ${className}
        `}
        role="status"
        aria-label="Loading tool card..."
      >
        <div className="flex items-center gap-3">
          {/* Tool Logo */}
          <SkeletonImage
            size="small"
            aspectRatio="square"
            rounded="medium"
            showIcon={false}
          />
          
          <div className="flex-1 space-y-1">
            {/* Tool Name */}
            <div className="bg-gray-300 h-4 w-3/4 rounded" />
            
            {/* Category */}
            <div className="bg-gray-300 h-3 w-1/2 rounded" />
          </div>
          
          {/* Status Badge */}
          <div className="bg-gray-300 h-6 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg 
        ${config.padding} ${config.spacing}
        hover:shadow-md transition-shadow
        animate-pulse
        ${className}
      `}
      role="status"
      aria-label="Loading AI tool card..."
    >
      {/* Header with Logo and Basic Info */}
      <div className="flex items-start gap-3">
        {/* Tool Logo */}
        <SkeletonImage
          size={config.imageSize}
          aspectRatio="square"
          rounded="medium"
          showIcon={true}
        />
        
        <div className="flex-1 space-y-2">
          {/* Tool Name */}
          <div className="bg-gray-300 h-5 w-3/4 rounded" />
          
          {/* Company/Category */}
          <div className="bg-gray-300 h-3 w-1/2 rounded" />
          
          {/* Status Badge */}
          <div className="bg-gray-300 h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Description */}
      <SkeletonText
        lines={variant === 'featured' ? 4 : 3}
        size="small"
        widthPattern="varied"
      />

      {/* Features/Tags */}
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: variant === 'featured' ? 5 : 3 }, (_, index) => (
          <div
            key={index}
            className="bg-gray-300 h-5 w-12 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {/* Pricing Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="bg-gray-300 h-3 w-16 rounded" />
              <div className="bg-gray-300 h-4 w-20 rounded" />
            </div>
            <div className="bg-gray-300 h-6 w-24 rounded-full" />
          </div>

          {/* Metrics */}
          {variant === 'featured' && (
            <div className="grid grid-cols-3 gap-4 py-2">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="text-center space-y-1">
                  <div className="bg-gray-300 h-4 w-8 rounded mx-auto" />
                  <div className="bg-gray-300 h-3 w-12 rounded mx-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 pt-3">
          <SkeletonButton
            size={size}
            variant="primary"
            width="fit"
            customWidth="flex-1"
          />
          <SkeletonButton
            size={size}
            variant="outline"
            width="auto"
            showIcon={true}
          />
        </div>
      )}

      {/* Last Updated */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
        <div className="bg-gray-300 h-3 w-24 rounded" />
        <div className="bg-gray-300 h-3 w-16 rounded" />
      </div>
    </div>
  );
};

export default ToolCardLoading;