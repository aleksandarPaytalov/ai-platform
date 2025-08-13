'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for CountBadge props
export interface CountBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showZero?: boolean;
  animated?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
}

// CountBadge component for numerical indicators
const CountBadge = forwardRef<HTMLDivElement, CountBadgeProps>(
  ({
    className,
    count,
    max = 99,
    size = 'md',
    variant = 'default',
    showZero = false,
    animated = false,
    position = 'inline',
    children,
    ...props
  }, ref) => {
    
    // Don't render if count is 0 and showZero is false
    if (count === 0 && !showZero) {
      return children ? (
        <div className="relative inline-block">
          {children}
        </div>
      ) : null;
    }

    // Format count display
    const displayCount = count > max ? `${max}+` : count.toString();

    // Size classes mapping
    const sizeClasses = {
      xs: {
        badge: 'min-w-[16px] h-4 px-1 text-xs',
        positioned: 'min-w-[12px] h-3 text-[10px]',
      },
      sm: {
        badge: 'min-w-[20px] h-5 px-1.5 text-xs',
        positioned: 'min-w-[16px] h-4 text-xs',
      },
      md: {
        badge: 'min-w-[24px] h-6 px-2 text-sm',
        positioned: 'min-w-[20px] h-5 text-xs',
      },
      lg: {
        badge: 'min-w-[28px] h-7 px-2.5 text-sm',
        positioned: 'min-w-[24px] h-6 text-sm',
      },
    };

    // Variant classes mapping
    const variantClasses = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    };

    // Position classes mapping
    const positionClasses = {
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
      'inline': '',
    };

    // Base badge classes
    const badgeClasses = [
      // Base styles
      'inline-flex items-center justify-center rounded-full',
      'font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'whitespace-nowrap',
      
      // Size styles
      position === 'inline' 
        ? sizeClasses[size].badge 
        : sizeClasses[size].positioned,
      
      // Variant styles
      variantClasses[variant],
      
      // Position styles
      position !== 'inline' && 'absolute z-10',
      position !== 'inline' && positionClasses[position],
      
      // Animation styles
      animated && 'animate-pulse',
      
      // Custom className
      className,
    ];

    // Badge element
    const BadgeElement = (
      <div
        className={cn(...badgeClasses)}
        ref={ref}
        role="status"
        aria-label={`Count: ${count}`}
        {...props}
      >
        {displayCount}
      </div>
    );

    // If position is inline or no children, just return the badge
    if (position === 'inline' || !children) {
      return BadgeElement;
    }

    // Return children with positioned badge
    return (
      <div className="relative inline-block">
        {children}
        {BadgeElement}
      </div>
    );
  }
);

CountBadge.displayName = 'CountBadge';

export { CountBadge };