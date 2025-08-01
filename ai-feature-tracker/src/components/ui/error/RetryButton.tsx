import React, { useState } from 'react';

export interface RetryButtonProps {
  /**
   * Function to call when retry is clicked
   */
  onRetry: () => void | Promise<void>;
  /**
   * Button text
   */
  children?: React.ReactNode;
  /**
   * Button size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button style variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Maximum number of retry attempts
   */
  maxAttempts?: number;
  /**
   * Current attempt number
   */
  currentAttempt?: number;
  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;
  /**
   * Whether to use exponential backoff
   */
  exponentialBackoff?: boolean;
  /**
   * Whether to show attempt counter
   */
  showAttempts?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show loading state during retry
   */
  showLoading?: boolean;
  /**
   * Callback when max attempts reached
   */
  onMaxAttemptsReached?: () => void;
}

/**
 * RetryButton - Button component with built-in retry logic and exponential backoff
 * 
 * Provides smart retry functionality with attempt counting, delays, and
 * exponential backoff. Similar to retry patterns in enterprise applications
 * for handling transient failures gracefully.
 */
export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  children = 'Try Again',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  maxAttempts = 3,
  currentAttempt = 0,
  retryDelay = 1000,
  exponentialBackoff = true,
  showAttempts = false,
  className = '',
  showLoading = true,
  onMaxAttemptsReached,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(currentAttempt);

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'px-3 py-1.5',
      textSize: 'text-xs',
      iconSize: 'w-3 h-3',
    },
    medium: {
      padding: 'px-4 py-2',
      textSize: 'text-sm',
      iconSize: 'w-4 h-4',
    },
    large: {
      padding: 'px-6 py-3',
      textSize: 'text-base',
      iconSize: 'w-5 h-5',
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      base: 'bg-blue-600 text-white border-blue-600',
      hover: 'hover:bg-blue-700 hover:border-blue-700',
      focus: 'focus:ring-blue-500',
      disabled: 'disabled:bg-blue-300 disabled:border-blue-300',
    },
    secondary: {
      base: 'bg-gray-600 text-white border-gray-600',
      hover: 'hover:bg-gray-700 hover:border-gray-700',
      focus: 'focus:ring-gray-500',
      disabled: 'disabled:bg-gray-300 disabled:border-gray-300',
    },
    outline: {
      base: 'bg-transparent text-blue-600 border-blue-600',
      hover: 'hover:bg-blue-50',
      focus: 'focus:ring-blue-500',
      disabled: 'disabled:text-blue-300 disabled:border-blue-300',
    },
    ghost: {
      base: 'bg-transparent text-blue-600 border-transparent',
      hover: 'hover:bg-blue-50',
      focus: 'focus:ring-blue-500',
      disabled: 'disabled:text-blue-300',
    },
  };

  const config = sizeConfig[size];
  const variantConf = variantConfig[variant];

  /**
   * Calculate delay with exponential backoff
   */
  const calculateDelay = (attempt: number): number => {
    if (!exponentialBackoff) return retryDelay;
    return retryDelay * Math.pow(2, attempt);
  };

  /**
   * Handle retry with delay and attempt counting
   */
  const handleRetry = async () => {
    if (disabled || isRetrying || attemptCount >= maxAttempts) {
      return;
    }

    setIsRetrying(true);
    const currentDelay = calculateDelay(attemptCount);

    try {
      // Add delay before retry (except for first attempt)
      if (attemptCount > 0) {
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }

      // Execute retry function
      await onRetry();
      
      // Reset attempt count on success
      setAttemptCount(0);
    } catch (error) {
      // Increment attempt count on failure
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      // Check if max attempts reached
      if (newAttemptCount >= maxAttempts && onMaxAttemptsReached) {
        onMaxAttemptsReached();
      }

      // Re-throw error so parent can handle it
      throw error;
    } finally {
      setIsRetrying(false);
    }
  };

  // Check if retry is available
  const canRetry = attemptCount < maxAttempts;
  const isDisabled = disabled || isRetrying || !canRetry;

  return (
    <button
      onClick={handleRetry}
      disabled={isDisabled}
      className={`
        ${config.padding}
        ${config.textSize}
        ${variantConf.base}
        ${variantConf.hover}
        ${variantConf.disabled}
        border
        rounded-md
        font-medium
        inline-flex
        items-center
        gap-2
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${variantConf.focus}
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
      type="button"
      aria-label={
        showAttempts 
          ? `Retry (${attemptCount}/${maxAttempts} attempts)` 
          : 'Retry operation'
      }
    >
      {/* Loading Spinner */}
      {isRetrying && showLoading && (
        <svg 
          className={`${config.iconSize} animate-spin`} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Retry Icon (when not loading) */}
      {!isRetrying && (
        <svg 
          className={config.iconSize} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      )}

      {/* Button Text */}
      <span>
        {isRetrying ? 'Retrying...' : children}
      </span>

      {/* Attempt Counter */}
      {showAttempts && canRetry && (
        <span className="text-xs opacity-75">
          ({attemptCount}/{maxAttempts})
        </span>
      )}
    </button>
  );
};

export default RetryButton;