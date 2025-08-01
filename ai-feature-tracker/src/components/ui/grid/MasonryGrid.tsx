import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MasonryGridProps {
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
  1: 'columns-1',
  2: 'columns-2',
  3: 'columns-3',
  4: 'columns-4',
  5: 'columns-5',
  6: 'columns-6',
  7: 'columns-7',
  8: 'columns-8',
  9: 'columns-9',
  10: 'columns-10',
  11: 'columns-11',
  12: 'columns-12',
};

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  className,
  columns = { default: 2 },
  gap = { default: 4 },
  as = 'div',
  'data-testid': testId,
  ...props
}) => {
  const Component = as;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);

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

  // Handle masonry layout adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsLayoutComplete(false);
      // Trigger re-layout
      setTimeout(() => setIsLayoutComplete(true), 100);
    };

    // Initial layout
    setIsLayoutComplete(true);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  // Process children to add masonry-specific styles
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        key: index,
        className: cn(
          'break-inside-avoid mb-0',
          child.props.className
        ),
        style: {
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
          ...child.props.style,
        },
      });
    }
    return child;
  });

  return (
    <Component
      ref={containerRef}
      className={cn(
        ...columnClassNames,
        ...gapClassNames,
        'transition-opacity duration-200',
        isLayoutComplete ? 'opacity-100' : 'opacity-90',
        className
      )}
      data-testid={testId}
      role="grid"
      style={{
        columnFill: 'balance',
      }}
      {...props}
    >
      {processedChildren}
    </Component>
  );
};

MasonryGrid.displayName = 'MasonryGrid';