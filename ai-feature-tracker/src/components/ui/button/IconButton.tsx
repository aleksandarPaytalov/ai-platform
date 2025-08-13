'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for IconButton props and variants
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon: React.ReactNode;
  'aria-label': string; // Required for accessibility
}

// IconButton component for icon-only buttons with proper accessibility
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({
    className,
    variant = 'ghost',
    size = 'md',
    loading = false,
    icon,
    disabled,
    type = 'button',
    onClick,
    'aria-label': ariaLabel,
    ...props
  }, ref) => {
    
    // Handle click events with proper typing and preventDefault when needed
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
    );

    // Size to dimension mapping for square buttons
    const sizeClasses = {
      xs: 'h-6 w-6 p-1',
      sm: 'h-8 w-8 p-1.5',
      md: 'h-10 w-10 p-2',
      lg: 'h-12 w-12 p-2.5',
      xl: 'h-14 w-14 p-3',
    };

    // Base button classes with variants and sizes
    const baseClasses = [
      // Base styles for icon buttons
      'inline-flex items-center justify-center whitespace-nowrap rounded-md',
      'font-medium ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'flex-shrink-0', // Prevent icon buttons from shrinking
      
      // Variant styles (excluding link variant for icon buttons)
      variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
      variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      
      // Size styles (square dimensions)
      sizeClasses[size],
      
      // Loading state
      loading && 'cursor-wait',
      
      // Custom className
      className,
    ];

    return (
      <button
        className={cn(...baseClasses)}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        aria-label={loading ? `${ariaLabel} (loading)` : ariaLabel}
        {...props}
      >
        {/* Icon or loading spinner */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <span className="flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };