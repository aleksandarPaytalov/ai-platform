import React from 'react';
import { cn } from '@/lib/utils';
import { Grid } from '../grid/Grid';
import type { GridProps } from '../grid/Grid';
import { MasonryGrid } from '../grid/MasonryGrid';

export interface GalleryGridProps extends Omit<GridProps, 'columns'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'masonry' | 'uniform' | 'featured';
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  imageCount?: number;
  showOverlay?: boolean;
  'data-testid'?: string;
}

const variantConfigs = {
  masonry: {
    columns: { default: 2, sm: 3, lg: 4, xl: 5 },
    gap: { default: 2, md: 4 },
  },
  uniform: {
    columns: { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    gap: { default: 2, md: 3 },
  },
  featured: {
    columns: { default: 2, md: 3, lg: 4 },
    gap: { default: 4, md: 6 },
  },
};

const aspectRatioClasses = {
  square: 'aspect-square',
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
};

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  children,
  className,
  variant = 'uniform',
  aspectRatio = 'auto',
  imageCount,
  showOverlay = false,
  gap,
  align = 'stretch',
  justify = 'start',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const config = variantConfigs[variant];
  
  // Override with custom configuration
  const finalConfig = {
    columns: config.columns,
    gap: gap || config.gap,
  };

  // Optimize columns based on image count
  if (imageCount) {
    Object.keys(finalConfig.columns).forEach(breakpoint => {
      const key = breakpoint as keyof typeof finalConfig.columns;
      const currentValue = finalConfig.columns[key];
      if (currentValue && currentValue > imageCount) {
        finalConfig.columns[key] = imageCount;
      }
    });
  }

  // Process children to add gallery-specific styles
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<any>(child)) {
      const element = child as React.ReactElement<any>;
      return React.cloneElement(element, {
        key: index,
        className: cn(
          (element.props as any).className,
          // Apply aspect ratio to images
          aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
          // Add gallery item styling
          'relative overflow-hidden rounded-lg',
          'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
          // Add overlay styling if enabled
          showOverlay && 'group cursor-pointer',
          // Ensure images fill their containers
          '[&_img]:w-full [&_img]:h-full [&_img]:object-cover'
        ),
        children: (
          <>
            {element.props.children}
            {showOverlay && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                  View
                </div>
              </div>
            )}
          </>
        ),
      } as any);
    }
    return child;
  });

  // Use masonry layout for masonry variant
  if (variant === 'masonry' && aspectRatio === 'auto') {
    return (
      <MasonryGrid
        className={cn(
          'w-full',
          className
        )}
        columns={finalConfig.columns}
        gap={finalConfig.gap}
        as={as}
        {...(testId ? { 'data-testid': testId } as any : {})}
        {...props}
      >
        {processedChildren}
      </MasonryGrid>
    );
  }

  // Use regular grid for other variants
  return (
    <Grid
      className={cn(
        'w-full',
        className
      )}
      columns={finalConfig.columns}
      gap={finalConfig.gap}
      align={align}
      justify={justify}
      as={as}
      data-testid={testId}
      {...({ role: 'img' } as any)}
      aria-label="Image gallery"
      {...props}
    >
      {processedChildren}
    </Grid>
  );
};

GalleryGrid.displayName = 'GalleryGrid';