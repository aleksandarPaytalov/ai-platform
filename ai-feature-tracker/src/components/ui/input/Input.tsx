'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Input props and validation
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

// Input component for text inputs with label and validation support
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    size = 'md',
    error = false,
    errorMessage,
    label,
    description,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    disabled,
    required,
    id,
    ...props
  }, ref) => {
    
    // Generate unique ID for accessibility
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    // Size classes mapping
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    // Base input classes
    const inputClasses = [
      // Base styles
      'flex w-full rounded-md border border-input bg-background',
      'ring-offset-background transition-colors',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      
      // Size styles
      sizeClasses[size],
      
      // Error state
      error && 'border-destructive focus-visible:ring-destructive',
      
      // Icon/addon padding adjustments
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      leftAddon && 'rounded-l-none border-l-0',
      rightAddon && 'rounded-r-none border-r-0',
      
      // Custom className
      className,
    ];

    // Container classes for addons
    const containerClasses = [
      'relative flex items-center',
      (leftAddon || rightAddon) && 'w-full',
    ];

    // Addon classes
    const addonClasses = [
      'flex items-center justify-center px-3 border border-input bg-muted text-muted-foreground',
      sizeClasses[size],
      error && 'border-destructive',
    ];

    // Icon container classes
    const iconClasses = [
      'absolute flex items-center justify-center w-10 h-full text-muted-foreground pointer-events-none',
      size === 'sm' && 'w-8',
      size === 'lg' && 'w-12',
    ];

    const InputElement = (
      <input
        className={cn(...inputClasses)}
        type={type}
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        aria-invalid={error}
        aria-describedby={cn(descriptionId, errorId)}
        {...props}
      />
    );

    const InputWithIcons = (
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className={cn(...iconClasses, 'left-0')}>
            {leftIcon}
          </div>
        )}
        
        {InputElement}
        
        {/* Right icon */}
        {rightIcon && (
          <div className={cn(...iconClasses, 'right-0')}>
            {rightIcon}
          </div>
        )}
      </div>
    );

    const InputWithAddons = leftAddon || rightAddon ? (
      <div className={cn(...containerClasses)}>
        {/* Left addon */}
        {leftAddon && (
          <div className={cn(...addonClasses, 'rounded-l-md border-r-0')}>
            {leftAddon}
          </div>
        )}
        
        {leftIcon || rightIcon ? InputWithIcons : InputElement}
        
        {/* Right addon */}
        {rightAddon && (
          <div className={cn(...addonClasses, 'rounded-r-md border-l-0')}>
            {rightAddon}
          </div>
        )}
      </div>
    ) : (leftIcon || rightIcon ? InputWithIcons : InputElement);

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        
        {/* Input field */}
        {InputWithAddons}
        
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

Input.displayName = 'Input';

export { Input };