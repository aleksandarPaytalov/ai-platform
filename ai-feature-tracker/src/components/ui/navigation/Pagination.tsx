'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Pagination props
export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showPageInfo?: boolean;
  maxPageNumbers?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

// Pagination component for page navigation
const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    showPageInfo = false,
    maxPageNumbers = 7,
    size = 'md',
    variant = 'default',
    disabled = false,
    totalItems,
    itemsPerPage,
    ...props
  }, ref) => {
    
    // Calculate visible page numbers
    const getVisiblePages = () => {
      if (totalPages <= maxPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const halfRange = Math.floor(maxPageNumbers / 2);
      let start = Math.max(1, currentPage - halfRange);
      const end = Math.min(totalPages, start + maxPageNumbers - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < maxPageNumbers) {
        start = Math.max(1, end - maxPageNumbers + 1);
      }

      const pages: Array<number | string> = [];
      
      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    // Size classes mapping
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-9 w-9 text-sm',
      lg: 'h-10 w-10 text-base',
    };

    // Variant classes mapping
    const variantClasses = {
      default: {
        button: 'bg-background hover:bg-accent hover:text-accent-foreground border border-input',
        active: 'bg-primary text-primary-foreground border-primary',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      outline: {
        button: 'border border-input hover:bg-accent hover:text-accent-foreground',
        active: 'bg-primary text-primary-foreground border-primary',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      ghost: {
        button: 'hover:bg-accent hover:text-accent-foreground',
        active: 'bg-primary text-primary-foreground',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    };

    // Handle page change
    const handlePageChange = (page: number | string) => {
      if (disabled || typeof page !== 'number' || page === currentPage) return;
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, page: number | string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePageChange(page);
      }
    };

    // Button component
    const PaginationButton = ({ 
      page, 
      children, 
      isActive = false, 
      isDisabled = false,
      ariaLabel,
    }: {
      page: number | string;
      children: React.ReactNode;
      isActive?: boolean;
      isDisabled?: boolean;
      ariaLabel?: string;
    }) => {
      const buttonClasses = [
        // Base styles
        'inline-flex items-center justify-center whitespace-nowrap rounded-md',
        'font-medium transition-colors focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        
        // Size styles
        sizeClasses[size],
        
        // Variant styles
        isActive 
          ? variantClasses[variant].active
          : variantClasses[variant].button,
        
        // Disabled styles
        (isDisabled || disabled) && variantClasses[variant].disabled,
      ];

      return (
        <button
          type="button"
          className={cn(...buttonClasses)}
          onClick={() => handlePageChange(page)}
          onKeyDown={(e) => handleKeyDown(e, page)}
          disabled={isDisabled || disabled}
          aria-label={ariaLabel}
          aria-current={isActive ? 'page' : undefined}
        >
          {children}
        </button>
      );
    };

    // Calculate page info
    const getPageInfo = () => {
      if (!totalItems || !itemsPerPage) return null;
      
      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      
      return `${startItem}-${endItem} of ${totalItems}`;
    };

    // Navigation icons
    const ChevronLeftIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m15 18-6-6 6-6" />
      </svg>
    );

    const ChevronRightIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m9 18 6-6-6-6" />
      </svg>
    );

    const ChevronsLeftIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m11 17-5-5 5-5" />
        <path d="m18 17-5-5 5-5" />
      </svg>
    );

    const ChevronsRightIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
      </svg>
    );

    return (
      <div
        className={cn('flex items-center justify-between', className)}
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        {/* Page info */}
        {showPageInfo && (
          <div className="text-sm text-muted-foreground">
            {getPageInfo() || `Page ${currentPage} of ${totalPages}`}
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center space-x-1">
          {/* First page button */}
          {showFirstLast && (
            <PaginationButton
              page={1}
              isDisabled={currentPage === 1}
              ariaLabel="Go to first page"
            >
              <ChevronsLeftIcon />
            </PaginationButton>
          )}

          {/* Previous page button */}
          {showPrevNext && (
            <PaginationButton
              page={currentPage - 1}
              isDisabled={currentPage === 1}
              ariaLabel="Go to previous page"
            >
              <ChevronLeftIcon />
            </PaginationButton>
          )}

          {/* Page number buttons */}
          {showPageNumbers && visiblePages.map((page, index) => (
            <React.Fragment key={`page-${index}`}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <PaginationButton
                  page={page as number}
                  isActive={page === currentPage}
                  ariaLabel={`Go to page ${page}`}
                >
                  {page}
                </PaginationButton>
              )}
            </React.Fragment>
          ))}

          {/* Next page button */}
          {showPrevNext && (
            <PaginationButton
              page={currentPage + 1}
              isDisabled={currentPage === totalPages}
              ariaLabel="Go to next page"
            >
              <ChevronRightIcon />
            </PaginationButton>
          )}

          {/* Last page button */}
          {showFirstLast && (
            <PaginationButton
              page={totalPages}
              isDisabled={currentPage === totalPages}
              ariaLabel="Go to last page"
            >
              <ChevronsRightIcon />
            </PaginationButton>
          )}
        </div>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

export { Pagination };