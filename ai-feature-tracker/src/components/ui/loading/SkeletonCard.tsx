import React from 'react';

export interface SkeletonCardProps {
  /**
   * Size variant for the skeleton card
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show image placeholder
   */
  showImage?: boolean;
  /**
   * Whether to show action buttons placeholder
   */
  showActions?: boolean;
  /**
   * Number of text lines to show
   */
  textLines?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to use rounded corners
   */
  rounded?: boolean;
}

/**
 * SkeletonCard - Loading placeholder for card-shaped content
 * 
 * This component provides a skeleton loading state for card layouts,
 * similar to how you'd create placeholder controls in WPF during data loading.
 * It uses Tailwind's animation utilities for smooth pulsing effects.
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  size = 'medium',
  showImage = true,
  showActions = false,
  textLines = 3,
  className = '',
  rounded = true,
}) => {
  // Size configurations similar to responsive design principles
  const sizeConfig = {
    small: {
      padding: 'p-3',
      imageHeight: 'h-32',
      spacing: 'space-y-2',
      textHeight: 'h-3',
    },
    medium: {
      padding: 'p-4',
      imageHeight: 'h-40',
      spacing: 'space-y-3',
      textHeight: 'h-4',
    },
    large: {
      padding: 'p-6',
      imageHeight: 'h-48',
      spacing: 'space-y-4',
      textHeight: 'h-4',
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`
        bg-white border border-gray-200 
        ${config.padding} 
        ${config.spacing}
        ${rounded ? 'rounded-lg' : ''}
        animate-pulse
        ${className}
      `}
      role="status"
      aria-hidden="true"
      aria-label="Loading content..."
    >
      {/* Image placeholder - similar to placeholder image controls */}
      {showImage && (
        <div
          className={`
            bg-gray-300 
            ${config.imageHeight} 
            w-full 
            ${rounded ? 'rounded-md' : ''}
          `}
        />
      )}

      {/* Content area with text lines */}
      <div className={config.spacing}>
        {/* Title placeholder - wider than other lines */}
        <div className={`bg-gray-300 ${config.textHeight} w-3/4 rounded`} />
        
        {/* Text content placeholders */}
        {Array.from({ length: textLines }, (_, index) => {
          // Vary line widths for realistic appearance
          const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-2/3'];
          const width = widths[index % widths.length];
          
          return (
            <div
              key={index}
              className={`bg-gray-300 ${config.textHeight} ${width} rounded`}
            />
          );
        })}
      </div>

      {/* Action buttons placeholder */}
      {showActions && (
        <div className="flex gap-2 pt-2">
          <div className="bg-gray-300 h-8 w-20 rounded" />
          <div className="bg-gray-300 h-8 w-16 rounded" />
        </div>
      )}
    </div>
  );
};

export default SkeletonCard;