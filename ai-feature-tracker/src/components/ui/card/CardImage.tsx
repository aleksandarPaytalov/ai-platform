'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// TypeScript interfaces for CardImage props
export interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide';
  position?: 'top' | 'bottom' | 'left' | 'right';
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// CardImage component for card image sections with aspect ratio control
const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({
    className,
    src,
    alt,
    aspectRatio = 'landscape',
    position = 'top',
    objectFit = 'cover',
    priority = false,
    sizes,
    width: _width,
    height: _height,
    placeholder,
    blurDataURL,
    children,
    ...props
  }, ref) => {
    
    // Aspect ratio classes mapping
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video', // 16:9
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
      wide: 'aspect-[21/9]',
    };

    // Position classes mapping (for rounded corners)
    const positionClasses = {
      top: 'rounded-t-lg',
      bottom: 'rounded-b-lg',
      left: 'rounded-l-lg',
      right: 'rounded-r-lg',
    };

    // Object fit classes mapping
    const objectFitClasses = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      'scale-down': 'object-scale-down',
    };

    // Base image container classes
    const containerClasses = [
      // Base styles
      'relative overflow-hidden bg-muted',
      
      // Aspect ratio
      aspectRatioClasses[aspectRatio],
      
      // Position-based rounded corners
      positionClasses[position],
      
      // Custom className
      className,
    ];

    // Image classes
    const imageClasses = [
      // Base image styles
      'w-full h-full transition-transform duration-300 hover:scale-105',
      
      // Object fit
      objectFitClasses[objectFit],
    ];

    return (
      <div
        className={cn(...containerClasses)}
        ref={ref}
        {...props}
      >
        {/* Main image */}
        <Image
          src={src}
          alt={alt}
          className={cn(...imageClasses)}
          fill
          priority={priority}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          {...(placeholder ? { placeholder } : {})}
          {...(blurDataURL ? { blurDataURL } : {})}
        />
        
        {/* Overlay content */}
        {children && (
          <div className="absolute inset-0 flex items-end justify-start">
            <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-4">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

export { CardImage };