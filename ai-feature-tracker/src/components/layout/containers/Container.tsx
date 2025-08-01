import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  centerContent?: boolean;
  as?: keyof JSX.IntrinsicElements;
  'data-testid'?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

const paddingClasses = {
  0: 'px-0',
  1: 'px-1',
  2: 'px-2',
  3: 'px-3',
  4: 'px-4',
  5: 'px-5',
  6: 'px-6',
  8: 'px-8',
  10: 'px-10',
  12: 'px-12',
  16: 'px-16',
  20: 'px-20',
  24: 'px-24',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'xl',
  padding = { default: 4 },
  centerContent = true,
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

  // Build responsive padding classes
  const paddingClassNames = [
    padding.default && paddingClasses[padding.default as keyof typeof paddingClasses],
    padding.sm && `sm:${paddingClasses[padding.sm as keyof typeof paddingClasses]}`,
    padding.md && `md:${paddingClasses[padding.md as keyof typeof paddingClasses]}`,
    padding.lg && `lg:${paddingClasses[padding.lg as keyof typeof paddingClasses]}`,
    padding.xl && `xl:${paddingClasses[padding.xl as keyof typeof paddingClasses]}`,
    padding['2xl'] && `2xl:${paddingClasses[padding['2xl'] as keyof typeof paddingClasses]}`,
  ].filter(Boolean);

  return (
    <Component
      className={cn(
        'w-full',
        sizeClasses[size],
        centerContent && 'mx-auto',
        ...paddingClassNames,
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

Container.displayName = 'Container';