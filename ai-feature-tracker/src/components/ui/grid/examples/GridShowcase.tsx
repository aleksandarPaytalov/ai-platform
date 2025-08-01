import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Grid } from '../Grid';
import { GridItem } from '../GridItem';
import { AutoGrid } from '../AutoGrid';
import { MasonryGrid } from '../MasonryGrid';
import { useBreakpoint } from '@/lib/responsive';

export interface GridShowcaseProps {
  className?: string;
  'data-testid'?: string;
}

const DemoCard: React.FC<{ children: React.ReactNode; height?: string; className?: string }> = ({ 
  children, 
  height = 'h-24', 
  className 
}) => (
  <div className={cn(
    'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center text-center text-sm font-medium text-blue-800',
    height,
    className
  )}>
    {children}
  </div>
);

export const GridShowcase: React.FC<GridShowcaseProps> = ({
  className,
  'data-testid': testId,
}) => {
  const [selectedDemo, setSelectedDemo] = useState<'basic' | 'responsive' | 'auto' | 'masonry'>('basic');
  const currentBreakpoint = useBreakpoint();

  const demos = {
    basic: {
      title: 'Basic Grid',
      description: 'Simple grid with fixed columns',
      component: (
        <Grid columns={{ default: 2, md: 3, lg: 4 }} gap={{ default: 4 }}>
          <DemoCard>Item 1</DemoCard>
          <DemoCard>Item 2</DemoCard>
          <DemoCard>Item 3</DemoCard>
          <DemoCard>Item 4</DemoCard>
          <DemoCard>Item 5</DemoCard>
          <DemoCard>Item 6</DemoCard>
        </Grid>
      ),
    },
    responsive: {
      title: 'Responsive Grid with Spans',
      description: 'Grid items with different column spans',
      component: (
        <Grid columns={{ default: 4 }} gap={{ default: 4 }}>
          <GridItem span={{ default: 2 }}>
            <DemoCard>Span 2 Columns</DemoCard>
          </GridItem>
          <GridItem>
            <DemoCard>Single</DemoCard>
          </GridItem>
          <GridItem>
            <DemoCard>Single</DemoCard>
          </GridItem>
          <GridItem span={{ default: 3 }}>
            <DemoCard>Span 3 Columns</DemoCard>
          </GridItem>
          <GridItem>
            <DemoCard>Single</DemoCard>
          </GridItem>
          <GridItem span={{ default: 4 }}>
            <DemoCard>Full Width</DemoCard>
          </GridItem>
        </Grid>
      ),
    },
    auto: {
      title: 'Auto Grid',
      description: 'Automatically sized grid items',
      component: (
        <AutoGrid minItemWidth={{ default: '200px' }} gap={{ default: 4 }}>
          <DemoCard>Auto Item 1</DemoCard>
          <DemoCard>Auto Item 2</DemoCard>
          <DemoCard>Auto Item 3</DemoCard>
          <DemoCard>Auto Item 4</DemoCard>
          <DemoCard>Auto Item 5</DemoCard>
          <DemoCard>Auto Item 6</DemoCard>
          <DemoCard>Auto Item 7</DemoCard>
        </AutoGrid>
      ),
    },
    masonry: {
      title: 'Masonry Grid',
      description: 'Pinterest-style masonry layout',
      component: (
        <MasonryGrid columns={{ default: 2, md: 3, lg: 4 }} gap={{ default: 4 }}>
          <DemoCard height="h-32">Tall Item 1</DemoCard>
          <DemoCard height="h-16">Short Item</DemoCard>
          <DemoCard height="h-24">Medium Item</DemoCard>
          <DemoCard height="h-40">Extra Tall</DemoCard>
          <DemoCard height="h-20">Item 5</DemoCard>
          <DemoCard height="h-28">Item 6</DemoCard>
          <DemoCard height="h-16">Short</DemoCard>
          <DemoCard height="h-36">Tall Item 8</DemoCard>
        </MasonryGrid>
      ),
    },
  };

  return (
    <div className={cn('w-full space-y-8', className)} data-testid={testId}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Grid System Showcase</h2>
          <p className="text-muted-foreground">
            Explore the different grid components and their capabilities. 
            Current breakpoint: <span className="font-mono bg-accent px-2 py-1 rounded text-accent-foreground">{currentBreakpoint}</span>
          </p>
        </div>

        {/* Demo selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(demos).map(([key, demo]) => (
            <button
              key={key}
              onClick={() => setSelectedDemo(key as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedDemo === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {demo.title}
            </button>
          ))}
        </div>
      </div>

      {/* Demo display */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {demos[selectedDemo].title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {demos[selectedDemo].description}
          </p>
        </div>

        {/* Demo container */}
        <div className="border border-border rounded-lg p-6 bg-card">
          {demos[selectedDemo].component}
        </div>
      </div>

      {/* Feature documentation */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Responsive breakpoint system (sm, md, lg, xl, 2xl)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Flexible column spanning and positioning</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Auto-fit layouts with minimum width constraints</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Masonry layouts for varied content heights</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Configurable gaps and alignment options</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Accessibility support with proper ARIA attributes</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Usage Guidelines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Use Grid for structured layouts with known content</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Use AutoGrid for dynamic content with variable items</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Use MasonryGrid for content with varying heights</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Always test responsive behavior at different breakpoints</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Consider performance implications for large datasets</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Code example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Code Example</h3>
        <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{`import { Grid, GridItem } from '@/components/ui/grid';

<Grid 
  columns={{ default: 1, sm: 2, lg: 3, xl: 4 }} 
  gap={{ default: 4, lg: 6 }}
>
  <GridItem span={{ default: 2 }}>
    <Card>Featured Content</Card>
  </GridItem>
  <GridItem>
    <Card>Regular Item</Card>
  </GridItem>
  <GridItem>
    <Card>Regular Item</Card>
  </GridItem>
</Grid>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

GridShowcase.displayName = 'GridShowcase';