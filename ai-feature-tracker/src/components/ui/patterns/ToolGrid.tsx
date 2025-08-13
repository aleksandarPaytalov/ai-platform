import React from 'react';
import { cn } from '@/lib/utils';
import { Grid } from '../grid/Grid';
import type { GridProps } from '../grid/Grid';

export interface ToolGridProps extends Omit<GridProps, 'columns'> {
  children: React.ReactNode;
  className?: string;
  view?: 'card' | 'list' | 'compact';
  category?: string;
  sortBy?: 'name' | 'category' | 'popularity' | 'date';
  showFilters?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

const viewConfigs = {
  card: {
    columns: { default: 1, sm: 2, lg: 3, xl: 4 },
    gap: { default: 4, md: 6 },
    minWidth: '280px',
  },
  list: {
    columns: { default: 1 },
    gap: { default: 2 },
    minWidth: '100%',
  },
  compact: {
    columns: { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    gap: { default: 2, md: 3 },
    minWidth: '200px',
  },
};

export const ToolGrid: React.FC<ToolGridProps> = ({
  children,
  className,
  view = 'card',
  category,
  sortBy,
  showFilters = false,
  loading = false,
  gap,
  align = 'stretch',
  justify = 'start',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const config = viewConfigs[view];
  
  // Override with custom configuration
  const finalConfig = {
    columns: config.columns,
    gap: gap || config.gap,
  };

  // Add styles for responsive auto-fit layout with minimum width
  const gridStyles: React.CSSProperties = {
    gridTemplateColumns: `repeat(auto-fit, minmax(${config.minWidth}, 1fr))`,
  };

  // Process children to add tool-specific styles
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<any>(child)) {
      const element = child as React.ReactElement<any>;
      return React.cloneElement(element, {
        key: index,
        className: cn(
          (element.props as any).className,
          // Base tool card styling
          view === 'card' && [
            'bg-card border border-border rounded-lg shadow-sm',
            'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
            'p-4 md:p-6 h-full flex flex-col',
            // Ensure content areas expand properly
            '[&>*:last-child]:flex-1',
          ],
          // List view styling
          view === 'list' && [
            'bg-card border border-border rounded-lg',
            'transition-all duration-200 hover:shadow-sm',
            'p-3 md:p-4 flex items-center space-x-4',
            // Add hover effects for list items
            'hover:bg-accent/50',
          ],
          // Compact view styling
          view === 'compact' && [
            'bg-card border border-border rounded-md shadow-sm',
            'transition-all duration-200 hover:shadow-md',
            'p-3 text-center',
            'hover:bg-accent/30',
          ],
          // Add category-specific styling if provided
          category && `tool-category-${category.toLowerCase().replace(/\s+/g, '-')}`,
          // Loading state styling
          loading && 'opacity-50 pointer-events-none',
        ),
        // Add data attributes for filtering and sorting
        'data-category': category,
        'data-sort': sortBy,
        'data-view': view,
      } as any);
    }
    return child;
  });

  return (
    <div className="w-full space-y-4">
      {/* Filter bar - only show if enabled */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex space-x-1">
              {(['card', 'list', 'compact'] as const).map((viewType) => (
                <button
                  key={viewType}
                  className={cn(
                    'px-3 py-1 text-xs rounded-md transition-colors',
                    view === viewType
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-accent'
                  )}
                  aria-pressed={view === viewType}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {category && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Category:</span>
              <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-md">
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main grid */}
      <Grid
        className={cn(
          'w-full',
          // Add loading state styles
          loading && 'animate-pulse',
          className
        )}
        columns={view === 'card' || view === 'compact' ? finalConfig.columns : undefined}
        gap={finalConfig.gap}
        align={align}
        justify={justify}
        as={as}
        {...(view !== 'list' ? { style: gridStyles } : {})}
        data-testid={testId}
        {...({ role: 'grid' } as any)}
        aria-label={`AI tools grid - ${view} view`}
        aria-busy={loading}
        {...props}
      >
        {processedChildren}
      </Grid>

      {/* Empty state */}
      {React.Children.count(children) === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">No tools found</div>
            <div className="text-sm">
              {category 
                ? `No tools found in the "${category}" category.`
                : 'No tools match your current filters.'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ToolGrid.displayName = 'ToolGrid';