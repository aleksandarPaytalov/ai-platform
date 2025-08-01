import React from 'react';
import { cn } from '@/lib/utils';
import { CardGrid } from '../../patterns/CardGrid';
import { ListGrid } from '../../patterns/ListGrid';
import { DashboardGrid } from '../../patterns/DashboardGrid';
import { ToolGrid } from '../../patterns/ToolGrid';
import { Container } from '../../layout/containers/Container';
import { Section } from '../../layout/containers/Section';
import { Stack } from '../../layout/Stack';
import { Inline } from '../../layout/Inline';

export interface LayoutExamplesProps {
  className?: string;
  'data-testid'?: string;
}

const ExampleCard: React.FC<{ 
  title: string; 
  description: string; 
  variant?: 'default' | 'featured' | 'compact';
}> = ({ title, description, variant = 'default' }) => (
  <div className={cn(
    'bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md',
    variant === 'featured' && 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20',
    variant === 'compact' && 'p-3'
  )}>
    <h4 className="font-semibold text-foreground mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
    {variant === 'featured' && (
      <div className="mt-3 inline-flex items-center text-xs font-medium text-primary">
        Featured ✨
      </div>
    )}
  </div>
);

const DashboardWidget: React.FC<{ 
  title: string; 
  value: string; 
  change?: string;
}> = ({ title, value, change }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-muted-foreground text-sm">{title}</h4>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    {change && (
      <div className="text-xs text-green-600 font-medium">
        {change}
      </div>
    )}
  </div>
);

const ToolCard: React.FC<{ 
  name: string; 
  category: string; 
  description: string;
}> = ({ name, category, description }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-foreground">{name}</h4>
      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
        {category}
      </span>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="flex space-x-2">
      <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors">
        Try Now
      </button>
      <button className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80 transition-colors">
        Learn More
      </button>
    </div>
  </div>
);

