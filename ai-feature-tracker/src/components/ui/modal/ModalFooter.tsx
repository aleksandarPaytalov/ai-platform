'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for ModalFooter props
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

// ModalFooter component for action buttons
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({
    className,
    justify = 'end',
    align = 'center',
    bordered = true,
    padding = 'md',
    direction = 'row',
    gap = 'md',
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
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    // Direction classes mapping
    const directionClasses = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };

    // Gap classes mapping
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    };

    // Base footer classes
    const baseClasses = [
      // Base styles
      'flex',
      
      // Direction styles
      directionClasses[direction],
      
      // Layout styles
      justifyClasses[justify],
      alignClasses[align],
      
      // Gap styles
      gapClasses[gap],
      
      // Padding styles
      paddingClasses[padding],
      
      // Bordered variant
      bordered && 'border-t pt-4 mt-4',
      
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

ModalFooter.displayName = 'ModalFooter';

export { ModalFooter };