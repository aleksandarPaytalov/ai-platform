'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge/Badge';
import { SkeletonText } from '@/components/ui/loading/SkeletonText';
import { cn } from '@/lib/utils';

export interface ToolInfoProps {
	id?: string;
	name: string;
	description?: string | null;
	websiteUrl?: string | null;
	categoryName?: string | null;
	headingLevel?: 2 | 3 | 4;
	truncatedLines?: number;
	isLoading?: boolean;
	className?: string;
    richText?: boolean;
}

function ToolInfoBase({
	id,
	name,
    description,
	websiteUrl,
	categoryName,
	headingLevel = 3,
	truncatedLines = 3,
	isLoading = false,
	className,
    richText = false,
}: ToolInfoProps) {
	const [expanded, setExpanded] = React.useState(false);

    const headingTag: 'h2' | 'h3' | 'h4' = headingLevel === 2 ? 'h2' : headingLevel === 3 ? 'h3' : 'h4';

	if (isLoading) {
		return (
			<div className={cn('min-w-0 flex-1 space-y-2', className)}>
				<SkeletonText lines={1} size="medium" widthPattern="varied" />
				<SkeletonText lines={2} size="small" widthPattern="varied" />
			</div>
		);
	}

	const hasDescription = Boolean(description && description.trim().length > 0);

	return (
        <div className={cn('min-w-0 flex-1', className)}>
            {React.createElement(
                headingTag,
                {
                    id: id ? `tool-title-${id}` : undefined,
                    className: 'text-foreground font-semibold text-lg',
                },
                name
            )}

			<div className="mt-1 flex items-center gap-2">
				{categoryName && (
					<Badge variant="outline" size="sm" aria-label={`Category: ${categoryName}`}>
						{categoryName}
					</Badge>
				)}

				{websiteUrl && (
					<a
						className="text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
						href={websiteUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit ${name} website (opens in new tab)`}
					>
						Visit website ↗
					</a>
				)}
			</div>

			{hasDescription && (
				<div className="mt-2 text-muted-foreground text-sm">
					{richText ? (
						<div
							id={id ? `tool-description-${id}` : undefined}
							className={cn(expanded ? '' : `line-clamp-${truncatedLines}`)}
							// In a trusted environment, sanitize upstream; here we assume safe HTML
							dangerouslySetInnerHTML={{ __html: description! }}
							aria-label="Tool description"
						/>
					) : (
						<p
							id={id ? `tool-description-${id}` : undefined}
							className={cn(expanded ? '' : `line-clamp-${truncatedLines}`)}
						>
							{description}
						</p>
					)}
					{description && description.length > 160 && (
						<button
							type="button"
							className="mt-1 text-xs font-medium text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
							aria-expanded={expanded}
							aria-controls={id ? `tool-description-${id}` : undefined}
							onClick={() => setExpanded(v => !v)}
						>
							{expanded ? 'Show less' : 'Read more'}
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export const ToolInfo = React.memo(ToolInfoBase);
ToolInfo.displayName = 'ToolInfo';

export default ToolInfo;


