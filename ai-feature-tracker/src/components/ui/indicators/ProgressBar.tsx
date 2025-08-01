import React from 'react';

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Size variant for the progress bar
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant for the progress bar
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /**
   * Whether to show percentage text
   */
  showPercentage?: boolean;
  /**
   * Whether to show progress text label
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: string;
  /**
   * Progress bar style variant
   */
  variant?: 'default' | 'striped' | 'animated';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the progress is indeterminate (continuous animation)
   */
  indeterminate?: boolean;
}

/**
 * ProgressBar - Visual progress indicator for longer operations
 * 
 * Provides progress visualization for file uploads, data processing, or any
 * operation with measurable progress. Similar to progress controls in
 * desktop applications with multiple visual styles and animations.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'medium',
  color = 'primary',
  showPercentage = false,
  showLabel = false,
  label = 'Loading',
  variant = 'default',
  className = '',
  indeterminate = false,
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.max(0, Math.min(100, value));
  const percentage = indeterminate ? 30 : clampedValue; // Fixed width for indeterminate

  // Size configurations
  const sizeConfig = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  };

  // Color configurations
  const colorConfig = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  // Background color (lighter version)
  const backgroundConfig = {
    primary: 'bg-blue-100',
    secondary: 'bg-gray-200',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
  };

  // Variant styles
  const getVariantClasses = () => {
    const baseClasses = `${colorConfig[color]} transition-all duration-300 ease-out`;
    
    switch (variant) {
      case 'striped':
        return `${baseClasses} bg-gradient-to-r from-transparent via-white to-transparent bg-[length:1rem_1rem] opacity-75`;
      
      case 'animated':
        return `${baseClasses} bg-gradient-to-r from-current via-white to-current bg-[length:2rem_100%] animate-pulse`;
      
      default:
        return baseClasses;
    }
  };

  // Indeterminate animation
  const indeterminateClasses = indeterminate
    ? 'animate-pulse absolute inset-0'
    : 'relative';

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Label and Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {showLabel && (
            <span className="text-gray-700 font-medium">
              {label}
            </span>
          )}
          {showPercentage && !indeterminate && (
            <span className="text-gray-600 tabular-nums">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`
          w-full 
          ${sizeConfig[size]} 
          ${backgroundConfig[color]}
          rounded-full 
          overflow-hidden
          relative
        `}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${indeterminate ? 'Loading' : `${Math.round(clampedValue)}% complete`}`}
      >
        {/* Progress Fill */}
        <div
          className={`
            ${sizeConfig[size]}
            ${getVariantClasses()}
            rounded-full
            ${indeterminateClasses}
          `}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
            transform: indeterminate ? 'translateX(-70%)' : undefined,
            animation: indeterminate 
              ? 'progress-indeterminate 1.5s ease-in-out infinite' 
              : undefined,
          }}
        />
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {indeterminate 
          ? `${label} in progress` 
          : `${label} ${Math.round(clampedValue)}% complete`
        }
      </div>

      {/* Custom CSS for indeterminate animation */}
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;