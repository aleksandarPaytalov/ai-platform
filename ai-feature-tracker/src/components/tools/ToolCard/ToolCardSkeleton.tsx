'use client';

import React from 'react';
import { SkeletonText } from '@/components/ui/loading/SkeletonText';
import { cn } from '@/lib/utils';

export interface ToolCardSkeletonProps {
	variant?: 'default' | 'compact' | 'featured';
	className?: string;
}

export const ToolCardSkeleton: React.FC<ToolCardSkeletonProps> = ({ variant = 'default', className }) => {
	const isCompact = variant === 'compact';
	const padding = isCompact ? 'p-4' : 'p-6';

	return (
		<div
			className={cn('bg-card border border-border rounded-lg animate-pulse', padding, className)}
			role="status"
			aria-label="Loading AI tool card"
			aria-busy="true"
		>
			<div className="flex items-start gap-3">
				<div className="rounded-md bg-muted border border-border" style={{ width: isCompact ? 40 : 56, height: isCompact ? 40 : 56 }} />
				<div className="flex-1 space-y-2">
					<div className="bg-muted h-5 w-3/4 rounded" />
					<div className="bg-muted h-3 w-1/2 rounded" />
					<div className="bg-muted h-6 w-20 rounded-full" />
				</div>
			</div>
			<div className="mt-3">
				<SkeletonText lines={isCompact ? 2 : 3} size="small" widthPattern="varied" />
			</div>
			<div className="mt-3 flex items-center justify-between">
				<div className="bg-muted h-3 w-28 rounded" />
				<div className="bg-muted h-3 w-20 rounded" />
			</div>
		</div>
	);
};

export default ToolCardSkeleton;


