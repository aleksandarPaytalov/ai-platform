import React from 'react';

export interface PulsingDotProps {
  /**
   * Size variant for the pulsing dot
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant for the dot
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  /**
   * Animation speed
   */
  speed?: 'slow' | 'normal' | 'fast';
  /**
   * Whether to show multiple dots in sequence
   */
  variant?: 'single' | 'triple' | 'ripple';
  /**
   * Position of optional label text
   */
  labelPosition?: 'none' | 'right' | 'left' | 'top' | 'bottom';
  /**
   * Label text to display
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PulsingDot - Subtle loading indicator with pulsing animation
 * 
 * Provides minimal, non-intrusive loading indicators perfect for
 * status indicators, real-time updates, or background operations.
 * Similar to activity indicators in desktop applications.
 */
export const PulsingDot: React.FC<PulsingDotProps> = ({
  size = 'medium',
  color = 'primary',
  speed = 'normal',
  variant = 'single',
  labelPosition = 'none',
  label = 'Loading',
  className = '',
}) => {
  // Size configurations
  const sizeConfig = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  // Color configurations
  const colorConfig = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    gray: 'bg-gray-400',
  };

  // Animation speed configurations
  const speedConfig = {
    slow: 'animate-pulse duration-[2s]',
    normal: 'animate-pulse',
    fast: 'animate-pulse duration-[0.5s]',
  };

  // Text color for labels
  const textColorConfig = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    gray: 'text-gray-500',
  };

  /**
   * Render single pulsing dot
   */
  const renderSingleDot = (delay = 0) => (
    <div
      className={`
        ${sizeConfig[size]}
        ${colorConfig[color]}
        rounded-full
        ${speedConfig[speed]}
      `}
      style={{
        animationDelay: `${delay}ms`,
      }}
      role="status"
      aria-hidden="true"
    />
  );

  /**
   * Render triple dots with staggered animation
   */
  const renderTripleDots = () => (
    <div className="flex items-center gap-1">
      {renderSingleDot(0)}
      {renderSingleDot(200)}
      {renderSingleDot(400)}
    </div>
  );

  /**
   * Render ripple effect (concentric circles)
   */
  const renderRipple = () => (
    <div className="relative flex items-center justify-center">
      {/* Outer ripple */}
      <div
        className={`
          absolute
          ${sizeConfig[size === 'small' ? 'large' : size === 'medium' ? 'large' : 'large']}
          ${colorConfig[color]}
          rounded-full
          opacity-20
          animate-ping
        `}
        style={{ animationDuration: '2s' }}
      />
      
      {/* Middle ripple */}
      <div
        className={`
          absolute
          ${sizeConfig[size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'large']}
          ${colorConfig[color]}
          rounded-full
          opacity-40
          animate-ping
        `}
        style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}
      />
      
      {/* Center dot */}
      {renderSingleDot()}
    </div>
  );

  /**
   * Get the main indicator based on variant
   */
  const getIndicator = () => {
    switch (variant) {
      case 'triple':
        return renderTripleDots();
      case 'ripple':
        return renderRipple();
      case 'single':
      default:
        return renderSingleDot();
    }
  };

  /**
   * Get layout classes based on label position
   */
  const getLayoutClasses = () => {
    if (labelPosition === 'none') return 'flex items-center justify-center';
    
    switch (labelPosition) {
      case 'right':
        return 'flex items-center gap-2';
      case 'left':
        return 'flex items-center gap-2 flex-row-reverse';
      case 'top':
        return 'flex flex-col items-center gap-1';
      case 'bottom':
        return 'flex flex-col-reverse items-center gap-1';
      default:
        return 'flex items-center justify-center';
    }
  };

  return (
    <div 
      className={`${getLayoutClasses()} ${className}`}
      role="status"
      aria-label={labelPosition !== 'none' ? undefined : label}
    >
      {getIndicator()}
      
      {labelPosition !== 'none' && label && (
        <span 
          className={`text-xs ${textColorConfig[color]}`}
          aria-live="polite"
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default PulsingDot;