export const LayoutExamples: React.FC<LayoutExamplesProps> = ({
  className,
  'data-testid': testId,
}) => {
  return (
    <div className={cn('w-full space-y-12', className)} data-testid={testId}>
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Common Layout Patterns</h2>
        <p className="text-muted-foreground">
          Explore real-world layout patterns using the responsive grid system components.
        </p>
      </div>

      {/* Card Grid Example */}
      <Section>
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">Card Grid Layout</h3>
              <p className="text-muted-foreground">
                Perfect for product grids, blog posts, or any card-based content.
              </p>
            </div>
            
            <CardGrid variant="default" equalHeight>
              <ExampleCard
                title="Getting Started"
                description="Learn the basics of our grid system and responsive design principles."
              />
              <ExampleCard
                title="Advanced Patterns"
                description="Explore complex layouts and grid combinations for professional designs."
                variant="featured"
              />
              <ExampleCard
                title="Performance Tips"
                description="Optimize your grids for better performance and user experience."
              />
              <ExampleCard
                title="Accessibility"
                description="Ensure your layouts work for all users with proper accessibility features."
              />
              <ExampleCard
                title="Best Practices"
                description="Follow industry standards and proven patterns for consistent results."
              />
              <ExampleCard
                title="Troubleshooting"
                description="Common issues and solutions when working with responsive grids."
              />
            </CardGrid>
          </Stack>
        </Container>
      </Section>

      {/* Dashboard Layout */}
      <Section background="muted">
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Grid</h3>
              <p className="text-muted-foreground">
                Ideal for dashboards, admin panels, and data visualization.
              </p>
            </div>
            
            <DashboardGrid density="comfortable" minWidgetWidth="240px">
              <DashboardWidget
                title="Total Users"
                value="12,345"
                change="+12% from last month"
              />
              <DashboardWidget
                title="Revenue"
                value="$98,765"
                change="+5% from last month"
              />
              <DashboardWidget
                title="Conversion Rate"
                value="3.2%"
                change="+0.3% from last month"
              />
              <DashboardWidget
                title="Active Sessions"
                value="1,234"
                change="+8% from last hour"
              />
              <DashboardWidget
                title="Page Views"
                value="456,789"
                change="+15% from yesterday"
              />
              <DashboardWidget
                title="Bounce Rate"
                value="42%"
                change="-2% from last week"
              />
            </DashboardGrid>
          </Stack>
        </Container>
      </Section>

      {/* Tool Grid Example */}
      <Section>
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">AI Tools Grid</h3>
              <p className="text-muted-foreground">
                Specifically designed for showcasing AI tools and services.
              </p>
            </div>
            
            <ToolGrid view="card" showFilters>
              <ToolCard
                name="GPT-4"
                category="Language"
                description="Advanced language model for text generation, analysis, and conversation."
              />
              <ToolCard
                name="DALL-E 3"
                category="Image"
                description="Create high-quality images from text descriptions with improved accuracy."
              />
              <ToolCard
                name="Claude"
                category="Assistant"
                description="Helpful AI assistant for analysis, writing, and complex reasoning tasks."
              />
              <ToolCard
                name="Midjourney"
                category="Art"
                description="AI-powered image generation focused on artistic and creative outputs."
              />
              <ToolCard
                name="Whisper"
                category="Audio"
                description="Automatic speech recognition with support for multiple languages."
              />
              <ToolCard
                name="Codex"
                category="Code"
                description="AI coding assistant that understands and generates code in many languages."
              />
            </ToolGrid>
          </Stack>
        </Container>
      </Section>

      {/* List Grid Example */}
      <Section background="muted">
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">List Grid Layout</h3>
              <p className="text-muted-foreground">
                Great for articles, documentation, or any list-based content.
              </p>
            </div>
            
            <ListGrid variant="double" dividers>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Grid Components</h4>
                <p className="text-sm text-muted-foreground">
                  Basic building blocks for creating responsive layouts.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Layout Containers</h4>
                <p className="text-sm text-muted-foreground">
                  Structural components for organizing page content.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Pattern Components</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-built patterns for common use cases.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Responsive Utilities</h4>
                <p className="text-sm text-muted-foreground">
                  Helper functions and hooks for responsive behavior.
                </p>
              </div>
            </ListGrid>
          </Stack>
        </Container>
      </Section>

      {/* Layout Composition Example */}
      <Section>
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">Layout Composition</h3>
              <p className="text-muted-foreground">
                Combining different layout components for complex designs.
              </p>
            </div>
            
            <Stack gap={{ default: 4 }}>
              {/* Header area */}
              <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                <Inline align="center" justify="between">
                  <h4 className="text-lg font-semibold">AI Platform Dashboard</h4>
                  <Inline gap={{ default: 2 }}>
                    <button className="bg-primary-foreground text-primary px-3 py-1 rounded text-sm">
                      Settings
                    </button>
                    <button className="bg-primary-foreground text-primary px-3 py-1 rounded text-sm">
                      Profile
                    </button>
                  </Inline>
                </Inline>
              </div>

              {/* Main content area */}
              <Stack direction={{ default: 'vertical', lg: 'horizontal' }} gap={{ default: 6 }}>
                {/* Main content */}
                <div className="flex-1">
                  <CardGrid variant="compact">
                    <ExampleCard
                      title="Quick Start"
                      description="Get up and running in minutes."
                      variant="compact"
                    />
                    <ExampleCard
                      title="Integrations"
                      description="Connect with your favorite tools."
                      variant="compact"
                    />
                    <ExampleCard
                      title="Analytics"
                      description="Track performance and usage."
                      variant="compact"
                    />
                    <ExampleCard
                      title="Support"
                      description="Get help when you need it."
                      variant="compact"
                    />
                  </CardGrid>
                </div>

                {/* Sidebar */}
                <div className="lg:w-80">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-4">Recent Activity</h4>
                    <Stack gap={{ default: 3 }}>
                      <div className="text-sm">
                        <div className="font-medium">New user registered</div>
                        <div className="text-muted-foreground">2 minutes ago</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">API endpoint updated</div>
                        <div className="text-muted-foreground">1 hour ago</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Database optimized</div>
                        <div className="text-muted-foreground">3 hours ago</div>
                      </div>
                    </Stack>
                  </div>
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Section>

      {/* Usage Guidelines */}
      <Section background="muted">
        <Container>
          <Stack gap={{ default: 6 }}>
            <div>
              <h3 className="text-xl font-semibold mb-2">Usage Guidelines</h3>
              <p className="text-muted-foreground">
                Best practices for implementing these layout patterns.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">Do ✓</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use semantic HTML elements for better accessibility</li>
                  <li>• Test layouts across all breakpoints</li>
                  <li>• Keep consistent spacing throughout your design</li>
                  <li>• Optimize for touch interactions on mobile</li>
                  <li>• Consider loading states for dynamic content</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-red-700">Avoid ✗</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Overcomplicated grid structures</li>
                  <li>• Inconsistent gap sizes between sections</li>
                  <li>• Ignoring mobile-first design principles</li>
                  <li>• Too many columns on small screens</li>
                  <li>• Missing focus states for keyboard navigation</li>
                </ul>
              </div>
            </div>
          </Stack>
        </Container>
      </Section>
    </div>
  );
};

LayoutExamples.displayName = 'LayoutExamples';