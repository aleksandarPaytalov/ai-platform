'use client';

import React from 'react';
//

import { Card } from '@/components/ui/card/Card';
import { CardContent } from '@/components/ui/card/CardContent';
import { CardFooter } from '@/components/ui/card/CardFooter';
import { Badge } from '@/components/ui/badge/Badge';
import { StatusBadge } from '@/components/ui/badge/StatusBadge';
import ErrorBoundary from '@/components/ui/error/ErrorBoundary';
import { ErrorMessage } from '@/components/ui/error/ErrorMessage';
import { cn } from '@/lib/utils';
// import { buildCategoryStyle } from '@/lib/supabase/utils/categoryStyle';

import type { AITool, ToolCategory, ToolWithLatestUpdate } from '@/types/database.types';

import { ToolLogo } from './ToolCard/ToolLogo';
import { ToolInfo } from './ToolCard/ToolInfo';
import { UpdateStatus } from './ToolCard/UpdateStatus';
import CardStates from './ToolCard/CardStates';
import { CardActions } from './ToolCard/CardActions';
//

/**
 * ToolCard displays AI tool information with logo, status, description, category and actions.
 * Variants: default, compact, featured. Accessible and responsive.
 */
export interface ToolCardProps {
	tool: AITool | ToolWithLatestUpdate;
	category?: ToolCategory | null;
	className?: string;
	variant?: 'default' | 'compact' | 'featured' | 'detailed';
	/** Deprecated: use variant="compact" */
	compact?: boolean;
	disabled?: boolean;
	/** Selection state for multi-select scenarios */
	selected?: boolean;
	/** Card-level loading state overlay */
	isLoading?: boolean;
	/** Optional error message to render inline */
	error?: string | null;
	'onViewDetails'?: (slug: string) => void;
}

function getStatus(tool: { is_active?: boolean | null }): 'active' | 'inactive' {
	return tool?.is_active ? 'active' : 'inactive';
}

// local relative time helper kept intentionally if needed in future edits

export const ToolCardInner: React.FC<ToolCardProps> = ({
	tool,
	category,
	className,
	variant = 'default',
	compact: legacyCompact = false,
	disabled = false,
	selected = false,
	isLoading = false,
	error = null,
	onViewDetails,
}) => {
	const safeName = tool?.name ?? 'Unknown Tool';
	const safeDesc = tool?.description ?? 'No description available.';
    const safeCategoryName = category?.name ?? (tool as any)?.category_name ?? 'Uncategorized';
    // const safeCategoryColor: string | null = (category as any)?.color_code || (tool as any)?.category_color || null;
    // const categoryStyle = safeCategoryColor ? buildCategoryStyle(safeCategoryColor) : null;
	const websiteUrl = (tool as any)?.website_url as string | null | undefined;
	const updatedAt = (tool as any)?.updated_at as string | null | undefined;
	const latestUpdateDate = (tool as any)?.latest_update_date as string | null | undefined;
	const status = getStatus(tool as any);

	const isCompact = legacyCompact || variant === 'compact';
	const isFeatured = variant === 'featured';
	const isDetailed = variant === 'detailed';

	return (
		<CardStates className={className} interactive={!disabled} disabled={disabled} selected={selected} isLoading={isLoading}>
			<Card
				className={cn(
					'group relative h-full focus-within:ring-2 focus-within:ring-ring',
					variant === 'featured' && 'border-2 border-primary/20 bg-primary/5'
				)}
				interactive
				aria-label={`AI Tool card for ${safeName}`}
				role="article"
			>
				<CardContent padding={isFeatured || isDetailed ? 'lg' : (isCompact ? 'sm' : 'md')} className="flex flex-col gap-3">
					<div className="flex items-start gap-3">
						<ToolLogo name={safeName} logoUrl={(tool as any)?.logo_url || undefined} size={isFeatured ? 72 : isDetailed ? 64 : (isCompact ? 40 : 56)} />
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<StatusBadge status={status} size="sm" animated={status === 'active'}>
									{status === 'active' ? 'Active' : 'Inactive'}
								</StatusBadge>
								<Badge variant="outline" size={isDetailed ? 'md' : 'sm'}>
									{safeCategoryName}
								</Badge>
							</div>
							<ToolInfo
								id={typeof (tool as any)?.id === 'string' ? (tool as any).id : undefined}
								name={safeName}
								description={safeDesc}
								websiteUrl={websiteUrl ?? null}
								categoryName={safeCategoryName}
								headingLevel={3}
								truncatedLines={isFeatured ? 4 : isDetailed ? 5 : (isCompact ? 2 : 3)}
							/>

							{isDetailed && (
								<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
									{websiteUrl && (
										<a
											className="underline underline-offset-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
											href={websiteUrl}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`Open ${safeName} website (new tab)`}
										>
											{websiteUrl}
										</a>
									)}
									{(tool as any)?.slug && (
										<span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground" aria-label="Tool slug">
											{(tool as any).slug}
										</span>
									)}
								</div>
							)}
						</div>
					</div>

					{error && (
						<div className="mt-3">
							<ErrorMessage message="Failed to load tool" description={error} type="error" />
						</div>
					)}
				</CardContent>

				<CardFooter justify="between" padding={variant === 'featured' ? 'lg' : (isCompact ? 'sm' : 'md')} bordered>
					<UpdateStatus
						latestUpdateDate={(latestUpdateDate || updatedAt) ?? null}
						latestUpdateImpact={(tool as any)?.latest_update_impact as any}
						recentUpdateCount={null}
						aria-live="polite"
						onClickUpdates={onViewDetails && (tool as any)?.slug ? () => onViewDetails?.((tool as any).slug) : undefined}
					/>
					<CardActions
						toolSlug={(tool as any)?.slug}
						websiteUrl={websiteUrl ?? null}
						onViewDetails={onViewDetails}
					/>
				</CardFooter>
			</Card>
		</CardStates>
	);
};

const ToolCard: React.FC<ToolCardProps> = React.memo((props) => {
    return (
        <ErrorBoundary>
            <ToolCardInner {...props} />
        </ErrorBoundary>
    );
});
ToolCard.displayName = 'ToolCard';

export default ToolCard;


