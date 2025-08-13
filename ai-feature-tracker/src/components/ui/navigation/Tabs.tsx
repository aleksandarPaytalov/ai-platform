'use client';

import React, { forwardRef, createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Tabs system
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pills' | 'underline' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

// Context for Tabs state management
interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  activationMode: 'automatic' | 'manual';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

// Hook to use Tabs context
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// Main Tabs component with keyboard navigation
const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({
    className,
    defaultValue,
    value,
    onValueChange,
    orientation = 'horizontal',
    activationMode = 'automatic',
    children,
    ...props
  }, ref) => {
    
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: TabsContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      orientation,
      activationMode,
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          className={cn('w-full', className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

// TabsList component for tab header management
const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
  }, ref) => {
    
    const { orientation } = useTabs();

    // Variant classes mapping
    const variantClasses = {
      default: 'bg-muted p-1 text-muted-foreground',
      pills: 'bg-muted p-1 text-muted-foreground',
      underline: 'border-b border-border',
      bordered: 'border border-border bg-background',
    };

    // Size classes mapping
    const sizeClasses = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    // Base list classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center rounded-md',
      
      // Orientation styles
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      orientation === 'vertical' && 'h-auto w-auto flex-col',
      
      // Variant styles
      variantClasses[variant],
      
      // Size styles (only for non-underline variants)
      variant !== 'underline' && sizeClasses[size],
      
      // Custom className
      className,
    ];

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// TabsTrigger component for individual tabs
const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({
    className,
    value,
    disabled = false,
    children,
    ...props
  }, ref) => {
    
    const { value: selectedValue, onValueChange, orientation, activationMode } = useTabs();
    const isSelected = selectedValue === value;

    // Handle tab activation
    const handleClick = () => {
      if (!disabled) {
        onValueChange?.(value);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const tablist = event.currentTarget.parentElement;
      if (!tablist) return;

      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLButtonElement[];
      const currentIndex = tabs.indexOf(event.currentTarget);

      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          event.preventDefault();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          event.preventDefault();
          break;
        case 'Home':
          nextIndex = 0;
          event.preventDefault();
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          event.preventDefault();
          break;
        case 'Enter':
        case ' ':
          if (activationMode === 'manual') {
            handleClick();
          }
          event.preventDefault();
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        const nextTab = tabs[nextIndex];
        if (nextTab) {
          nextTab.focus();
          if (activationMode === 'automatic') {
            const newValue = nextTab.getAttribute('data-value');
            if (newValue) {
              onValueChange?.(newValue);
            }
          }
        }
      }
    };

    // Base trigger classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5',
      'text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      
      // Selected state
      isSelected && 'bg-background text-foreground shadow-sm',
      
      // Hover state
      !isSelected && 'hover:bg-background/60 hover:text-foreground',
      
      // Vertical orientation
      orientation === 'vertical' && 'w-full justify-start',
      
      // Custom className
      className,
    ];

    return (
      <button
        className={cn(...baseClasses)}
        ref={ref}
        role="tab"
          id={`tab-${value}`}
        aria-selected={isSelected}
        aria-controls={`tabpanel-${value}`}
        disabled={disabled}
        data-value={value}
        tabIndex={isSelected ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// TabsContent component for tab panels
const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({
    className,
    value,
    forceMount = false,
    children,
    ...props
  }, ref) => {
    
    const { value: selectedValue } = useTabs();
    const isSelected = selectedValue === value;

    if (!isSelected && !forceMount) {
      return null;
    }

    // Base content classes
    const baseClasses = [
      // Base styles
      'mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      
      // Hidden state for forceMount
      forceMount && !isSelected && 'hidden',
      
      // Custom className
      className,
    ];

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };