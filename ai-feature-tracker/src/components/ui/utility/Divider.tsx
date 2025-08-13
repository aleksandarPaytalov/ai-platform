'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Divider props
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'default' | 'muted' | 'primary' | 'secondary';
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

// Divider component for visual separation with orientation options
const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({
    className,
    orientation = 'horizontal',
    variant = 'solid',
    size = 'md',
    color = 'default',
    label,
    labelPosition = 'center',
    ...props
  }, ref) => {
    
    // Size classes mapping
    const sizeClasses = {
      horizontal: {
        xs: 'h-px',
        sm: 'h-0.5',
        md: 'h-px',
        lg: 'h-0.5',
      },
      vertical: {
        xs: 'w-px',
        sm: 'w-0.5',
        md: 'w-px',
        lg: 'w-0.5',
      },
    };

    // Color classes mapping
    const colorClasses = {
      default: 'border-border bg-border',
      muted: 'border-muted bg-muted',
      primary: 'border-primary bg-primary',
      secondary: 'border-secondary bg-secondary',
    };

    // Variant classes mapping
    const variantClasses = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    // Label position classes
    const labelPositionClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    // Base divider classes
    const baseDividerClasses = [
      // Base styles
      'border-0',
      
      // Size styles based on orientation
      sizeClasses[orientation][size],
      
      // Color styles
      colorClasses[color],
      
      // Orientation styles
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      
      // Variant styles (using border for dashed/dotted)
      variant !== 'solid' && [
        orientation === 'horizontal' ? 'border-t' : 'border-l',
        variantClasses[variant],
        'bg-transparent',
      ],
    ];

    // Container classes for labeled dividers
    const containerClasses = [
      // Base container styles
      'flex items-center',
      
      // Orientation styles
      orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
      
      // Label position
      label && orientation === 'horizontal' && labelPositionClasses[labelPosition],
      
      // Custom className
      className,
    ];

    // Label classes
    const labelClasses = [
      'px-3 text-sm text-muted-foreground bg-background',
      'whitespace-nowrap select-none',
    ];

    // If no label, render simple divider
    if (!label) {
      return (
        <div
          className={cn(...baseDividerClasses, className)}
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          {...props}
        />
      );
    }

    // Render labeled divider
    if (orientation === 'horizontal') {
      return (
        <div
          className={cn(...containerClasses)}
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          {...props}
        >
          {/* Left divider (for center and right positions) */}
          {(labelPosition === 'center' || labelPosition === 'right') && (
            <div className={cn(...baseDividerClasses, 'flex-1')} />
          )}
          
          {/* Label */}
          <span className={cn(...labelClasses)}>
            {label}
          </span>
          
          {/* Right divider (for center and left positions) */}
          {(labelPosition === 'center' || labelPosition === 'left') && (
            <div className={cn(...baseDividerClasses, 'flex-1')} />
          )}
        </div>
      );
    }

    // Vertical labeled divider
    return (
      <div
        className={cn(...containerClasses)}
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        {...props}
      >
        {/* Top divider */}
        <div className={cn(...baseDividerClasses, 'flex-1')} />
        
        {/* Label */}
        <span className={cn(...labelClasses, 'py-2 px-0 rotate-90')}>
          {label}
        </span>
        
        {/* Bottom divider */}
        <div className={cn(...baseDividerClasses, 'flex-1')} />
      </div>
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };