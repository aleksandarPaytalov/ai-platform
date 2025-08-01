import React from 'react';
import { cn } from '@/lib/utils';

export interface CenterProps {
  children: React.ReactNode;
  className?: string;
  axis?: 'horizontal' | 'vertical' | 'both';
  inline?: boolean;
  as?: keyof JSX.IntrinsicElements;
  'data-testid'?: string;
}

const axisClasses = {
  horizontal: 'justify-center',
  vertical: 'items-center',
  both: 'justify-center items-center',
};

export const Center: React.FC<CenterProps> = ({
  children,
  className,
  axis = 'both',
  inline = false,
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={cn(
        'flex',
        inline ? 'inline-flex' : 'flex',
        axisClasses[axis],
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

Center.displayName = 'Center';