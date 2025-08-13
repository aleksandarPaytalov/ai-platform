'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for StatusBadge props
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active' | 'inactive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  showIcon?: boolean;
  animated?: boolean;
}

// StatusBadge component for status indicators with semantic colors
const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({
    className,
    status,
    size = 'md',
    variant = 'default',
    showIcon = true,
    animated = false,
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

    // Icon size mapping
    const iconSizeClasses = {
      xs: 'h-2 w-2',
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-3.5 w-3.5',
    };

    // Status configuration with colors and default text
    const statusConfig = {
      success: {
        text: 'Success',
        icon: '✓',
        colors: {
          default: 'bg-green-100 text-green-800 border-green-200',
          outline: 'border border-green-300 text-green-700 bg-background',
          solid: 'bg-green-500 text-white',
        },
      },
      warning: {
        text: 'Warning',
        icon: '⚠',
        colors: {
          default: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          outline: 'border border-yellow-300 text-yellow-700 bg-background',
          solid: 'bg-yellow-500 text-white',
        },
      },
      error: {
        text: 'Error',
        icon: '✕',
        colors: {
          default: 'bg-red-100 text-red-800 border-red-200',
          outline: 'border border-red-300 text-red-700 bg-background',
          solid: 'bg-red-500 text-white',
        },
      },
      info: {
        text: 'Info',
        icon: 'ℹ',
        colors: {
          default: 'bg-blue-100 text-blue-800 border-blue-200',
          outline: 'border border-blue-300 text-blue-700 bg-background',
          solid: 'bg-blue-500 text-white',
        },
      },
      pending: {
        text: 'Pending',
        icon: '○',
        colors: {
          default: 'bg-gray-100 text-gray-800 border-gray-200',
          outline: 'border border-gray-300 text-gray-700 bg-background',
          solid: 'bg-gray-500 text-white',
        },
      },
      active: {
        text: 'Active',
        icon: '●',
        colors: {
          default: 'bg-green-100 text-green-800 border-green-200',
          outline: 'border border-green-300 text-green-700 bg-background',
          solid: 'bg-green-500 text-white',
        },
      },
      inactive: {
        text: 'Inactive',
        icon: '○',
        colors: {
          default: 'bg-gray-100 text-gray-600 border-gray-200',
          outline: 'border border-gray-300 text-gray-600 bg-background',
          solid: 'bg-gray-400 text-white',
        },
      },
    };

    const config = statusConfig[status];
    const displayText = children || config.text;

    // Base badge classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-full',
      'font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      
      // Size styles
      sizeClasses[size],
      
      // Color styles based on variant
      config.colors[variant],
      
      // Animation for pending/loading states
      animated && status === 'pending' && 'animate-pulse',
      
      // Custom className
      className,
    ];

    // Status icon component
    const StatusIcon = () => {
      if (status === 'pending' && animated) {
        return (
          <svg
            className={cn('animate-spin', iconSizeClasses[size])}
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
      }

      if (status === 'active' && animated) {
        return (
          <span 
            className={cn('animate-pulse', iconSizeClasses[size], 'rounded-full bg-current')}
            aria-hidden="true"
          />
        );
      }

      return (
        <span 
          className={cn('flex items-center justify-center', iconSizeClasses[size])}
          aria-hidden="true"
        >
          {config.icon}
        </span>
      );
    };

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        role="status"
        aria-label={`Status: ${displayText}`}
        {...props}
      >
        {/* Status icon */}
        {showIcon && (
          <span className="mr-1 flex-shrink-0">
            <StatusIcon />
          </span>
        )}
        
        {/* Status text */}
        <span className="truncate">
          {displayText}
        </span>
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };