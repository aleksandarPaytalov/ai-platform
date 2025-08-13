'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Icon props
export interface IconProps extends React.SVGAttributes<SVGElement> {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'destructive' | 'success' | 'warning' | 'info';
  spin?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

// Icon component for consistent icon usage with size variants
const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({
    className,
    name,
    size = 'md',
    color = 'default',
    spin = false,
    pulse = false,
    children,
    ...props
  }, ref) => {
    
    // Size classes mapping
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    };

    // Color classes mapping
    const colorClasses = {
      default: 'text-current',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    };

    // Animation classes
    const animationClasses = {
      spin: 'animate-spin',
      pulse: 'animate-pulse',
    };

    // Base icon classes
    const baseClasses = [
      // Base styles
      'inline-block shrink-0',
      
      // Size styles
      sizeClasses[size],
      
      // Color styles
      colorClasses[color],
      
      // Animation styles
      spin && animationClasses.spin,
      pulse && animationClasses.pulse,
      
      // Custom className
      className,
    ];

    // Common icon library - basic set of commonly used icons
    const iconLibrary = {
      // Navigation
      'chevron-left': (
        <path d="m15 18-6-6 6-6" />
      ),
      'chevron-right': (
        <path d="m9 18 6-6-6-6" />
      ),
      'chevron-up': (
        <path d="m18 15-6-6-6 6" />
      ),
      'chevron-down': (
        <path d="m6 9 6 6 6-6" />
      ),
      'arrow-left': (
        <path d="m12 19-7-7 7-7M5 12h14" />
      ),
      'arrow-right': (
        <path d="M5 12h14m-7-7 7 7-7 7" />
      ),
      
      // Actions
      'plus': (
        <path d="M5 12h14m-7-7v14" />
      ),
      'minus': (
        <path d="M5 12h14" />
      ),
      'x': (
        <>
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </>
      ),
      'check': (
        <path d="m9 12 2 2 4-4" />
      ),
      'edit': (
        <>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="m18.5 2.5-8 8" />
        </>
      ),
      'trash': (
        <>
          <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </>
      ),
      'copy': (
        <>
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </>
      ),
      
      // Status
      'loading': (
        <>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </>
      ),
      'alert': (
        <>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4m0 4h.01" />
        </>
      ),
      'info': (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </>
      ),
      'success': (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </>
      ),
      
      // Interface
      'search': (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </>
      ),
      'filter': (
        <path d="M4 21v-7m0 0V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7m-16 0h16m0 0v7m-4-7V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7m8 0v7" />
      ),
      'settings': (
        <>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ),
      'menu': (
        <>
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </>
      ),
      'more': (
        <>
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </>
      ),
      
      // External
      'external': (
        <>
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </>
      ),
      'link': (
        <>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </>
      ),
    };

    // Get icon path
    const getIconPath = () => {
      if (name && iconLibrary[name as keyof typeof iconLibrary]) {
        return iconLibrary[name as keyof typeof iconLibrary];
      }
      return children;
    };

    return (
      <svg
        className={cn(...baseClasses)}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {getIconPath()}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };