'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for ButtonGroup props and variants
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'attached' | 'separated';
  disabled?: boolean;
}

// ButtonGroup component for grouped button layouts
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({
    className,
    orientation = 'horizontal',
    size = 'md',
    variant = 'default',
    disabled = false,
    children,
    ...props
  }, ref) => {
    
    // Base group classes
    const baseClasses = [
      'inline-flex',
      
      // Orientation styles
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      
      // Variant styles
      variant === 'attached' && orientation === 'horizontal' && '[&>*:not(:first-child)]:ml-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:last-child)]:border-r-0',
      variant === 'attached' && orientation === 'vertical' && '[&>*:not(:first-child)]:mt-0 [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:last-child)]:border-b-0',
      
      variant === 'separated' && orientation === 'horizontal' && 'space-x-2',
      variant === 'separated' && orientation === 'vertical' && 'space-y-2',
      
      // Disabled state
      disabled && 'pointer-events-none opacity-50',
      
      // Custom className
      className,
    ];

    // Clone children and apply consistent sizing and disabled state
    const processedChildren = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        // Apply size and disabled props to button children
        if (child.type && typeof child.type === 'object' && 'displayName' in child.type) {
          const displayName = (child.type as any).displayName;
          if (displayName === 'Button' || displayName === 'IconButton') {
            return React.cloneElement(child, {
              size: child.props.size || size,
              disabled: child.props.disabled || disabled,
              key: child.key || index,
            });
          }
        }
        
        // For other elements, just add the key
        return React.cloneElement(child, {
          key: child.key || index,
        });
      }
      return child;
    });

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        role="group"
        aria-disabled={disabled}
        {...props}
      >
        {processedChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };