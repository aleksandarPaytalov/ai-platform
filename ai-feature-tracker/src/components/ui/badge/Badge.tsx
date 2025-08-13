'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Badge props and variants
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Badge component for status indicators and counts
const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    removable = false,
    onRemove,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    
    // Size classes mapping
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs h-4',
      sm: 'px-2 py-0.5 text-xs h-5',
      md: 'px-2.5 py-1 text-sm h-6',
      lg: 'px-3 py-1 text-sm h-7',
    };

    // Variant classes mapping
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      success: 'bg-green-500 text-white hover:bg-green-600',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      error: 'bg-red-500 text-white hover:bg-red-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border border-input bg-background text-foreground hover:bg-accent',
    };

    // Base badge classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-full',
      'font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      
      // Size styles
      sizeClasses[size],
      
      // Variant styles
      variantClasses[variant],
      
      // Removable styles
      removable && 'pr-1',
      
      // Custom className
      className,
    ];

    // Remove button icon
    const RemoveIcon = () => (
      <svg
        className="ml-1 h-3 w-3 cursor-pointer hover:opacity-70 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        aria-label="Remove badge"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }
        }}
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    );

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        {...props}
      >
        {/* Left icon */}
        {leftIcon && (
          <span className="mr-1 flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {/* Badge content */}
        <span className="truncate">
          {children}
        </span>
        
        {/* Right icon */}
        {rightIcon && !removable && (
          <span className="ml-1 flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        
        {/* Remove button */}
        {removable && <RemoveIcon />}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };