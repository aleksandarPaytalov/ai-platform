'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// TypeScript interfaces for Popover props
export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  modal?: boolean;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  portal?: boolean;
}

// Popover component for floating content with positioning logic
const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({
    trigger,
    content,
    children,
    open: controlledOpen,
    onOpenChange,
    side = 'bottom',
    align = 'center',
    offset = 4,
    closeOnClickOutside = true,
    closeOnEscape = true,
    modal = false,
    className,
    contentClassName,
    arrow = true,
    portal = true,
  }, ref) => {
    
    const [internalOpen, setInternalOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [actualSide, setActualSide] = useState(side);
    
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    // Handle open change
    const handleOpenChange = (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    // Calculate popover position
    const calculatePosition = () => {
      const trigger = triggerRef.current;
      const popover = contentRef.current;
      
      if (!trigger || !popover) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let x = 0;
      let y = 0;
      let finalSide = side;

      // Calculate base position
      switch (side) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          y = triggerRect.top - popoverRect.height - offset;
          
          // Check if popover fits above
          if (y < 0) {
            finalSide = 'bottom';
            y = triggerRect.bottom + offset;
          }
          break;
          
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          y = triggerRect.bottom + offset;
          
          // Check if popover fits below
          if (y + popoverRect.height > viewportHeight) {
            finalSide = 'top';
            y = triggerRect.top - popoverRect.height - offset;
          }
          break;
          
        case 'left':
          x = triggerRect.left - popoverRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          
          // Check if popover fits to the left
          if (x < 0) {
            finalSide = 'right';
            x = triggerRect.right + offset;
          }
          break;
          
        case 'right':
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          
          // Check if popover fits to the right
          if (x + popoverRect.width > viewportWidth) {
            finalSide = 'left';
            x = triggerRect.left - popoverRect.width - offset;
          }
          break;
      }

      // Apply alignment
      if (finalSide === 'top' || finalSide === 'bottom') {
        switch (align) {
          case 'start':
            x = triggerRect.left;
            break;
          case 'end':
            x = triggerRect.right - popoverRect.width;
            break;
          // 'center' is already calculated above
        }
        
        // Ensure popover stays within viewport horizontally
        x = Math.max(8, Math.min(x, viewportWidth - popoverRect.width - 8));
      } else {
        switch (align) {
          case 'start':
            y = triggerRect.top;
            break;
          case 'end':
            y = triggerRect.bottom - popoverRect.height;
            break;
          // 'center' is already calculated above
        }
        
        // Ensure popover stays within viewport vertically
        y = Math.max(8, Math.min(y, viewportHeight - popoverRect.height - 8));
      }

      setPosition({ x: x + scrollX, y: y + scrollY });
      setActualSide(finalSide);
    };

    // Handle trigger click
    const handleTriggerClick = () => {
      handleOpenChange(!isOpen);
    };

    // Handle outside click
    useEffect(() => {
      if (!isOpen || !closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const trigger = triggerRef.current;
        const popover = contentRef.current;
        
        if (
          trigger && !trigger.contains(target) &&
          popover && !popover.contains(target)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeOnClickOutside]);

    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape]);

    // Handle focus management for modal popovers
    useEffect(() => {
      if (!isOpen || !modal) return;

      // Store previously focused element
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Focus the popover content
      const popover = contentRef.current;
      if (popover) {
        // Find first focusable element
        const focusableElement = popover.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        } else {
          popover.focus();
        }
      }

      // Focus trapping for modal popovers
      const handleTab = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        const focusableElements = popover?.querySelectorAll(
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
    }, [isOpen, modal]);

    // Update position when popover becomes visible
    useEffect(() => {
      if (isOpen) {
        calculatePosition();
      }
    }, [isOpen, content]);

    // Handle window resize and scroll
    useEffect(() => {
      if (!isOpen) return;

      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [isOpen]);

    // Arrow classes based on side
    const arrowClasses = {
      top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-border',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-border',
      left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-border',
      right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-border',
    };

    // Popover content classes
    const popoverClasses = [
      // Base styles
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      'animate-in fade-in-0 zoom-in-95',
      
      // Animation based on side
      actualSide === 'top' && 'slide-in-from-bottom-2',
      actualSide === 'bottom' && 'slide-in-from-top-2',
      actualSide === 'left' && 'slide-in-from-right-2',
      actualSide === 'right' && 'slide-in-from-left-2',
      
      // Custom content className
      contentClassName,
    ];

    // Trigger element
    const triggerElement = (
      <div
        ref={triggerRef}
        className={cn('inline-block cursor-pointer', className)}
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {trigger}
      </div>
    );

    // Popover content
    const popoverContent = isOpen && (
      <div
        ref={contentRef}
        className={cn(...popoverClasses)}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
        }}
        role={modal ? 'dialog' : 'tooltip'}
        aria-modal={modal}
        tabIndex={modal ? -1 : undefined}
      >
        {content || children}
        
        {/* Arrow */}
        {arrow && (
          <div
            className={cn(
              'absolute border-4',
              arrowClasses[actualSide]
            )}
          />
        )}
      </div>
    );

    return (
      <div ref={ref}>
        {triggerElement}
        {portal && popoverContent ? createPortal(popoverContent, document.body) : popoverContent}
      </div>
    );
  }
);

Popover.displayName = 'Popover';

export { Popover };