import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Grid } from '../Grid';
import { Container } from '../../layout/containers/Container';
import { Stack } from '../../layout/Stack';
import { useViewportSize, useBreakpoint, useDeviceType } from '@/lib/responsive';
import { BREAKPOINTS } from '@/lib/breakpoints';

export interface ResponsiveDemoProps {
  className?: string;
  'data-testid'?: string;
}

const BreakpointIndicator: React.FC<{ 
  breakpoint: string; 
  isActive: boolean; 
  width: number; 
}> = ({ breakpoint, isActive, width }) => (
  <div className={cn(
    'px-3 py-2 rounded-lg text-sm transition-all duration-200',
    isActive 
      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
      : 'bg-muted text-muted-foreground'
  )}>
    <div className="font-medium">{breakpoint}</div>
    <div className="text-xs opacity-75">
      {breakpoint === 'base' ? '< 640px' : `≥ ${BREAKPOINTS[breakpoint as keyof typeof BREAKPOINTS]}px`}
    </div>
    {isActive && (
      <div className="text-xs mt-1 opacity-90">
        Current: {width}px
      </div>
    )}
  </div>
);

const ResponsiveCard: React.FC<{ 
  title: string; 
  showAt: string;
  className?: string;
}> = ({ title, showAt, className }) => (
  <div className={cn(
    'bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 text-center',
    className
  )}>
    <div className="font-medium text-green-800">{title}</div>
    <div className="text-xs text-green-600 mt-1">Visible: {showAt}</div>
  </div>
);

export const ResponsiveDemo: React.FC<ResponsiveDemoProps> = ({
  className,
  'data-testid': testId,
}) => {
  const { width, height } = useViewportSize(50); // Faster updates for demo
  const currentBreakpoint = useBreakpoint();
  const deviceType = useDeviceType();
  const [resizeCount, setResizeCount] = useState(0);

  useEffect(() => {
    setResizeCount(prev => prev + 1);
  }, [width]);

  const breakpoints = [
    { name: 'base', active: currentBreakpoint === 'base' },
    { name: 'sm', active: currentBreakpoint === 'sm' },
    { name: 'md', active: currentBreakpoint === 'md' },
    { name: 'lg', active: currentBreakpoint === 'lg' },
    { name: 'xl', active: currentBreakpoint === 'xl' },
    { name: '2xl', active: currentBreakpoint === '2xl' },
  ];

  return (
    <div className={cn('w-full space-y-8', className)} data-testid={testId}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Responsive Behavior Demo</h2>
          <p className="text-muted-foreground">
            Resize your browser window to see how the grid system adapts to different screen sizes.
          </p>
        </div>

        {/* Current state display */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Viewport:</span>
              <div className="font-mono text-lg">{width} × {height}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Breakpoint:</span>
              <div className="font-mono text-lg font-medium text-primary">{currentBreakpoint}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Device:</span>
              <div className="font-mono text-lg capitalize">{deviceType}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Resizes:</span>
              <div className="font-mono text-lg">{resizeCount}</div>
            </div>
          </div>

          {/* Breakpoint indicators */}
          <div className="flex flex-wrap gap-2">
            {breakpoints.map(bp => (
              <BreakpointIndicator
                key={bp.name}
                breakpoint={bp.name}
                isActive={bp.active}
                width={width}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive grid demonstrations */}
      <div className="space-y-8">
        {/* Basic responsive grid */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Basic Responsive Grid</h3>
            <p className="text-sm text-muted-foreground">
              Columns: 1 → sm:2 → md:3 → lg:4 → xl:5
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <Grid 
              columns={{ 
                default: 1, 
                sm: 2, 
                md: 3, 
                lg: 4, 
                xl: 5 
              }} 
              gap={{ default: 2, md: 4 }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <ResponsiveCard
                  key={i}
                  title={`Item ${i + 1}`}
                  showAt="All sizes"
                />
              ))}
            </Grid>
          </div>
        </div>

        {/* Conditional visibility */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Conditional Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Different items show/hide at different breakpoints
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <Grid columns={{ default: 2, md: 3, lg: 4 }} gap={{ default: 4 }}>
              <ResponsiveCard
                title="Always Visible"
                showAt="All sizes"
              />
              <ResponsiveCard
                title="Mobile Hidden"
                showAt="sm+"
                className="hidden sm:block"
              />
              <ResponsiveCard
                title="Tablet+ Only"
                showAt="md+"
                className="hidden md:block"
              />
              <ResponsiveCard
                title="Desktop+ Only"
                showAt="lg+"
                className="hidden lg:block"
              />
              <ResponsiveCard
                title="Large Desktop"
                showAt="xl+"
                className="hidden xl:block"
              />
              <ResponsiveCard
                title="Ultra Wide"
                showAt="2xl+"
                className="hidden 2xl:block"
              />
            </Grid>
          </div>
        </div>

        {/* Container behavior */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Container Behavior</h3>
            <p className="text-sm text-muted-foreground">
              How containers adapt to different screen sizes
            </p>
          </div>
          <Stack direction={{ default: 'vertical', lg: 'horizontal' }} gap={{ default: 4 }}>
            <Container size="sm" className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="text-red-800 font-medium">Small Container</div>
              <div className="text-red-600 text-sm">max-width: 24rem</div>
            </Container>
            <Container size="md" className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="text-blue-800 font-medium">Medium Container</div>
              <div className="text-blue-600 text-sm">max-width: 28rem</div>
            </Container>
            <Container size="lg" className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="text-green-800 font-medium">Large Container</div>
              <div className="text-green-600 text-sm">max-width: 32rem</div>
            </Container>
          </Stack>
        </div>

        {/* Responsive gaps */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Responsive Spacing</h3>
            <p className="text-sm text-muted-foreground">
              Gaps: 2 → sm:3 → md:4 → lg:6
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <Grid 
              columns={{ default: 2, md: 3 }} 
              gap={{ 
                default: 2, 
                sm: 3, 
                md: 4, 
                lg: 6 
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div 
                  key={i}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center text-purple-800 font-medium"
                >
                  Gap Demo {i + 1}
                </div>
              ))}
            </Grid>
          </div>
        </div>

        {/* Performance monitor */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Performance Monitor</h3>
            <p className="text-sm text-muted-foreground">
              Watch how the system handles responsive changes
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-600">Render Count:</span>
                <div className="text-slate-900 font-bold">{resizeCount}</div>
              </div>
              <div>
                <span className="text-slate-600">Screen Ratio:</span>
                <div className="text-slate-900 font-bold">
                  {(width / height).toFixed(2)}:1
                </div>
              </div>
              <div>
                <span className="text-slate-600">Orientation:</span>
                <div className="text-slate-900 font-bold">
                  {width > height ? 'Landscape' : 'Portrait'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Try These Actions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Resize your browser window to see responsive changes</li>
          <li>• Use browser dev tools to simulate different devices</li>
          <li>• Notice how grid columns, gaps, and visibility change</li>
          <li>• Observe the performance metrics as you resize</li>
        </ul>
      </div>
    </div>
  );
};

ResponsiveDemo.displayName = 'ResponsiveDemo';