import React from 'react';

export interface SkeletonButtonProps {
  /**
   * Size variant for the skeleton button
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Width of the button
   */
  width?: 'auto' | 'full' | 'fit' | 'custom';
  /**
   * Custom width class (only used when width is 'custom')
   */
  customWidth?: string;
  /**
   * Whether the button is rounded
   */
  rounded?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show an icon placeholder
   */
  showIcon?: boolean;
}

/**
 * SkeletonButton - Loading placeholder for button elements
 * 
 * Provides button loading skeletons that match common button styles and sizes.
 * Useful for maintaining layout during form loading or when action buttons are being prepared.
 * Similar to placeholder controls in desktop applications during initialization.
 */
export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'medium',
  variant = 'primary',
  width = 'auto',
  customWidth,
  rounded = true,
  className = '',
  showIcon = false,
}) => {
  // Size configurations matching common button dimensions
  const sizeConfig = {
    small: {
      height: 'h-8',
      padding: 'px-3',
      minWidth: 'min-w-[60px]',
      iconSize: 'w-3 h-3',
    },
    medium: {
      height: 'h-10',
      padding: 'px-4',
      minWidth: 'min-w-[80px]',
      iconSize: 'w-4 h-4',
    },
    large: {
      height: 'h-12',
      padding: 'px-6',
      minWidth: 'min-w-[100px]',
      iconSize: 'w-5 h-5',
    },
  };

  // Variant configurations to match different button styles
  const variantConfig = {
    primary: 'bg-blue-300',
    secondary: 'bg-gray-300',
    outline: 'bg-gray-200 border border-gray-300',
    ghost: 'bg-gray-100',
  };

  // Width configurations
  const widthConfig = {
    auto: '',
    full: 'w-full',
    fit: 'w-fit',
    custom: customWidth || 'w-24',
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`
        ${variantConfig[variant]}
        ${config.height}
        ${config.padding}
        ${widthConfig[width]}
        ${config.minWidth}
        ${rounded ? 'rounded-md' : ''}
        animate-pulse
        flex items-center justify-center gap-2
        ${className}
      `}
      role="status"
      aria-hidden="true"
      aria-label="Loading button..."
    >
      {/* Icon placeholder */}
      {showIcon && (
        <div className={`bg-gray-400 ${config.iconSize} rounded-sm`} />
      )}
      
      {/* Button text placeholder */}
      <div
        className={`
          bg-gray-400 
          h-4 
          ${width === 'full' ? 'w-20' : 'flex-1 max-w-[60px]'}
          rounded-sm
        `}
      />
    </div>
  );
};

export default SkeletonButton;