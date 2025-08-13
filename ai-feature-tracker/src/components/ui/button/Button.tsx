'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { componentSizes, variants } from '@/lib/design-system';

// TypeScript interfaces for Button props and variants
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Button component with all variants, sizes, and accessibility features
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    type = 'button',
    onClick,
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
        className="animate-spin -ml-1 mr-2 h-4 w-4"
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

    // Base button classes with variants and sizes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-md',
      'text-sm font-medium ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      
      // Variant styles
      variants.button.variant[variant],
      
      // Size styles
      variants.button.size[size],
      
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
        {...props}
      >
        {/* Left icon or loading spinner */}
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="mr-2 flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        
        {/* Button content */}
        {children}
        
        {/* Right icon */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };