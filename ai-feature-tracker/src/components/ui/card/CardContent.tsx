'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for CardContent props
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  maxHeight?: string;
}

// CardContent component for main card content with proper spacing
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({
    className,
    padding = 'md',
    scrollable = false,
    maxHeight,
    children,
    style,
    ...props
  }, ref) => {
    
    // Padding classes mapping
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Base content classes
    const baseClasses = [
      // Base styles
      'flex-1',
      
      // Padding styles
      paddingClasses[padding],
      
      // Scrollable styles
      scrollable && 'overflow-auto',
      
      // Custom className
      className,
    ];

    // Custom styles for max height
    const customStyle = {
      ...style,
      ...(maxHeight && { maxHeight }),
    };

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        style={customStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export { CardContent };