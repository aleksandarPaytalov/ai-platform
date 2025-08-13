import React from 'react';
import { cn } from '@/lib/utils';

export interface AutoGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  maxColumns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  as?: React.ElementType;
  'data-testid'?: string;
}

const gapClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-items-start',
  end: 'justify-items-end',
  center: 'justify-items-center',
  between: 'justify-items-between',
  around: 'justify-items-around',
  evenly: 'justify-items-evenly',
};

const getAutoGridStyle = (
  minWidth: string, 
  maxCols?: number
): React.CSSProperties => {
  const maxColsConstraint = maxCols ? `, ${maxCols}fr` : '';
  return {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}${maxColsConstraint}))`,
  };
};

export const AutoGrid: React.FC<AutoGridProps> = ({
  children,
  className,
  minItemWidth = { default: '250px' },
  maxColumns,
  gap = { default: 4 },
  align = 'stretch',
  justify = 'start',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component: React.ElementType = as || 'div';

  // Build responsive gap classes
  const gapClassNames = [
    gap.default && gapClasses[gap.default as keyof typeof gapClasses],
    gap.sm && `sm:${gapClasses[gap.sm as keyof typeof gapClasses]}`,
    gap.md && `md:${gapClasses[gap.md as keyof typeof gapClasses]}`,
    gap.lg && `lg:${gapClasses[gap.lg as keyof typeof gapClasses]}`,
    gap.xl && `xl:${gapClasses[gap.xl as keyof typeof gapClasses]}`,
    gap['2xl'] && `2xl:${gapClasses[gap['2xl'] as keyof typeof gapClasses]}`,
  ].filter(Boolean);

  // Build responsive styles for auto-fit grid
  const baseStyle = getAutoGridStyle(
    minItemWidth.default || '250px',
    maxColumns?.default
  );

  // Create media query styles for responsive behavior
  const responsiveStyles: React.CSSProperties = {
    ...baseStyle,
  };

  return (
    <Component
      className={cn(
        'grid',
        ...gapClassNames,
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      style={responsiveStyles}
      data-testid={testId}
      role="grid"
      {...props}
    >
      {children}
    </Component>
  );
};

AutoGrid.displayName = 'AutoGrid';