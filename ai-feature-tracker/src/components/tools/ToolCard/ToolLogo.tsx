'use client';

import React from 'react';
import Image from 'next/image';
import { SkeletonImage } from '@/components/ui/loading/SkeletonImage';
import { cn } from '@/lib/utils';

export interface ToolLogoProps {
	name: string;
	logoUrl?: string | null;
	size?: number; // px
	className?: string;
	alt?: string;
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).slice(0, 2);
	const letters = parts.map(p => p.charAt(0)).join('');
	return letters.toUpperCase() || 'AI';
}

function ToolLogoBase({
	name,
	logoUrl,
	size = 56,
	className,
	alt,
}: ToolLogoProps) {
	const [errored, setErrored] = React.useState(false);
	const [loading, setLoading] = React.useState(Boolean(logoUrl));
	const dimension = size;
	const ariaLabel = alt || `${name} logo`;

	const showFallback = !logoUrl || errored;

	return (
		<div
			className={cn(
				'flex items-center justify-center rounded-md bg-muted text-foreground/80 border border-border overflow-hidden',
				'transition-transform duration-200 group-hover:scale-[1.03]',
				className,
			)}
			style={{ width: dimension, height: dimension }}
			aria-label={ariaLabel}
			role="img"
		>
			{loading && !showFallback ? (
				<SkeletonImage size="custom" width={`${dimension}px`} height={`${dimension}px`} rounded="medium" showIcon />
			) : showFallback ? (
				<span className="font-semibold" aria-hidden="true">
					{getInitials(name)}
				</span>
			) : (
				<Image
					src={logoUrl as string}
					alt={ariaLabel}
					width={dimension}
					height={dimension}
					className="object-contain"
					loading="lazy"
					onError={() => { setErrored(true); setLoading(false); }}
					onLoad={() => setLoading(false)}
				/>
			)}
		</div>
	);
}

export const ToolLogo = React.memo(ToolLogoBase);
ToolLogo.displayName = 'ToolLogo';

export default ToolLogo;


