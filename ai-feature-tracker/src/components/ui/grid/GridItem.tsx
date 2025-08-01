import React from 'react';
import { cn } from '@/lib/utils';

export interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  start?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  end?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  rowSpan?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  as?: keyof JSX.IntrinsicElements;
  'data-testid'?: string;
}

const spanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
  full: 'col-span-full',
};

const startClasses = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  7: 'col-start-7',
  8: 'col-start-8',
  9: 'col-start-9',
  10: 'col-start-10',
  11: 'col-start-11',
  12: 'col-start-12',
  13: 'col-start-13',
  auto: 'col-start-auto',
};

const endClasses = {
  1: 'col-end-1',
  2: 'col-end-2',
  3: 'col-end-3',
  4: 'col-end-4',
  5: 'col-end-5',
  6: 'col-end-6',
  7: 'col-end-7',
  8: 'col-end-8',
  9: 'col-end-9',
  10: 'col-end-10',
  11: 'col-end-11',
  12: 'col-end-12',
  13: 'col-end-13',
  auto: 'col-end-auto',
};

const rowSpanClasses = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
  full: 'row-span-full',
};

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
  start,
  end,
  rowSpan,
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

  // Build responsive span classes
  const spanClassNames = span ? [
    span.default && spanClasses[span.default as keyof typeof spanClasses],
    span.sm && `sm:${spanClasses[span.sm as keyof typeof spanClasses]}`,
    span.md && `md:${spanClasses[span.md as keyof typeof spanClasses]}`,
    span.lg && `lg:${spanClasses[span.lg as keyof typeof spanClasses]}`,
    span.xl && `xl:${spanClasses[span.xl as keyof typeof spanClasses]}`,
    span['2xl'] && `2xl:${spanClasses[span['2xl'] as keyof typeof spanClasses]}`,
  ].filter(Boolean) : [];

  // Build responsive start classes
  const startClassNames = start ? [
    start.default && startClasses[start.default as keyof typeof startClasses],
    start.sm && `sm:${startClasses[start.sm as keyof typeof startClasses]}`,
    start.md && `md:${startClasses[start.md as keyof typeof startClasses]}`,
    start.lg && `lg:${startClasses[start.lg as keyof typeof startClasses]}`,
    start.xl && `xl:${startClasses[start.xl as keyof typeof startClasses]}`,
    start['2xl'] && `2xl:${startClasses[start['2xl'] as keyof typeof startClasses]}`,
  ].filter(Boolean) : [];

  // Build responsive end classes
  const endClassNames = end ? [
    end.default && endClasses[end.default as keyof typeof endClasses],
    end.sm && `sm:${endClasses[end.sm as keyof typeof endClasses]}`,
    end.md && `md:${endClasses[end.md as keyof typeof endClasses]}`,
    end.lg && `lg:${endClasses[end.lg as keyof typeof endClasses]}`,
    end.xl && `xl:${endClasses[end.xl as keyof typeof endClasses]}`,
    end['2xl'] && `2xl:${endClasses[end['2xl'] as keyof typeof endClasses]}`,
  ].filter(Boolean) : [];

  // Build responsive row span classes
  const rowSpanClassNames = rowSpan ? [
    rowSpan.default && rowSpanClasses[rowSpan.default as keyof typeof rowSpanClasses],
    rowSpan.sm && `sm:${rowSpanClasses[rowSpan.sm as keyof typeof rowSpanClasses]}`,
    rowSpan.md && `md:${rowSpanClasses[rowSpan.md as keyof typeof rowSpanClasses]}`,
    rowSpan.lg && `lg:${rowSpanClasses[rowSpan.lg as keyof typeof rowSpanClasses]}`,
    rowSpan.xl && `xl:${rowSpanClasses[rowSpan.xl as keyof typeof rowSpanClasses]}`,
    rowSpan['2xl'] && `2xl:${rowSpanClasses[rowSpan['2xl'] as keyof typeof rowSpanClasses]}`,
  ].filter(Boolean) : [];

  return (
    <Component
      className={cn(
        ...spanClassNames,
        ...startClassNames,
        ...endClassNames,
        ...rowSpanClassNames,
        className
      )}
      data-testid={testId}
      role="gridcell"
      {...props}
    >
      {children}
    </Component>
  );
};

GridItem.displayName = 'GridItem';