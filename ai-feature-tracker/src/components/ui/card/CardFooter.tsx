'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for CardFooter props
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// CardFooter component for actions and metadata
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({
    className,
    justify = 'end',
    align = 'center',
    bordered = false,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    
    // Justify content classes mapping
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    // Align items classes mapping
    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    // Padding classes mapping
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Base footer classes
    const baseClasses = [
      // Base styles
      'flex items-center',
      
      // Layout styles
      justifyClasses[justify],
      alignClasses[align],
      
      // Padding styles
      paddingClasses[padding],
      
      // Bordered variant
      bordered && 'border-t',
      
      // Custom className
      className,
    ];

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { CardFooter };