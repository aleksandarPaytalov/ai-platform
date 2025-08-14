'use client';

import React from 'react';
import { Button } from '@/components/ui/button/Button';
import { Link as UILink } from '@/components/ui/navigation/Link';
import { IconButton } from '@/components/ui/button/IconButton';
import { cn } from '@/lib/utils';

export interface CardActionsProps {
	toolSlug?: string | null;
	websiteUrl?: string | null;
	onViewDetails?: ((slug: string) => void) | undefined;
	onBookmark?: () => void;
	onShare?: () => void;
	isLoading?: boolean;
	className?: string;
}

export const CardActions: React.FC<CardActionsProps> = ({
    toolSlug,
    websiteUrl,
    onViewDetails,
    onBookmark,
    onShare,
    isLoading = false,
    className,
}) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && (navigator as any).share) {
            try {
                await (navigator as any).share({
                    title: 'AI Tool',
                    text: 'Check out this AI tool',
                    url: websiteUrl || (toolSlug ? `/tools/${toolSlug}` : undefined),
                });
                return;
            } catch {
                // fall through
            }
        }
        onShare?.();
    };

    const toggleMenu = (open?: boolean) => setMenuOpen(prev => (open !== undefined ? open : !prev));

    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleMenu(true);
    };

    return (
        <div className={cn('flex items-center gap-2 relative', className)} onContextMenu={onContextMenu}>
			{toolSlug && onViewDetails && (
				<Button
					variant="secondary"
					size="sm"
					loading={isLoading}
					onClick={() => onViewDetails(toolSlug)}
					aria-label="View details"
				>
					View Details
				</Button>
			)}

			{websiteUrl && (
				<UILink
					href={websiteUrl}
					variant="default"
					size="sm"
					external
					underline="hover"
					aria-label="Visit website (opens in new tab)"
				>
					Visit Website
				</UILink>
			)}

            <IconButton
                variant="ghost"
                size="lg"
                icon={<span>☆</span>}
                aria-label="Bookmark tool"
                onClick={onBookmark}
                disabled={!onBookmark}
            />

            <IconButton
                variant="ghost"
                size="lg"
                icon={<span>↗</span>}
                aria-label="Share tool"
                onClick={handleShare}
            />

            {menuOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label="Tool actions menu"
                    className="absolute right-0 top-full mt-2 min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50"
                >
                    <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                        role="menuitem"
                        onClick={() => { onBookmark?.(); toggleMenu(false); }}
                    >
                        Bookmark
                    </button>
                    <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                        role="menuitem"
                        onClick={() => { handleShare(); toggleMenu(false); }}
                    >
                        Share
                    </button>
                    {websiteUrl && (
                        <a
                            href={websiteUrl}
                            className="block px-3 py-2 text-sm hover:bg-accent"
                            role="menuitem"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Website
                        </a>
                    )}
                </div>
            )}
		</div>
	);
};

export default CardActions;


