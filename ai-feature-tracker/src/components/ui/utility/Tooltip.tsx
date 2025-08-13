'use client';

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// TypeScript interfaces for Tooltip props
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  delayDuration?: number;
  skipDelayDuration?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  portal?: boolean;
}

// Tooltip component for contextual information with positioning
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({
    content,
    children,
    side = 'top',
    align = 'center',
    offset = 4,
    delayDuration = 700,
    skipDelayDuration = 300,
    disabled = false,
    className,
    contentClassName,
    arrow = true,
    portal = true,
  }, _ref) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [actualSide, setActualSide] = useState(side);
    
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPointerInside = useRef(false);
    const wasRecentlyOpen = useRef(false);

    // Calculate tooltip position
    const calculatePosition = useCallback(() => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      
      if (!trigger || !tooltip) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
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
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - offset;
          
          // Check if tooltip fits above
          if (y < 0) {
            finalSide = 'bottom';
            y = triggerRect.bottom + offset;
          }
          break;
          
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + offset;
          
          // Check if tooltip fits below
          if (y + tooltipRect.height > viewportHeight) {
            finalSide = 'top';
            y = triggerRect.top - tooltipRect.height - offset;
          }
          break;
          
        case 'left':
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          
          // Check if tooltip fits to the left
          if (x < 0) {
            finalSide = 'right';
            x = triggerRect.right + offset;
          }
          break;
          
        case 'right':
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          
          // Check if tooltip fits to the right
          if (x + tooltipRect.width > viewportWidth) {
            finalSide = 'left';
            x = triggerRect.left - tooltipRect.width - offset;
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
            x = triggerRect.right - tooltipRect.width;
            break;
          // 'center' is already calculated above
        }
        
        // Ensure tooltip stays within viewport horizontally
        x = Math.max(8, Math.min(x, viewportWidth - tooltipRect.width - 8));
      } else {
        switch (align) {
          case 'start':
            y = triggerRect.top;
            break;
          case 'end':
            y = triggerRect.bottom - tooltipRect.height;
            break;
          // 'center' is already calculated above
        }
        
        // Ensure tooltip stays within viewport vertically
        y = Math.max(8, Math.min(y, viewportHeight - tooltipRect.height - 8));
      }

      setPosition({ x: x + scrollX, y: y + scrollY });
      setActualSide(finalSide);
    }, [align, offset, side]);

    // Handle mouse enter
    const handleMouseEnter = () => {
      if (disabled) return;
      
      isPointerInside.current = true;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use shorter delay if tooltip was recently open
      const delay = wasRecentlyOpen.current ? skipDelayDuration : delayDuration;
      
      timeoutRef.current = setTimeout(() => {
        if (isPointerInside.current) {
          setIsOpen(true);
        }
      }, delay);
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      isPointerInside.current = false;
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsOpen(false);
      wasRecentlyOpen.current = true;
      
      // Reset recently open flag
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
      skipTimeoutRef.current = setTimeout(() => {
        wasRecentlyOpen.current = false;
      }, skipDelayDuration);
    };

    // Handle focus
    const handleFocus = () => {
      if (disabled) return;
      setIsOpen(true);
    };

    // Handle blur
    const handleBlur = () => {
      setIsOpen(false);
    };

    // Update position when tooltip becomes visible
    useEffect(() => {
      if (isOpen) {
        calculatePosition();
      }
    }, [isOpen, content, calculatePosition]);

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
    }, [isOpen, calculatePosition]);

    // Cleanup timeouts
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
      };
    }, []);

    // Arrow classes based on side
    const arrowClasses = {
      top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-popover',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-popover',
      left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-popover',
      right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-popover',
    };

    // Tooltip content classes
    const tooltipClasses = [
      // Base styles
      'z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground',
      'shadow-md border animate-in fade-in-0 zoom-in-95',
      
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
        className={cn('inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
    );

    // Tooltip content
    const tooltipContent = isOpen && (
      <div
        ref={tooltipRef}
        className={cn(...tooltipClasses)}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          pointerEvents: 'none',
        }}
        role="tooltip"
      >
        {content}
        
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
      <>
        {triggerElement}
        {portal && tooltipContent ? createPortal(tooltipContent, document.body) : tooltipContent}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };