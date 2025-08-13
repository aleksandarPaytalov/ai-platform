'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Checkbox props and validation
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Checkbox component with indeterminate state support
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    error = false,
    errorMessage,
    label,
    description,
    indeterminate = false,
    size = 'md',
    disabled,
    required,
    checked,
    id,
    ...props
  }, ref) => {
    
    // Generate unique ID for accessibility
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = errorMessage ? `${checkboxId}-error` : undefined;

    // Size classes mapping
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    // Base checkbox classes
    const checkboxClasses = [
      // Base styles
      'peer shrink-0 rounded-sm border border-primary shadow',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
      
      // Size styles
      sizeClasses[size],
      
      // Error state
      error && 'border-destructive focus-visible:ring-destructive',
      
      // Custom className
      className,
    ];

    // Icons for checked and indeterminate states
    const CheckIcon = () => (
      <svg
        className={cn('text-current', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 12 2 2 4-4" />
      </svg>
    );

    const IndeterminateIcon = () => (
      <svg
        className={cn('text-current', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    );

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          {/* Checkbox container */}
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className={cn(...checkboxClasses)}
              ref={ref}
              id={checkboxId}
              checked={indeterminate ? false : checked}
              disabled={disabled}
              required={required}
              aria-invalid={error}
              aria-describedby={cn(descriptionId, errorId)}
              data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
              {...props}
            />
            
            {/* Custom checkbox indicator */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center pointer-events-none',
                'opacity-0 peer-data-[state=checked]:opacity-100 peer-data-[state=indeterminate]:opacity-100',
                'transition-opacity'
              )}
            >
              {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
            </div>
          </div>
          
          {/* Label and content */}
          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    'text-sm font-medium leading-none cursor-pointer',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    required && "after:content-['*'] after:ml-0.5 after:text-destructive"
                  )}
                >
                  {label}
                </label>
              )}
              
              {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };