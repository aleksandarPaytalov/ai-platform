'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Tag props and variants
export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray';
  removable?: boolean;
  selected?: boolean;
  onRemove?: () => void;
  onToggle?: () => void;
  leftIcon?: React.ReactNode;
}

// Tag component for categorization and filtering
const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    color = 'gray',
    removable = false,
    selected = false,
    onRemove,
    onToggle,
    leftIcon,
    children,
    onClick,
    ...props
  }, ref) => {
    
    // Size classes mapping
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs h-5',
      sm: 'px-2.5 py-1 text-xs h-6',
      md: 'px-3 py-1.5 text-sm h-7',
      lg: 'px-4 py-2 text-sm h-8',
    };

    // Color classes mapping based on variant
    const colorClasses = {
      default: {
        blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        green: 'bg-green-100 text-green-800 hover:bg-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        red: 'bg-red-100 text-red-800 hover:bg-red-200',
        purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
        gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      },
      secondary: {
        blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        green: 'bg-green-50 text-green-700 hover:bg-green-100',
        yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
        red: 'bg-red-50 text-red-700 hover:bg-red-100',
        purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
        pink: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
        gray: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
      },
      outline: {
        blue: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
        green: 'border border-green-300 text-green-700 hover:bg-green-50',
        yellow: 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50',
        red: 'border border-red-300 text-red-700 hover:bg-red-50',
        purple: 'border border-purple-300 text-purple-700 hover:bg-purple-50',
        pink: 'border border-pink-300 text-pink-700 hover:bg-pink-50',
        gray: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      },
      solid: {
        blue: 'bg-blue-500 text-white hover:bg-blue-600',
        green: 'bg-green-500 text-white hover:bg-green-600',
        yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
        red: 'bg-red-500 text-white hover:bg-red-600',
        purple: 'bg-purple-500 text-white hover:bg-purple-600',
        pink: 'bg-pink-500 text-white hover:bg-pink-600',
        gray: 'bg-gray-500 text-white hover:bg-gray-600',
      },
    };

    // Selected state classes
    const selectedClasses = {
      default: {
        blue: 'bg-blue-200 text-blue-900 ring-2 ring-blue-500',
        green: 'bg-green-200 text-green-900 ring-2 ring-green-500',
        yellow: 'bg-yellow-200 text-yellow-900 ring-2 ring-yellow-500',
        red: 'bg-red-200 text-red-900 ring-2 ring-red-500',
        purple: 'bg-purple-200 text-purple-900 ring-2 ring-purple-500',
        pink: 'bg-pink-200 text-pink-900 ring-2 ring-pink-500',
        gray: 'bg-gray-200 text-gray-900 ring-2 ring-gray-500',
      },
      secondary: {
        blue: 'bg-blue-100 text-blue-900 ring-2 ring-blue-400',
        green: 'bg-green-100 text-green-900 ring-2 ring-green-400',
        yellow: 'bg-yellow-100 text-yellow-900 ring-2 ring-yellow-400',
        red: 'bg-red-100 text-red-900 ring-2 ring-red-400',
        purple: 'bg-purple-100 text-purple-900 ring-2 ring-purple-400',
        pink: 'bg-pink-100 text-pink-900 ring-2 ring-pink-400',
        gray: 'bg-gray-100 text-gray-900 ring-2 ring-gray-400',
      },
      outline: {
        blue: 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-300',
        green: 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-300',
        yellow: 'border-yellow-500 bg-yellow-50 text-yellow-900 ring-2 ring-yellow-300',
        red: 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-300',
        purple: 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-300',
        pink: 'border-pink-500 bg-pink-50 text-pink-900 ring-2 ring-pink-300',
        gray: 'border-gray-500 bg-gray-50 text-gray-900 ring-2 ring-gray-300',
      },
      solid: {
        blue: 'bg-blue-600 text-white ring-2 ring-blue-300',
        green: 'bg-green-600 text-white ring-2 ring-green-300',
        yellow: 'bg-yellow-600 text-white ring-2 ring-yellow-300',
        red: 'bg-red-600 text-white ring-2 ring-red-300',
        purple: 'bg-purple-600 text-white ring-2 ring-purple-300',
        pink: 'bg-pink-600 text-white ring-2 ring-pink-300',
        gray: 'bg-gray-600 text-white ring-2 ring-gray-300',
      },
    };

    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (onToggle) {
        onToggle();
      }
      onClick?.(event);
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if ((event.key === 'Enter' || event.key === ' ') && (onToggle || onClick)) {
        event.preventDefault();
        if (onToggle) {
          onToggle();
        }
        if (onClick) {
          onClick(event as any);
        }
      }
    };

    // Base tag classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-md',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'ring-offset-background',
      
      // Size styles
      sizeClasses[size],
      
      // Color and variant styles
      selected 
        ? selectedClasses[variant][color]
        : colorClasses[variant][color],
      
      // Interactive styles
      (onClick || onToggle) && 'cursor-pointer hover:scale-105 active:scale-95',
      
      // Removable styles
      removable && 'pr-1',
      
      // Custom className
      className,
    ];

    // Remove button icon
    const RemoveIcon = () => (
      <svg
        className="ml-1 h-3 w-3 cursor-pointer hover:opacity-70 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        aria-label="Remove tag"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }
        }}
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    );

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={(onClick || onToggle) ? 0 : undefined}
        role={(onClick || onToggle) ? 'button' : undefined}
        aria-pressed={onToggle ? selected : undefined}
        {...props}
      >
        {/* Left icon */}
        {leftIcon && (
          <span className="mr-1.5 flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {/* Tag content */}
        <span className="truncate">
          {children}
        </span>
        
        {/* Remove button */}
        {removable && <RemoveIcon />}
      </div>
    );
  }
);

Tag.displayName = 'Tag';

export { Tag };