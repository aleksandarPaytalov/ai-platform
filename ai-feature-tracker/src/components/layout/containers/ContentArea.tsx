import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  spacing?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  maxWidth?: 'none' | 'prose' | 'content' | 'container';
  centerContent?: boolean;
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
  16: 'p-16',
};

const spacingClasses = {
  0: 'space-y-0',
  1: 'space-y-1',
  2: 'space-y-2',
  3: 'space-y-3',
  4: 'space-y-4',
  5: 'space-y-5',
  6: 'space-y-6',
  8: 'space-y-8',
  10: 'space-y-10',
  12: 'space-y-12',
  16: 'space-y-16',
};

const maxWidthClasses = {
  none: '',
  prose: 'max-w-prose',
  content: 'max-w-3xl',
  container: 'max-w-7xl',
};

export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  className,
  padding = { default: 6 },
  spacing = { default: 6 },
  maxWidth = 'content',
  centerContent = true,
  as = 'main',
  'data-testid': testId,
  ...props
}) => {
  const Component: React.ElementType = as || 'main';

  // Build responsive padding classes
  const paddingClassNames = [
    padding.default && paddingClasses[padding.default as keyof typeof paddingClasses],
    padding.sm && `sm:${paddingClasses[padding.sm as keyof typeof paddingClasses]}`,
    padding.md && `md:${paddingClasses[padding.md as keyof typeof paddingClasses]}`,
    padding.lg && `lg:${paddingClasses[padding.lg as keyof typeof paddingClasses]}`,
    padding.xl && `xl:${paddingClasses[padding.xl as keyof typeof paddingClasses]}`,
    padding['2xl'] && `2xl:${paddingClasses[padding['2xl'] as keyof typeof paddingClasses]}`,
  ].filter(Boolean);

  // Build responsive spacing classes
  const spacingClassNames = [
    spacing.default && spacingClasses[spacing.default as keyof typeof spacingClasses],
    spacing.sm && `sm:${spacingClasses[spacing.sm as keyof typeof spacingClasses]}`,
    spacing.md && `md:${spacingClasses[spacing.md as keyof typeof spacingClasses]}`,
    spacing.lg && `lg:${spacingClasses[spacing.lg as keyof typeof spacingClasses]}`,
    spacing.xl && `xl:${spacingClasses[spacing.xl as keyof typeof spacingClasses]}`,
    spacing['2xl'] && `2xl:${spacingClasses[spacing['2xl'] as keyof typeof spacingClasses]}`,
  ].filter(Boolean);

  return (
    <Component
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        centerContent && maxWidth !== 'none' && 'mx-auto',
        ...paddingClassNames,
        ...spacingClassNames,
        className
      )}
      data-testid={testId}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

ContentArea.displayName = 'ContentArea';