'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for ModalContent props
export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  maxHeight?: string;
  centered?: boolean;
}

// ModalContent component for scrollable modal body
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({
    className,
    padding = 'none',
    scrollable = true,
    maxHeight,
    centered = false,
    children,
    style,
    ...props
  }, ref) => {
    
    // Padding classes mapping
    const paddingClasses = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    // Base content classes
    const baseClasses = [
      // Base styles
      'flex-1',
      
      // Padding styles
      paddingClasses[padding],
      
      // Scrollable styles
      scrollable && 'overflow-auto',
      
      // Centered content
      centered && 'flex items-center justify-center',
      
      // Custom className
      className,
    ];

    // Custom styles for max height and scrolling
    const customStyle = {
      ...style,
      ...(maxHeight && { maxHeight }),
      ...(scrollable && !maxHeight && { maxHeight: '60vh' }), // Default max height for scrollable content
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

ModalContent.displayName = 'ModalContent';

export { ModalContent };