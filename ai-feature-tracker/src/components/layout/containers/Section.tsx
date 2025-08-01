import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  background?: 'none' | 'primary' | 'secondary' | 'muted' | 'accent';
  fullWidth?: boolean;
  as?: keyof JSX.IntrinsicElements;
  'data-testid'?: string;
}

const spacingClasses = {
  0: 'py-0',
  1: 'py-1',
  2: 'py-2',
  4: 'py-4',
  6: 'py-6',
  8: 'py-8',
  12: 'py-12',
  16: 'py-16',
  20: 'py-20',
  24: 'py-24',
  32: 'py-32',
};

const backgroundClasses = {
  none: '',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  muted: 'bg-muted text-muted-foreground',
  accent: 'bg-accent text-accent-foreground',
};

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  spacing = { default: 16 },
  background = 'none',
  fullWidth = false,
  as = 'section',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

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
        !fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        fullWidth && 'px-0',
        ...spacingClassNames,
        backgroundClasses[background],
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

Section.displayName = 'Section';