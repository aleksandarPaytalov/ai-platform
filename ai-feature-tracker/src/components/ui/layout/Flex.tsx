import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    sm?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    md?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    lg?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    xl?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    '2xl'?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  };
  wrap?: {
    default?: boolean | 'reverse';
    sm?: boolean | 'reverse';
    md?: boolean | 'reverse';
    lg?: boolean | 'reverse';
    xl?: boolean | 'reverse';
    '2xl'?: boolean | 'reverse';
  };
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
  inline?: boolean;
  as?: keyof JSX.IntrinsicElements;
  'data-testid'?: string;
}

const directionClasses = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

const wrapClasses = {
  true: 'flex-wrap',
  false: 'flex-nowrap',
  reverse: 'flex-wrap-reverse',
};

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

export const Flex: React.FC<FlexProps> = ({
  children,
  className,
  direction = { default: 'row' },
  wrap = { default: false },
  gap = { default: 0 },
  align = 'stretch',
  justify = 'start',
  inline = false,
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

  // Build responsive direction classes
  const directionClassNames = [
    direction.default && directionClasses[direction.default],
    direction.sm && `sm:${directionClasses[direction.sm]}`,
    direction.md && `md:${directionClasses[direction.md]}`,
    direction.lg && `lg:${directionClasses[direction.lg]}`,
    direction.xl && `xl:${directionClasses[direction.xl]}`,
    direction['2xl'] && `2xl:${directionClasses[direction['2xl']]}`,
  ].filter(Boolean);

  // Build responsive wrap classes
  const wrapClassNames = [
    wrap.default !== undefined && wrapClasses[wrap.default as keyof typeof wrapClasses],
    wrap.sm !== undefined && `sm:${wrapClasses[wrap.sm as keyof typeof wrapClasses]}`,
    wrap.md !== undefined && `md:${wrapClasses[wrap.md as keyof typeof wrapClasses]}`,
    wrap.lg !== undefined && `lg:${wrapClasses[wrap.lg as keyof typeof wrapClasses]}`,
    wrap.xl !== undefined && `xl:${wrapClasses[wrap.xl as keyof typeof wrapClasses]}`,
    wrap['2xl'] !== undefined && `2xl:${wrapClasses[wrap['2xl'] as keyof typeof wrapClasses]}`,
  ].filter(Boolean);

  // Build responsive gap classes
  const gapClassNames = [
    gap.default !== undefined && gapClasses[gap.default as keyof typeof gapClasses],
    gap.sm !== undefined && `sm:${gapClasses[gap.sm as keyof typeof gapClasses]}`,
    gap.md !== undefined && `md:${gapClasses[gap.md as keyof typeof gapClasses]}`,
    gap.lg !== undefined && `lg:${gapClasses[gap.lg as keyof typeof gapClasses]}`,
    gap.xl !== undefined && `xl:${gapClasses[gap.xl as keyof typeof gapClasses]}`,
    gap['2xl'] !== undefined && `2xl:${gapClasses[gap['2xl'] as keyof typeof gapClasses]}`,
  ].filter(Boolean);

  return (
    <Component
      className={cn(
        inline ? 'inline-flex' : 'flex',
        ...directionClassNames,
        ...wrapClassNames,
        ...gapClassNames,
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

Flex.displayName = 'Flex';