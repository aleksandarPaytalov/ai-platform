'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for VisuallyHidden props
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

// VisuallyHidden component for screen reader only content
const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({
    className,
    asChild = false,
    children,
    ...props
  }, ref) => {
    
    // Screen reader only classes using standard sr-only pattern
    const srOnlyClasses = [
      // Visually hidden but accessible to screen readers
      'absolute w-px h-px p-0 -m-px overflow-hidden',
      'clip-path-[inset(50%)] border-0',
      // Alternative approach for broader browser support
      'sr-only',
      
      // Custom className
      className,
    ];

    if (asChild && React.isValidElement(children)) {
      const element = children as React.ReactElement<any>;
      return React.cloneElement(element, {
        className: cn(srOnlyClasses, (element.props as any).className),
        ref,
        ...(props as any),
      } as any);
    }

    return (
      <span
        className={cn(...srOnlyClasses)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };