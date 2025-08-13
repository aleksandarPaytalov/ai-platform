import React from 'react';
import { cn } from '@/lib/utils';
import { Grid } from '../grid/Grid';
import type { GridProps } from '../grid/Grid';

export interface CardGridProps extends Omit<GridProps, 'columns'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  minCardWidth?: string;
  maxColumns?: number;
  equalHeight?: boolean;
  'data-testid'?: string;
}

const variantConfigs = {
  default: {
    columns: { default: 1, sm: 2, lg: 3, xl: 4 },
    gap: { default: 4, md: 6 },
  },
  compact: {
    columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    gap: { default: 2, md: 4 },
  },
  spacious: {
    columns: { default: 1, sm: 2, lg: 3 },
    gap: { default: 6, md: 8, lg: 10 },
  },
};

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  className,
  variant = 'default',
  minCardWidth,
  maxColumns,
  equalHeight = false,
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

  // Apply max columns constraint if specified
  if (maxColumns) {
    Object.keys(finalConfig.columns).forEach(breakpoint => {
      const key = breakpoint as keyof typeof finalConfig.columns;
      const currentValue = finalConfig.columns[key];
      if (currentValue && currentValue > maxColumns) {
        finalConfig.columns[key] = maxColumns;
      }
    });
  }

  // Add styles for equal height cards
  const gridStyles: React.CSSProperties = minCardWidth ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`,
  } : {};

  return (
    <Grid
      className={cn(
        'w-full',
        equalHeight && '[&>*]:h-full [&>*]:flex [&>*]:flex-col',
        className
      )}
      columns={finalConfig.columns}
      gap={finalConfig.gap}
      align={align}
      justify={justify}
      as={as}
      {...(minCardWidth ? { style: gridStyles } : {})}
      data-testid={testId}
      {...({ role: 'grid' } as any)}
      aria-label="Card grid"
      {...props}
    >
      {children}
    </Grid>
  );
};

CardGrid.displayName = 'CardGrid';