'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardStatesProps extends React.HTMLAttributes<HTMLDivElement> {
	interactive?: boolean;
	selected?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	hasError?: boolean;
}

export const CardStates = React.forwardRef<HTMLDivElement, CardStatesProps>(
	({ className, interactive = true, selected = false, disabled = false, isLoading = false, hasError = false, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'relative rounded-lg border bg-card text-card-foreground',
					'shadow-sm transition-all duration-200',
					interactive && 'hover:shadow-md hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring',
					selected && 'ring-2 ring-primary',
					disabled && 'opacity-60 pointer-events-none',
					hasError && 'border-red-300',
					className
				)}
				aria-disabled={disabled || undefined}
				aria-selected={selected || undefined}
				{...props}
			>
				{isLoading && (
					<div
						className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center"
						aria-busy="true"
						aria-label="Loading"
					/>
				)}
				{children}
			</div>
		);
	}
);

CardStates.displayName = 'CardStates';

export default CardStates;


