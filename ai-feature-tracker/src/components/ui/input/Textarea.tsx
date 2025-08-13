'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Textarea props and validation
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
}

// Textarea component for multi-line text input
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    error = false,
    errorMessage,
    label,
    description,
    resize = 'vertical',
    autoResize = false,
    disabled,
    required,
    id,
    rows = 3,
    onChange,
    ...props
  }, ref) => {
    
    // Generate unique ID for accessibility
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${textareaId}-description` : undefined;
    const errorId = errorMessage ? `${textareaId}-error` : undefined;

    // Handle auto-resize functionality
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = event.target;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }
      onChange?.(event);
    };

    // Resize classes mapping
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    // Base textarea classes
    const textareaClasses = [
      // Base styles
      'flex min-h-[80px] w-full rounded-md border border-input bg-background',
      'px-3 py-2 text-sm ring-offset-background transition-colors',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      
      // Resize behavior
      resizeClasses[resize],
      
      // Auto-resize behavior
      autoResize && 'overflow-hidden',
      
      // Error state
      error && 'border-destructive focus-visible:ring-destructive',
      
      // Custom className
      className,
    ];

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        
        {/* Textarea field */}
        <textarea
          className={cn(...textareaClasses)}
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={cn(descriptionId, errorId)}
          onChange={handleChange}
          {...props}
        />
        
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

Textarea.displayName = 'Textarea';

export { Textarea };