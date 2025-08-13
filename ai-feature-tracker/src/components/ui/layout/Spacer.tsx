import React from 'react';
import { cn } from '@/lib/utils';

export interface SpacerProps {
  className?: string;
  size?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  direction?: 'horizontal' | 'vertical' | 'both';
  as?: React.ElementType;
  'data-testid'?: string;
}

const sizeClasses = {
  horizontal: {
    0: 'w-0',
    1: 'w-1',
    2: 'w-2',
    3: 'w-3',
    4: 'w-4',
    5: 'w-5',
    6: 'w-6',
    8: 'w-8',
    10: 'w-10',
    12: 'w-12',
    16: 'w-16',
    20: 'w-20',
    24: 'w-24',
    32: 'w-32',
  },
  vertical: {
    0: 'h-0',
    1: 'h-1',
    2: 'h-2',
    3: 'h-3',
    4: 'h-4',
    5: 'h-5',
    6: 'h-6',
    8: 'h-8',
    10: 'h-10',
    12: 'h-12',
    16: 'h-16',
    20: 'h-20',
    24: 'h-24',
    32: 'h-32',
  },
  both: {
    0: 'w-0 h-0',
    1: 'w-1 h-1',
    2: 'w-2 h-2',
    3: 'w-3 h-3',
    4: 'w-4 h-4',
    5: 'w-5 h-5',
    6: 'w-6 h-6',
    8: 'w-8 h-8',
    10: 'w-10 h-10',
    12: 'w-12 h-12',
    16: 'w-16 h-16',
    20: 'w-20 h-20',
    24: 'w-24 h-24',
    32: 'w-32 h-32',
  },
};

export const Spacer: React.FC<SpacerProps> = ({
  className,
  size = { default: 4 },
  direction = 'vertical',
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component: React.ElementType = as || 'div';

  // Build responsive size classes
  const sizeClassMap = sizeClasses[direction];
  const sizeClassNames = [
    size.default && sizeClassMap[size.default as keyof typeof sizeClassMap],
    size.sm && `sm:${sizeClassMap[size.sm as keyof typeof sizeClassMap]}`,
    size.md && `md:${sizeClassMap[size.md as keyof typeof sizeClassMap]}`,
    size.lg && `lg:${sizeClassMap[size.lg as keyof typeof sizeClassMap]}`,
    size.xl && `xl:${sizeClassMap[size.xl as keyof typeof sizeClassMap]}`,
    size['2xl'] && `2xl:${sizeClassMap[size['2xl'] as keyof typeof sizeClassMap]}`,
  ].filter(Boolean);

  return (
    <Component
      className={cn(
        'flex-shrink-0',
        direction === 'horizontal' && 'inline-block',
        direction === 'vertical' && 'block',
        direction === 'both' && 'block',
        ...sizeClassNames,
        className
      )}
      data-testid={testId}
      aria-hidden="true"
      {...props}
    />
  );
};

Spacer.displayName = 'Spacer';