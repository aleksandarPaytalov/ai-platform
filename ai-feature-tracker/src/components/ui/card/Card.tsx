'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Card props and variants
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  asChild?: boolean;
}

// Card component with header, body, and footer sections
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    interactive = false,
    // asChild reserved; prefix to satisfy lint
    asChild: _asChild = false,
    children,
    onClick,
    ...props
  }, ref) => {
    
    // Base card classes with variants
    const baseClasses = [
      // Base styles
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      'transition-colors duration-200',
      
      // Variant styles
      variant === 'default' && 'bg-card text-card-foreground',
      variant === 'elevated' && 'bg-card text-card-foreground shadow-lg hover:shadow-xl',
      variant === 'outlined' && 'bg-card text-card-foreground border-2',
      variant === 'filled' && 'bg-secondary text-secondary-foreground border-secondary',
      
      // Interactive styles
      interactive && [
        'cursor-pointer hover:bg-accent/50 focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:scale-[0.98] transition-transform duration-100',
      ],
      
      // Custom className
      className,
    ];

    // If interactive, make it keyboard accessible
    const interactiveProps = interactive ? {
      role: 'button',
      tabIndex: 0,
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          // Invoke click handler in a keyboard-friendly way
          onClick({} as unknown as React.MouseEvent<HTMLDivElement>);
        }
      },
    } : {};

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        onClick={onClick}
        {...interactiveProps}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };