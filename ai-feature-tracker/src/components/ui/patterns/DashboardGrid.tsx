import React from 'react';
import { cn } from '@/lib/utils';
import { Grid, GridProps } from '../grid/Grid';

export interface DashboardGridProps extends Omit<GridProps, 'columns'> {
  children: React.ReactNode;
  className?: string;
  layout?: 'auto' | 'fixed' | 'masonry';
  density?: 'compact' | 'comfortable' | 'spacious';
  equalHeight?: boolean;
  minWidgetWidth?: string;
  maxColumns?: number;
  'data-testid'?: string;
}

const densityConfigs = {
  compact: {
    columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 6 },
    gap: { default: 2, md: 3 },
  },
  comfortable: {
    columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    gap: { default: 4, md: 6 },
  },
  spacious: {
    columns: { default: 1, sm: 2, lg: 3, xl: 4 },
    gap: { default: 6, md: 8, lg: 10 },
  },
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
  layout = 'auto',
  density = 'comfortable',
  equalHeight = true,
  minWidgetWidth,
  maxColumns,
  gap,
  align = 'stretch',
  justify = 'start',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const config = densityConfigs[density];
  
  // Override with custom configuration
  const finalConfig = {
    columns: { ...config.columns },
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

  // Add styles for responsive auto-fit layout
  const gridStyles: React.CSSProperties = 
    layout === 'auto' && minWidgetWidth ? {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minWidgetWidth}, 1fr))`,
    } : layout === 'masonry' ? {
      gridAutoRows: 'min-content',
    } : {};

  // Process children to add dashboard-specific styles
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        key: index,
        className: cn(
          child.props.className,
          // Add dashboard widget styling
          'bg-card border border-border rounded-lg shadow-sm',
          'transition-all duration-200 hover:shadow-md',
          // Equal height for widgets
          equalHeight && 'h-full flex flex-col',
          // Ensure content areas expand to fill widget
          equalHeight && '[&>*:last-child]:flex-1',
          // Add padding to widgets if they don't have it
          'p-4 md:p-6'
        ),
      });
    }
    return child;
  });

  return (
    <Grid
      className={cn(
        'w-full',
        // Add masonry-specific classes
        layout === 'masonry' && 'auto-rows-min',
        className
      )}
      columns={layout === 'fixed' ? finalConfig.columns : undefined}
      gap={finalConfig.gap}
      align={align}
      justify={justify}
      as={as}
      style={gridStyles}
      data-testid={testId}
      role="region"
      aria-label="Dashboard widgets"
      {...props}
    >
      {processedChildren}
    </Grid>
  );
};

DashboardGrid.displayName = 'DashboardGrid';