'use client';

import React, { forwardRef, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Radio and RadioGroup
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
  error?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
}

// Context for RadioGroup state management
interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

// Hook to use RadioGroup context
const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
};

// Radio component with group management
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({
    className,
    value,
    error: propError,
    label,
    description,
    size: propSize = 'md',
    disabled: propDisabled,
    id,
    ...props
  }, ref) => {
    
    const context = useRadioGroup();
    const disabled = propDisabled || context.disabled;
    const error = propError || context.error;
    const size = propSize || context.size || 'md';
    const isChecked = context.value === value;

    // Generate unique ID for accessibility
    const radioId = id || `radio-${value}-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${radioId}-description` : undefined;

    // Handle radio selection
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && event.target.checked) {
        context.onChange?.(value);
      }
    };

    // Size classes mapping
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    // Base radio classes
    const radioClasses = [
      // Base styles
      'aspect-square rounded-full border border-primary text-primary shadow',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'peer sr-only', // Hide native radio but keep for accessibility
      
      // Custom className
      className,
    ];

    // Custom indicator classes
    const indicatorClasses = [
      // Base indicator styles
      'flex items-center justify-center rounded-full border border-primary',
      'cursor-pointer transition-colors',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      
      // Size styles
      sizeClasses[size],
      
      // Checked state
      isChecked && 'bg-primary border-primary',
      !isChecked && 'bg-background hover:bg-accent',
      
      // Error state
      error && 'border-destructive peer-focus-visible:ring-destructive',
      error && isChecked && 'bg-destructive border-destructive',
    ];

    const DotIcon = () => (
      <div
        className={cn(
          'rounded-full bg-primary-foreground transition-all',
          size === 'sm' && 'h-1 w-1',
          size === 'md' && 'h-1.5 w-1.5',
          size === 'lg' && 'h-2 w-2',
          !isChecked && 'scale-0',
          isChecked && 'scale-100'
        )}
      />
    );

    return (
      <div className="flex items-start space-x-2">
        {/* Radio input and custom indicator */}
        <div className="relative flex items-center">
          <input
            type="radio"
            className={cn(...radioClasses)}
            ref={ref}
            id={radioId}
            name={context.name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            aria-describedby={descriptionId}
            {...props}
          />
          
          {/* Custom radio indicator */}
          <label htmlFor={radioId} className={cn(...indicatorClasses)}>
            <DotIcon />
          </label>
        </div>
        
        {/* Label and content */}
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'text-sm font-medium leading-none cursor-pointer',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
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
    );
  }
);

// RadioGroup component for managing radio button groups
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    className,
    value,
    defaultValue,
    error = false,
    errorMessage,
    label,
    description,
    required = false,
    disabled = false,
    orientation = 'vertical',
    onChange,
    children,
    id,
    ...props
  }, ref) => {
    
    // State management for uncontrolled component
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    // Generate unique ID and name for the group
    const groupId = id || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
    const groupName = `${groupId}-radios`;
    const descriptionId = description ? `${groupId}-description` : undefined;
    const errorId = errorMessage ? `${groupId}-error` : undefined;

    // Handle value change
    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    // Context value for child Radio components
    const contextValue: RadioGroupContextValue = {
      name: groupName,
      value: currentValue,
      onChange: handleChange,
      disabled,
      error,
    };

    // Base group classes
    const groupClasses = [
      // Base styles
      'grid gap-2',
      
      // Orientation styles
      orientation === 'horizontal' ? 'grid-flow-col auto-cols-max' : 'grid-rows-auto',
      
      // Custom className
      className,
    ];

    return (
      <div className="space-y-2">
        {/* Group label */}
        {label && (
          <label
            className={cn(
              'text-sm font-medium leading-none',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        
        {/* Radio group */}
        <RadioGroupContext.Provider value={contextValue}>
          <div
            ref={ref}
            role="radiogroup"
            aria-invalid={error}
            aria-describedby={cn(descriptionId, errorId)}
            aria-required={required}
            className={cn(...groupClasses)}
            {...props}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>
        
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

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };