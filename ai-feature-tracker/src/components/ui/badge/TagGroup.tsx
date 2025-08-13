'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for TagGroup props
export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: string[];
  selectedTags?: string[];
  maxVisible?: number;
  removable?: boolean;
  selectable?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline' | 'solid';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray';
  spacing?: 'tight' | 'normal' | 'relaxed';
  wrap?: boolean;
  onTagSelect?: (tag: string, selected: boolean) => void;
  onTagRemove?: (tag: string) => void;
  onShowMore?: () => void;
  renderTag?: (tag: string, index: number) => React.ReactNode;
}

// TagGroup component for managing multiple tags
const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(
  ({
    className,
    tags,
    selectedTags = [],
    maxVisible,
    removable = false,
    selectable = false,
    size = 'md',
    variant = 'default',
    color = 'gray',
    spacing = 'normal',
    wrap = true,
    onTagSelect,
    onTagRemove,
    onShowMore,
    renderTag,
    ...props
  }, ref) => {
    
    const [showAll, setShowAll] = useState(false);

    // Determine which tags to show
    const visibleTags = maxVisible && !showAll 
      ? tags.slice(0, maxVisible)
      : tags;
    
    const hiddenCount = maxVisible && !showAll 
      ? Math.max(0, tags.length - maxVisible)
      : 0;

    // Handle show more functionality
    const handleShowMore = () => {
      if (onShowMore) {
        onShowMore();
      } else {
        setShowAll(true);
      }
    };

    // Handle tag selection
    const handleTagSelect = (tag: string) => {
      if (selectable && onTagSelect) {
        const isSelected = selectedTags.includes(tag);
        onTagSelect(tag, !isSelected);
      }
    };

    // Handle tag removal
    const handleTagRemove = (tag: string) => {
      if (removable && onTagRemove) {
        onTagRemove(tag);
      }
    };

    // Spacing classes mapping
    const spacingClasses = {
      tight: 'gap-1',
      normal: 'gap-2',
      relaxed: 'gap-3',
    };

    // Size classes mapping for tags
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

    // Base group classes
    const baseClasses = [
      // Base styles
      'flex items-center',
      
      // Spacing
      spacingClasses[spacing],
      
      // Wrap behavior
      wrap ? 'flex-wrap' : 'flex-nowrap overflow-x-auto',
      
      // Custom className
      className,
    ];

    // Default tag renderer
    const defaultTagRenderer = (tag: string, index: number) => {
      const isSelected = selectedTags.includes(tag);
      
      const tagClasses = [
        // Base tag styles
        'inline-flex items-center justify-center whitespace-nowrap rounded-md',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'ring-offset-background',
        
        // Size styles
        sizeClasses[size],
        
        // Color and variant styles
        isSelected 
          ? selectedClasses[variant][color]
          : colorClasses[variant][color],
        
        // Interactive styles
        (selectable || removable) && 'cursor-pointer hover:scale-105 active:scale-95',
        
        // Removable styles
        removable && 'pr-1',
      ];

      return (
        <div
          key={`${tag}-${index}`}
          className={cn(...tagClasses)}
          onClick={() => handleTagSelect(tag)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTagSelect(tag);
            }
          }}
          tabIndex={selectable ? 0 : undefined}
          role={selectable ? 'button' : undefined}
          aria-pressed={selectable ? isSelected : undefined}
        >
          <span className="truncate">{tag}</span>
          
          {/* Remove button */}
          {removable && (
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
                handleTagRemove(tag);
              }}
              aria-label={`Remove ${tag}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTagRemove(tag);
                }
              }}
            >
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          )}
        </div>
      );
    };

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        role="group"
        aria-label="Tag group"
        {...props}
      >
        {/* Visible tags */}
        {visibleTags.map((tag, index) => 
          renderTag ? renderTag(tag, index) : defaultTagRenderer(tag, index)
        )}
        
        {/* Show more button */}
        {hiddenCount > 0 && (
          <button
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md',
              'font-medium transition-colors hover:scale-105 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'bg-muted text-muted-foreground hover:bg-muted/80',
              sizeClasses[size]
            )}
            onClick={handleShowMore}
            aria-label={`Show ${hiddenCount} more tags`}
          >
            +{hiddenCount}
          </button>
        )}
      </div>
    );
  }
);

TagGroup.displayName = 'TagGroup';

export { TagGroup };