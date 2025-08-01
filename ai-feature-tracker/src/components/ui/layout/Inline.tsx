import React from 'react';
import { cn } from '@/lib/utils';

export interface InlineProps {
  children: React.ReactNode;
  className?: string;
  gap?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
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
  20: 'gap-20',
  24: 'gap-24',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Inline: React.FC<InlineProps> = ({
  children,
  className,
  gap = { default: 2 },
  align = 'center',
  justify = 'start',
  wrap = true,
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

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
        'flex flex-row',
        ...gapClassNames,
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

Inline.displayName = 'Inline';