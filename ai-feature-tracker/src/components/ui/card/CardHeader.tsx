'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for CardHeader props
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  bordered?: boolean;
}

// CardHeader component with title, subtitle, and action areas
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({
    className,
    title,
    subtitle,
    action,
    bordered = false,
    children,
    ...props
  }, ref) => {
    
    // Base header classes
    const baseClasses = [
      // Base styles
      'flex flex-col space-y-1.5 p-6',
      
      // Bordered variant
      bordered && 'border-b',
      
      // Custom className
      className,
    ];

    // If we have both content and action, use flex layout
    const hasAction = action !== undefined;
    const hasContent = title || subtitle || children;

    return (
      <div
        className={cn(
          ...baseClasses,
          hasAction && hasContent && 'sm:flex-row sm:items-start sm:justify-between sm:space-y-0'
        )}
        ref={ref}
        {...props}
      >
        {/* Main content area */}
        {hasContent && (
          <div className="flex flex-col space-y-1.5 min-w-0 flex-1">
            {/* Title */}
            {title && (
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
            
            {/* Custom children content */}
            {children}
          </div>
        )}
        
        {/* Action area */}
        {action && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export { CardHeader };