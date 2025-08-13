'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import NextLink from 'next/link';

// TypeScript interfaces for Link props
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'destructive' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  underline?: 'none' | 'hover' | 'always';
  external?: boolean;
  disabled?: boolean;
  // Next.js Link props
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

// Link component extending Next.js Link with consistent styling
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({
    className,
    href,
    variant = 'default',
    size = 'md',
    underline = 'hover',
    external = false,
    disabled = false,
    prefetch,
    replace = false,
    scroll = true,
    shallow = false,
    children,
    target,
    rel,
    ...props
  }, ref) => {
    
    // Determine if link is external
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

    // Size classes mapping
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    // Variant classes mapping
    const variantClasses = {
      default: 'text-foreground hover:text-primary',
      primary: 'text-primary hover:text-primary/80',
      secondary: 'text-secondary-foreground hover:text-secondary-foreground/80',
      muted: 'text-muted-foreground hover:text-foreground',
      destructive: 'text-destructive hover:text-destructive/80',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
    };

    // Underline classes mapping
    const underlineClasses = {
      none: 'no-underline',
      hover: 'no-underline hover:underline',
      always: 'underline',
    };

    // Base link classes
    const baseClasses = [
      // Base styles
      'inline-flex items-center font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'rounded-sm',
      
      // Size styles
      sizeClasses[size],
      
      // Variant styles
      variantClasses[variant],
      
      // Underline styles
      underlineClasses[underline],
      
      // Disabled styles
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      
      // Ghost variant specific styles
      variant === 'ghost' && 'px-2 py-1 rounded-md',
      
      // Custom className
      className,
    ];

    // Handle click for disabled links
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      props.onClick?.(event);
    };

    // External link attributes
    const externalProps = isExternal ? {
      target: target || '_blank',
      rel: rel || 'noopener noreferrer',
    } : {
      target,
      rel,
    };

    // Common link props
    const linkProps = {
      className: cn(...baseClasses),
      ref,
      onClick: handleClick,
      'aria-disabled': disabled,
      ...externalProps,
      ...props,
    };

    // External link or disabled link (render as regular anchor)
    if (isExternal || disabled) {
      return (
        <a
          href={disabled ? undefined : href}
          {...linkProps}
        >
          {children}
          {/* External link indicator */}
          {isExternal && !disabled && (
            <svg
              className="ml-1 h-3 w-3 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          )}
        </a>
      );
    }

    // Internal Next.js Link
    return (
      <NextLink
        href={href}
        prefetch={prefetch ?? 'auto'}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        {...(linkProps as any)}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export { Link };