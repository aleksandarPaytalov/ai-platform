'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// TypeScript interfaces for Drawer props
export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  showOverlay?: boolean;
  resizable?: boolean;
}

// Drawer component for slide-out panels
const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({
    className,
    open,
    onOpenChange,
    side = 'right',
    size = 'md',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    preventScroll = true,
    showOverlay = true,
    resizable = false,
    children,
    ...props
  }, _ref) => {
    
    const drawerRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

    // Size classes mapping based on side
    const sizeClasses = {
      left: {
        xs: 'w-64',
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[28rem]',
        xl: 'w-[32rem]',
        full: 'w-full',
      },
      right: {
        xs: 'w-64',
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[28rem]',
        xl: 'w-[32rem]',
        full: 'w-full',
      },
      top: {
        xs: 'h-64',
        sm: 'h-80',
        md: 'h-96',
        lg: 'h-[28rem]',
        xl: 'h-[32rem]',
        full: 'h-full',
      },
      bottom: {
        xs: 'h-64',
        sm: 'h-80',
        md: 'h-96',
        lg: 'h-[28rem]',
        xl: 'h-[32rem]',
        full: 'h-full',
      },
    };

    // Position and animation classes
    const positionClasses = {
      left: {
        container: 'inset-y-0 left-0',
        animate: 'animate-in slide-in-from-left duration-300',
        exit: 'animate-out slide-out-to-left duration-300',
      },
      right: {
        container: 'inset-y-0 right-0',
        animate: 'animate-in slide-in-from-right duration-300',
        exit: 'animate-out slide-out-to-right duration-300',
      },
      top: {
        container: 'inset-x-0 top-0',
        animate: 'animate-in slide-in-from-top duration-300',
        exit: 'animate-out slide-out-to-top duration-300',
      },
      bottom: {
        container: 'inset-x-0 bottom-0',
        animate: 'animate-in slide-in-from-bottom duration-300',
        exit: 'animate-out slide-out-to-bottom duration-300',
      },
    };

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onOpenChange?.(false);
      }
    };

    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, onOpenChange]);

    // Handle focus trapping
    useEffect(() => {
      if (!open) return;

      // Store previously focused element
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Focus the drawer
      const drawerElement = drawerRef.current;
      if (drawerElement) {
        // Find first focusable element and focus it
        const focusableElement = drawerElement.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        } else {
          drawerElement.focus();
        }
      }

      // Focus trapping function
      const handleTab = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        const focusableElements = drawerElement?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);

      // Cleanup function
      return () => {
        document.removeEventListener('keydown', handleTab);
        
        // Restore focus to previously focused element
        if (previouslyFocusedElementRef.current) {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }, [open]);

    // Handle body scroll prevention
    useEffect(() => {
      if (!open || !preventScroll) return;

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open, preventScroll]);

    // Don't render if not open
    if (!open) return null;

    // Backdrop classes
    const backdropClasses = [
      // Base backdrop styles
      'fixed inset-0 z-50',
      showOverlay && 'bg-black/50 backdrop-blur-sm',
      
      // Animation
      'animate-in fade-in duration-300',
    ];

    // Drawer classes
    const drawerClasses = [
      // Base drawer styles
      'fixed z-50 gap-4 bg-background p-6 shadow-lg border',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      
      // Position styles
      positionClasses[side].container,
      
      // Size styles
      sizeClasses[side][size],
      
      // Animation styles
      positionClasses[side].animate,
      
      // Border radius based on side
      side === 'left' && 'rounded-r-lg border-l-0',
      side === 'right' && 'rounded-l-lg border-r-0',
      side === 'top' && 'rounded-b-lg border-t-0',
      side === 'bottom' && 'rounded-t-lg border-b-0',
      
      // Resizable styles
      resizable && [
        side === 'left' && 'resize-x',
        side === 'right' && 'resize-x',
        side === 'top' && 'resize-y',
        side === 'bottom' && 'resize-y',
        'min-w-[200px] min-h-[200px]',
      ],
      
      // Custom className
      className,
    ];

    const DrawerContent = (
      <>
        {/* Backdrop */}
        <div
          className={cn(...backdropClasses)}
          onClick={handleBackdropClick}
        />
        
        {/* Drawer panel */}
        <div
          className={cn(...drawerClasses)}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          aria-describedby="drawer-description"
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </>
    );

    // Render drawer in portal
    return createPortal(DrawerContent, document.body);
  }
);

Drawer.displayName = 'Drawer';

export { Drawer };