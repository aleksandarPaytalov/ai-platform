'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for ModalHeader props
export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  bordered?: boolean;
}

// ModalHeader component with title and close button
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({
    className,
    title,
    subtitle,
    showCloseButton = true,
    onClose,
    bordered = true,
    children,
    ...props
  }, ref) => {
    
    // Handle close button click
    const handleClose = () => {
      onClose?.();
    };

    // Handle close button keyboard events
    const handleCloseKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClose();
      }
    };

    // Base header classes
    const baseClasses = [
      // Base styles
      'flex items-start justify-between space-y-1.5',
      
      // Bordered variant
      bordered && 'border-b pb-4 mb-4',
      
      // Custom className
      className,
    ];

    // Close button icon
    const CloseIcon = () => (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    );

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        {...props}
      >
        {/* Title and content area */}
        <div className="flex flex-col space-y-2 min-w-0 flex-1 pr-4">
          {/* Title */}
          {title && (
            <h2 
              id="modal-title"
              className="text-lg font-semibold leading-none tracking-tight"
            >
              {title}
            </h2>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <p 
              id="modal-description" 
              className="text-sm text-muted-foreground"
            >
              {subtitle}
            </p>
          )}
          
          {/* Custom children content */}
          {children}
        </div>
        
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            className={cn(
              'rounded-sm opacity-70 ring-offset-background transition-opacity',
              'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:pointer-events-none',
              'flex-shrink-0 p-1 -m-1' // Larger click target while keeping visual size small
            )}
            onClick={handleClose}
            onKeyDown={handleCloseKeyDown}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export { ModalHeader };