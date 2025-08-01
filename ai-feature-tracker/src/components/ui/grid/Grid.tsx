import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
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
  as?: keyof JSX.IntrinsicElements;
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

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
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

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  columns = { default: 1 },
  gap = { default: 4 },
  align = 'stretch',
  justify = 'start',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

  // Build responsive column classes
  const columnClassNames = [
    columns.default && columnClasses[columns.default as keyof typeof columnClasses],
    columns.sm && `sm:${columnClasses[columns.sm as keyof typeof columnClasses]}`,
    columns.md && `md:${columnClasses[columns.md as keyof typeof columnClasses]}`,
    columns.lg && `lg:${columnClasses[columns.lg as keyof typeof columnClasses]}`,
    columns.xl && `xl:${columnClasses[columns.xl as keyof typeof columnClasses]}`,
    columns['2xl'] && `2xl:${columnClasses[columns['2xl'] as keyof typeof columnClasses]}`,
  ].filter(Boolean);

  // Build responsive gap classes
  const gapClassNames = [
    gap.default && gapClasses[gap.default as keyof typeof gapClasses],
    gap.sm && `sm:${gapClasses[gap.sm as keyof typeof gapClasses]}`,
    gap.md && `md:${gapClasses[gap.md as keyof typeof gapClasses]}`,
    gap.lg && `lg:${gapClasses[gap.lg as keyof typeof gapClasses]}`,
    gap.xl && `xl:${gapClasses[gap.xl as keyof typeof gapClasses]}`,
    gap['2xl'] && `2xl:${gapClasses[gap['2xl'] as keyof typeof gapClasses]}`,
  ].filter(Boolean);

  return (
    <Component
      className={cn(
        'grid',
        ...columnClassNames,
        ...gapClassNames,
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      data-testid={testId}
      role="grid"
      {...props}
    >
      {children}
    </Component>
  );
};

Grid.displayName = 'Grid';