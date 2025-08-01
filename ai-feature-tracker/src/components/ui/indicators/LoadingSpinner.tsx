import React from 'react';

export interface LoadingSpinnerProps {
  /**
   * Size variant for the spinner
   */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /**
   * Color variant for the spinner
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'success' | 'warning' | 'error';
  /**
   * Whether to show loading text
   */
  showText?: boolean;
  /**
   * Custom loading text
   */
  text?: string;
  /**
   * Text position relative to spinner
   */
  textPosition?: 'right' | 'bottom';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to center the spinner
   */
  centered?: boolean;
}

/**
 * LoadingSpinner - Animated spinner for loading states
 * 
 * Provides customizable spinning indicators for various loading contexts.
 * Similar to progress indicators in desktop applications, with size and color
 * variants to match different UI contexts and brand requirements.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  showText = false,
  text = 'Loading...',
  textPosition = 'right',
  className = '',
  centered = false,
}) => {
  // Size configurations
  const sizeConfig = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Color configurations for the spinner border
  const colorConfig = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white',
    gray: 'border-gray-400',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
  };

  // Text color configurations
  const textColorConfig = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  // Layout classes based on text position
  const layoutClasses = showText
    ? textPosition === 'bottom'
      ? 'flex flex-col items-center gap-2'
      : 'flex items-center gap-2'
    : 'flex items-center justify-center';

  // Centering wrapper
  const wrapperClasses = centered
    ? 'flex items-center justify-center w-full h-full'
    : '';

  const spinnerElement = (
    <div
      className={`
        ${sizeConfig[size]}
        border-2 border-gray-200 
        ${colorConfig[color]}
        border-t-transparent
        rounded-full
        animate-spin
      `}
      role="status"
      aria-hidden={showText ? 'true' : 'false'}
      aria-label={showText ? undefined : text}
    />
  );

  const content = (
    <div className={`${layoutClasses} ${className}`}>
      {spinnerElement}
      {showText && (
        <span 
          className={`text-sm ${textColorConfig[color]}`}
          aria-live="polite"
        >
          {text}
        </span>
      )}
    </div>
  );

  return wrapperClasses ? (
    <div className={wrapperClasses}>
      {content}
    </div>
  ) : content;
};

export default LoadingSpinner;