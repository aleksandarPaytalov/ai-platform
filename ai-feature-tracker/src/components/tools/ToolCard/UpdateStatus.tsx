'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge/Badge';
import { cn } from '@/lib/utils';
import type { ImpactLevel } from '@/types/database.types';

export interface UpdateStatusProps {
	latestUpdateDate?: string | null;
	latestUpdateImpact?: ImpactLevel | string | null;
	recentUpdateCount?: number | null;
	isLoading?: boolean;
	className?: string;
	onClickUpdates?: (() => void) | undefined;
    'aria-live'?: 'polite' | 'assertive';
}

function formatRelative(dateIso?: string | null): string {
	if (!dateIso) return 'Unknown';
	const date = new Date(dateIso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const sec = Math.floor(diffMs / 1000);
	if (sec < 60) return 'just now';
	const min = Math.floor(sec / 60);
	if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`;
	const hrs = Math.floor(min / 60);
	if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
	const days = Math.floor(hrs / 24);
	return `${days} day${days === 1 ? '' : 's'} ago`;
}

function impactVariant(level?: string | null): 'success' | 'warning' | 'error' | 'info' | 'outline' {
	if (!level) return 'outline';
	const v = String(level).toLowerCase();
	if (v === 'high') return 'error';
	if (v === 'medium') return 'warning';
	if (v === 'low') return 'success';
	return 'info';
}

function UpdateStatusBase({
	latestUpdateDate,
	latestUpdateImpact,
	recentUpdateCount = 0,
	isLoading = false,
	className,
	onClickUpdates,
    'aria-live': ariaLive = 'polite',
}: UpdateStatusProps) {
    const hasNew = Boolean(recentUpdateCount && recentUpdateCount > 0);
    const freshness = getFreshness(latestUpdateDate);

	return (
		<div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)} aria-live={ariaLive} aria-busy={isLoading}>
			{hasNew && (
				<span
					className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary"
					aria-label="New updates available"
				/>
			)}

            <Badge variant={impactVariant(latestUpdateImpact)} size="sm" aria-label={`Impact: ${latestUpdateImpact ?? 'Unknown'}`}>
				{latestUpdateImpact ?? 'Unknown'}
			</Badge>

            <span aria-live="polite">Last updated: {formatRelative(latestUpdateDate)}</span>

            <span className="text-muted-foreground/80" aria-label={`Freshness: ${freshness}`}>
                {freshness}
            </span>

			{typeof recentUpdateCount === 'number' && (
				<button
					type="button"
					className="ml-2 text-xs font-medium text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
					onClick={onClickUpdates}
					aria-label={`${recentUpdateCount} recent ${recentUpdateCount === 1 ? 'update' : 'updates'}`}
				>
					{recentUpdateCount} {recentUpdateCount === 1 ? 'update' : 'updates'}
				</button>
			)}
		</div>
	);
}

export const UpdateStatus = React.memo(UpdateStatusBase);
UpdateStatus.displayName = 'UpdateStatus';

// Freshness helpers
function getFreshness(dateIso?: string | null): 'new' | 'recent' | 'outdated' | 'unknown' {
    if (!dateIso) return 'unknown';
    const date = new Date(dateIso);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 2) return 'new';
    if (days <= 14) return 'recent';
    return 'outdated';
}


export default UpdateStatus;


