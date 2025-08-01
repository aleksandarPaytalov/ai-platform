import React from 'react';
import { cn } from '@/lib/utils';
import { Grid, GridProps } from '../grid/Grid';

export interface ListGridProps extends Omit<GridProps, 'columns'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'single' | 'double' | 'triple' | 'auto';
  itemMinWidth?: string;
  dividers?: boolean;
  zebra?: boolean;
  'data-testid'?: string;
}

const variantConfigs = {
  single: {
    columns: { default: 1 },
    gap: { default: 0 },
  },
  double: {
    columns: { default: 1, md: 2 },
    gap: { default: 0, md: 6 },
  },
  triple: {
    columns: { default: 1, md: 2, xl: 3 },
    gap: { default: 0, md: 6 },
  },
  auto: {
    columns: { default: 1, sm: 2, lg: 3, xl: 4 },
    gap: { default: 0, sm: 4, lg: 6 },
  },
};

export const ListGrid: React.FC<ListGridProps> = ({
  children,
  className,
  variant = 'single',
  itemMinWidth,
  dividers = false,
  zebra = false,
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

  // Add styles for auto-fit with min width
  const gridStyles: React.CSSProperties = itemMinWidth ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${itemMinWidth}, 1fr))`,
  } : {};

  // Process children to add list-specific styles
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        key: index,
        className: cn(
          child.props.className,
          // Add dividers between items (except for multi-column layouts)
          dividers && variant === 'single' && index > 0 && 'border-t border-border',
          // Add zebra striping for single column
          zebra && variant === 'single' && index % 2 === 1 && 'bg-muted/50',
          // Ensure proper padding for list items
          'transition-colors duration-200'
        ),
      });
    }
    return child;
  });

  return (
    <Grid
      className={cn(
        'w-full',
        // Add border and rounded corners for contained lists
        dividers && variant === 'single' && 'border border-border rounded-lg overflow-hidden',
        className
      )}
      columns={finalConfig.columns}
      gap={finalConfig.gap}
      align={align}
      justify={justify}
      as={as}
      style={itemMinWidth ? gridStyles : undefined}
      data-testid={testId}
      role="list"
      aria-label="List grid"
      {...props}
    >
      {processedChildren}
    </Grid>
  );
};

ListGrid.displayName = 'ListGrid';