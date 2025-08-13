'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// TypeScript interfaces for Avatar props
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  showStatus?: boolean;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

// Avatar component for user/tool profile images with fallbacks
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    src,
    alt = '',
    fallback,
    size = 'md',
    shape = 'circle',
    status = 'none',
    showStatus = false,
    priority = false,
    loading = 'lazy',
    ...props
  }, ref) => {
    
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Handle image load error
    const handleImageError = () => {
      setImageError(true);
    };

    // Handle image load success
    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    // Generate fallback text from alt or first letters
    const getFallbackText = () => {
      if (fallback) return fallback;
      if (alt) {
        return alt
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
      return '?';
    };

    // Size classes mapping
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl',
    };

    // Shape classes mapping
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-md',
    };

    // Status color classes mapping
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      none: '',
    };

    // Status size classes based on avatar size
    const statusSizeClasses = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5',
    };

    // Base avatar classes
    const baseClasses = [
      // Base styles
      'relative inline-block shrink-0 overflow-hidden bg-muted',
      
      // Size styles
      sizeClasses[size],
      
      // Shape styles
      shapeClasses[shape],
      
      // Custom className
      className,
    ];

    // Should show image
    const shouldShowImage = src && !imageError;

    return (
      <div
        className={cn(...baseClasses)}
        ref={ref}
        {...props}
      >
        {/* Image */}
        {shouldShowImage && (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              'object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            priority={priority}
            loading={loading}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Fallback */}
        {(!shouldShowImage || !imageLoaded) && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-muted font-medium',
              'text-muted-foreground select-none',
              shouldShowImage && !imageLoaded && 'absolute inset-0'
            )}
            aria-hidden="true"
          >
            {getFallbackText()}
          </div>
        )}
        
        {/* Status indicator */}
        {showStatus && status !== 'none' && (
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-background',
              statusSizeClasses[size],
              statusClasses[status]
            )}
            aria-label={`Status: ${status}`}
            role="img"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };