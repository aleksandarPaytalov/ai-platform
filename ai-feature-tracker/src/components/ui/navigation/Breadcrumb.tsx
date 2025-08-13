'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// TypeScript interfaces for Breadcrumb components
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showRoot?: boolean;
  rootLabel?: string;
  rootHref?: string;
}

// Breadcrumb component for navigation hierarchy
const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({
    className,
    items,
    separator,
    maxItems,
    showRoot = false,
    rootLabel = 'Home',
    rootHref = '/',
    ...props
  }, ref) => {
    
    // Default separator component
    const DefaultSeparator = () => (
      <svg
        className="h-4 w-4 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    );

    // Truncate items if maxItems is set
    let displayItems = [...items];
    // Keep logic simple; remove unused variable

    if (maxItems && items.length > maxItems) {
      const keepFirst = Math.floor(maxItems / 2);
      const keepLast = maxItems - keepFirst - 1; // -1 for ellipsis
      
      displayItems = [
        ...items.slice(0, keepFirst),
        { label: '...', disabled: true },
        ...items.slice(-keepLast),
      ];
      // Ellipsis item injected above
    }

    // Add root item if requested
    if (showRoot) {
      displayItems.unshift({
        label: rootLabel,
        href: rootHref,
        current: false,
      });
    }

    // Base breadcrumb classes
    const baseClasses = [
      // Base styles
      'flex items-center space-x-1 text-sm text-muted-foreground',
      
      // Custom className
      className,
    ];

    // Render breadcrumb item
    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      const itemClasses = [
        // Base item styles
        'flex items-center',
        
        // Current item styles
        item.current && 'text-foreground font-medium',
        
        // Disabled styles
        item.disabled && 'opacity-50 cursor-not-allowed',
        
        // Link styles
        item.href && !item.current && !item.disabled && 'hover:text-foreground transition-colors',
      ];

      const itemContent = (
        <span className={cn(...itemClasses)}>
          {item.label}
        </span>
      );

      return (
        <React.Fragment key={`${item.label}-${index}`}>
          {/* Breadcrumb item */}
          <li className="flex items-center">
            {item.href && !item.current && !item.disabled ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-foreground transition-colors"
                aria-current={item.current ? 'page' : undefined}
              >
                {itemContent}
              </Link>
            ) : (
              <span aria-current={item.current ? 'page' : undefined}>
                {itemContent}
              </span>
            )}
          </li>
          
          {/* Separator */}
          {!isLast && (
            <li className="flex items-center" aria-hidden="true">
              {separator || <DefaultSeparator />}
            </li>
          )}
        </React.Fragment>
      );
    };

    return (
      <nav
        className={cn(...baseClasses)}
        ref={ref}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center space-x-1">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            return renderItem(item, index, isLast);
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };