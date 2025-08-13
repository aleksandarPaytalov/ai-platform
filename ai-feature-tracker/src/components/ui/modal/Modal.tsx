'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// TypeScript interfaces for Modal props
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down';
}

// Modal component for overlay dialogs with backdrop
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    open,
    onOpenChange,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    preventScroll = true,
    size = 'md',
    position = 'center',
    animation = 'scale',
    children,
    ...props
  }, _ref) => {
    
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

    // Size classes mapping
    const sizeClasses = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    };

    // Position classes mapping
    const positionClasses = {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-16',
      bottom: 'items-end justify-center pb-16',
    };

    // Animation classes mapping
    const animationClasses = {
      fade: {
        enter: 'animate-in fade-in duration-200',
        exit: 'animate-out fade-out duration-200',
      },
      scale: {
        enter: 'animate-in fade-in zoom-in-95 duration-200',
        exit: 'animate-out fade-out zoom-out-95 duration-200',
      },
      'slide-up': {
        enter: 'animate-in fade-in slide-in-from-bottom-4 duration-200',
        exit: 'animate-out fade-out slide-out-to-bottom-4 duration-200',
      },
      'slide-down': {
        enter: 'animate-in fade-in slide-in-from-top-4 duration-200',
        exit: 'animate-out fade-out slide-out-to-top-4 duration-200',
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

      // Focus the modal
      const modalElement = modalRef.current;
      if (modalElement) {
        modalElement.focus();
      }

      // Focus trapping function
      const handleTab = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        const focusableElements = modalElement?.querySelectorAll(
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
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'flex min-h-full',
      
      // Position styles
      positionClasses[position],
      
      // Animation styles
      animationClasses[animation].enter,
    ];

    // Modal content classes
    const modalClasses = [
      // Base modal styles
      'relative w-full rounded-lg border bg-background p-6 shadow-lg',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      
      // Size styles
      sizeClasses[size],
      
      // Animation styles for content
      'animate-in fade-in zoom-in-95 duration-200',
      
      // Custom className
      className,
    ];

    const ModalContent = (
      <div
        className={cn(...backdropClasses)}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          className={cn(...modalClasses)}
          ref={modalRef}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>
    );

    // Render modal in portal
    return createPortal(ModalContent, document.body);
  }
);

Modal.displayName = 'Modal';

export { Modal };