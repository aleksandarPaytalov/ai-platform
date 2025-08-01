import React from 'react';

export interface SkeletonTextProps {
  /**
   * Number of lines to display
   */
  lines?: number;
  /**
   * Size variant for text skeleton
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Width pattern for lines
   */
  widthPattern?: 'uniform' | 'varied' | 'decreasing';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Spacing between lines
   */
  spacing?: 'tight' | 'normal' | 'loose';
}

/**
 * SkeletonText - Loading placeholder for text content
 * 
 * Provides realistic text loading skeletons with varied line lengths,
 * similar to how you'd show loading states for text-heavy content in desktop applications.
 * Uses mathematical patterns to create natural-looking text placeholders.
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  size = 'medium',
  widthPattern = 'varied',
  className = '',
  spacing = 'normal',
}) => {
  // Size configurations for different text contexts
  const sizeConfig = {
    small: {
      height: 'h-3',
      rounded: 'rounded-sm',
    },
    medium: {
      height: 'h-4',
      rounded: 'rounded',
    },
    large: {
      height: 'h-5',
      rounded: 'rounded-md',
    },
  };

  // Spacing configurations
  const spacingConfig = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3',
  };

  const config = sizeConfig[size];

  /**
   * Generate width class based on pattern and line index
   * This creates natural-looking text variation similar to real content
   */
  const getLineWidth = (index: number): string => {
    switch (widthPattern) {
      case 'uniform':
        return 'w-full';
      
      case 'decreasing':
        // Progressively shorter lines
        const decreaseWidths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/6', 'w-2/6'];
        return decreaseWidths[Math.min(index, decreaseWidths.length - 1)];
      
      case 'varied':
      default:
        // Natural variation mimicking real text
        const variedWidths = [
          'w-full', 'w-11/12', 'w-5/6', 'w-4/5', 'w-3/4', 
          'w-2/3', 'w-3/5', 'w-1/2', 'w-2/5'
        ];
        
        // Use a pseudo-random but consistent pattern
        const seedIndex = (index * 7 + 3) % variedWidths.length;
        return variedWidths[seedIndex];
    }
  };

  return (
    <div
      className={`${spacingConfig[spacing]} ${className}`}
      role="status"
      aria-hidden="true"
      aria-label={`Loading ${lines} lines of text...`}
    >
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`
            bg-gray-300 
            ${config.height} 
            ${getLineWidth(index)} 
            ${config.rounded}
            animate-pulse
          `}
        />
      ))}
    </div>
  );
};

export default SkeletonText;