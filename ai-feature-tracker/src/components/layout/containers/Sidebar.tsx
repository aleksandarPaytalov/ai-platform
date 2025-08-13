import React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
  width?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  padding?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  sticky?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  as?: React.ElementType;
  'data-testid'?: string;
}

const paddingClasses = {
  0: 'p-0',
  1: 'p-1',
  2: 'p-2',
  3: 'p-3',
  4: 'p-4',
  5: 'p-5',
  6: 'p-6',
  8: 'p-8',
  10: 'p-10',
  12: 'p-12',
};

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  position = 'left',
  width = { default: '256px', md: '320px' },
  padding = { default: 4 },
  sticky = false,
  collapsible = false,
  collapsed = false,
  onToggle,
  as = 'aside',
  'data-testid': testId,
  ...props
}) => {
  const Component: React.ElementType = as || 'aside';

  // Build responsive padding classes
  const paddingClassNames = [
    padding.default && paddingClasses[padding.default as keyof typeof paddingClasses],
    padding.sm && `sm:${paddingClasses[padding.sm as keyof typeof paddingClasses]}`,
    padding.md && `md:${paddingClasses[padding.md as keyof typeof paddingClasses]}`,
    padding.lg && `lg:${paddingClasses[padding.lg as keyof typeof paddingClasses]}`,
    padding.xl && `xl:${paddingClasses[padding.xl as keyof typeof paddingClasses]}`,
    padding['2xl'] && `2xl:${paddingClasses[padding['2xl'] as keyof typeof paddingClasses]}`,
  ].filter(Boolean);

  // Build responsive width styles
  const getWidthStyles = (): React.CSSProperties => {
    const baseWidth = collapsed ? '0px' : (width.default || '256px');
    return {
      width: baseWidth,
      minWidth: collapsed ? '0px' : baseWidth,
      maxWidth: width.xl || width.lg || width.md || width.default || '320px',
    };
  };

  return (
    <Component
      className={cn(
        'flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out',
        position === 'right' && 'order-last',
        sticky && 'sticky top-0',
        collapsed && 'w-0 min-w-0',
        !collapsed && 'border-r border-border',
        position === 'right' && !collapsed && 'border-r-0 border-l',
        ...paddingClassNames,
        className
      )}
      style={getWidthStyles()}
      data-testid={testId}
      role="complementary"
      aria-label={`${position} sidebar`}
      {...(props as any)}
    >
      <div className={cn(
        'h-full overflow-y-auto',
        !collapsed && 'space-y-4'
      )}>
        {collapsible && (
          <button
            onClick={onToggle}
            className={cn(
              'w-full p-2 text-left hover:bg-accent rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              collapsed && 'hidden'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-sm font-medium">
              {collapsed ? '→' : '←'}
            </span>
          </button>
        )}
        {!collapsed && children}
      </div>
    </Component>
  );
};

Sidebar.displayName = 'Sidebar';