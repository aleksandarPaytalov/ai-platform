'use client';

import React, { forwardRef, useState } from 'react';
import { Button, ButtonProps } from './Button';

// TypeScript interfaces for LoadingButton props extending Button
export interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  onAsyncClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  loadingText?: string;
  loadingTimeout?: number; // Auto-reset loading state after timeout
}

// LoadingButton component with automatic loading state management
const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({
    onAsyncClick,
    onClick,
    loadingText,
    loadingTimeout = 10000, // 10 second default timeout
    children,
    disabled,
    ...props
  }, ref) => {
    
    const [isLoading, setIsLoading] = useState(false);

    // Handle async operations with loading state management
    const handleAsyncClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) {
        event.preventDefault();
        return;
      }

      // If onAsyncClick is provided, handle the async operation
      if (onAsyncClick) {
        setIsLoading(true);
        
        // Set up timeout to prevent infinite loading state
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, loadingTimeout);

        try {
          await onAsyncClick(event);
        } catch (error) {
          // Log error but don't throw to prevent unhandled promise rejection
          console.error('LoadingButton async operation failed:', error);
        } finally {
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      } else if (onClick) {
        // Fall back to regular onClick if no async handler
        onClick(event);
      }
    };

    // Determine what text to show
    const buttonText = isLoading && loadingText ? loadingText : children;

    return (
      <Button
        ref={ref}
        loading={isLoading}
        disabled={disabled || isLoading}
        onClick={handleAsyncClick}
        {...props}
      >
        {buttonText}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };