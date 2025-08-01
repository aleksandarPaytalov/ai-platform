import React from 'react';
import { cn } from '@/lib/utils';

export interface TwoColumnLayoutProps {
  children: React.ReactNode;
  className?: string;
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  leftWidth?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  rightWidth?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  gap?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  stackOnMobile?: boolean;
  reverseOnMobile?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch';
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

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  children,
  className,
  leftColumn,
  rightColumn,
  leftWidth = { default: '1fr' },
  rightWidth = { default: '1fr' },
  gap = { default: 6 },
  stackOnMobile = true,
  reverseOnMobile = false,
  align = 'stretch',
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

  // Build grid template columns for responsive behavior
  const getGridTemplateColumns = (): React.CSSProperties => {
    return {
      gridTemplateColumns: `${leftWidth.default || '1fr'} ${rightWidth.default || '1fr'}`,
    };
  };

  // If using children instead of separate props
  const content = children ? (
    <>{children}</>
  ) : (
    <>
      <div className="min-w-0">
        {leftColumn}
      </div>
      <div className="min-w-0">
        {rightColumn}
      </div>
    </>
  );

  return (
    <Component
      className={cn(
        'grid w-full',
        stackOnMobile ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
        reverseOnMobile && stackOnMobile && 'flex flex-col-reverse md:grid',
        alignClasses[align],
        ...gapClassNames,
        className
      )}
      style={!stackOnMobile || window?.innerWidth >= 768 ? getGridTemplateColumns() : undefined}
      data-testid={testId}
      {...props}
    >
      {content}
    </Component>
  );
};

TwoColumnLayout.displayName = 'TwoColumnLayout';