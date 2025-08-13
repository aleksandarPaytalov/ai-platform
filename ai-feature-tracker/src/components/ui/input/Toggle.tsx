'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Toggle props and validation
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  onText?: string;
  offText?: string;
}

// Toggle component for boolean switches
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({
    className,
    error = false,
    errorMessage,
    label,
    description,
    size = 'md',
    variant = 'default',
    onText,
    offText,
    disabled,
    required,
    checked,
    id,
    ...props
  }, ref) => {
    
    // Generate unique ID for accessibility
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${toggleId}-description` : undefined;
    const errorId = errorMessage ? `${toggleId}-error` : undefined;

    // Size classes mapping
    const sizeClasses = {
      sm: {
        track: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translate: 'translate-x-3',
        text: 'text-xs',
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4',
        text: 'text-sm',
      },
      lg: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
        text: 'text-base',
      },
    };

    // Variant classes mapping
    const variantClasses = {
      default: {
        track: checked 
          ? 'bg-primary border-primary' 
          : 'bg-input border-input',
        thumb: 'bg-background shadow-sm',
      },
      outline: {
        track: checked 
          ? 'bg-background border-primary' 
          : 'bg-background border-input',
        thumb: checked 
          ? 'bg-primary' 
          : 'bg-muted',
      },
    };

    // Base toggle classes
    const trackClasses = [
      // Base track styles
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2',
      'transition-colors duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      
      // Size styles
      sizeClasses[size].track,
      
      // Variant styles
      variantClasses[variant].track,
      
      // Error state
      error && 'border-destructive focus-visible:ring-destructive',
    ];

    const thumbClasses = [
      // Base thumb styles
      'pointer-events-none block rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      
      // Size styles
      sizeClasses[size].thumb,
      
      // Position and transform
      checked ? sizeClasses[size].translate : 'translate-x-0',
      
      // Variant styles
      variantClasses[variant].thumb,
    ];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {/* Label */}
          {label && (
            <label
              htmlFor={toggleId}
              className={cn(
                'text-sm font-medium leading-none cursor-pointer',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                sizeClasses[size].text,
                required && "after:content-['*'] after:ml-0.5 after:text-destructive"
              )}
            >
              {label}
            </label>
          )}
          
          {/* Toggle switch container */}
          <div className="flex items-center space-x-2">
            {/* Off text */}
            {offText && (
              <span className={cn(
                'text-muted-foreground transition-opacity',
                sizeClasses[size].text,
                checked && 'opacity-50'
              )}>
                {offText}
              </span>
            )}
            
            {/* Hidden checkbox for form submission and accessibility */}
            <input
              type="checkbox"
              className="sr-only"
              ref={ref}
              id={toggleId}
              checked={checked}
              disabled={disabled}
              required={required}
              aria-invalid={error}
              aria-describedby={cn(descriptionId, errorId)}
              {...props}
            />
            
            {/* Visual toggle switch */}
            <label
              htmlFor={toggleId}
              className={cn(...trackClasses)}
              data-state={checked ? 'checked' : 'unchecked'}
              role="switch"
              aria-checked={checked}
              aria-labelledby={label ? `${toggleId}-label` : undefined}
            >
              <span className={cn(...thumbClasses)} />
            </label>
            
            {/* On text */}
            {onText && (
              <span className={cn(
                'text-muted-foreground transition-opacity',
                sizeClasses[size].text,
                !checked && 'opacity-50'
              )}>
                {onText}
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
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

Toggle.displayName = 'Toggle';

export { Toggle };