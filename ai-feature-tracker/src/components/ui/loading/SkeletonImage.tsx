import React from 'react';

export interface SkeletonImageProps {
  /**
   * Size variant for the skeleton image
   */
  size?: 'small' | 'medium' | 'large' | 'custom';
  /**
   * Aspect ratio for the image
   */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'banner';
  /**
   * Custom width (only used when size is 'custom')
   */
  width?: string;
  /**
   * Custom height (only used when size is 'custom')
   */
  height?: string;
  /**
   * Whether to show an icon placeholder in the center
   */
  showIcon?: boolean;
  /**
   * Border radius variant
   */
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SkeletonImage - Loading placeholder for image content
 * 
 * Provides image loading skeletons with proper aspect ratios and optional icon indicators.
 * Similar to how image placeholders work in photo galleries or media-heavy applications,
 * this maintains layout stability during loading.
 */
export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  size = 'medium',
  aspectRatio = 'video',
  width,
  height,
  showIcon = true,
  rounded = 'medium',
  className = '',
}) => {
  // Size configurations for common image sizes
  const sizeConfig = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    custom: width && height ? `w-${width} h-${height}` : 'w-full h-40',
  };

  // Aspect ratio configurations using Tailwind's aspect ratio utilities
  const aspectRatioConfig = {
    square: 'aspect-square',
    video: 'aspect-video', // 16:9
    portrait: 'aspect-[3/4]', // 3:4
    landscape: 'aspect-[4/3]', // 4:3
    banner: 'aspect-[3/1]', // 3:1 wide banner
  };

  // Border radius configurations
  const roundedConfig = {
    none: '',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  };

  // Use custom size or predefined size
  const sizeClasses = size === 'custom' && width && height 
    ? `w-[${width}] h-[${height}]`
    : sizeConfig[size];

  return (
    <div
      className={`
        bg-gray-300 
        ${sizeClasses}
        ${aspectRatioConfig[aspectRatio]}
        ${roundedConfig[rounded]}
        animate-pulse
        flex items-center justify-center
        relative
        overflow-hidden
        ${className}
      `}
      role="status"
      aria-hidden="true"
      aria-label="Loading image..."
    >
      {/* Optional icon placeholder */}
      {showIcon && (
        <div className="text-gray-400">
          {/* Simple image icon using SVG */}
          <svg
            className="w-8 h-8 md:w-12 md:h-12"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {/* Shimmer effect overlay for enhanced loading appearance */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-r 
          from-transparent 
          via-white 
          to-transparent
          opacity-20
          animate-pulse
        "
      />
    </div>
  );
};

export default SkeletonImage;