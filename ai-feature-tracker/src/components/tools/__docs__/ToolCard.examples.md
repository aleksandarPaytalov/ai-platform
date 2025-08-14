### ToolCard Usage Examples

Basic default:

```tsx
<ToolCard tool={tool} onViewDetails={(slug) => router.push(`/tools/${slug}`)} />
```

Compact:

```tsx
<ToolCard tool={tool} variant="compact" />
```

Featured:

```tsx
<ToolCard tool={tool} variant="featured" selected />
```

Detailed:

```tsx
<ToolCard tool={toolWithLatestUpdate} variant="detailed" />
```

Skeleton during load:

```tsx
<ToolCardSkeleton />
```


### Integration examples with data hooks (Task 5.1)

Using tools with latest updates:

```tsx
'use client';

import React from 'react';
import { ToolCard, ToolCardSkeleton } from '@/components/tools';
import { useToolsWithLatestUpdates } from '@/lib/supabase/hooks/useTools';
import { ErrorMessage } from '@/components/ui/error/ErrorMessage';

export function ToolsWithUpdatesList() {
	const { tools, isLoading, error } = useToolsWithLatestUpdates();

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<ToolCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error) {
		return <ErrorMessage message="Failed to load tools" description={error} type="error" />;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{tools.map((tool) => (
				<ToolCard key={tool.id} tool={tool} variant="default" />
			))}
		</div>
	);
}
```

Single tool by slug:

```tsx
'use client';

import React from 'react';
import { ToolCard, ToolCardSkeleton } from '@/components/tools';
import { useToolBySlug } from '@/lib/supabase/hooks/useTools';
import { ErrorMessage } from '@/components/ui/error/ErrorMessage';

export function ToolBySlug({ slug }: { slug: string }) {
	const { tool, isLoading, error, exists } = useToolBySlug(slug);

	if (isLoading) return <ToolCardSkeleton />;
	if (error) return <ErrorMessage message="Failed to load tool" description={error} type="error" />;
	if (!exists || !tool) return <ErrorMessage message="Tool not found" type="warning" />;

	return <ToolCard tool={tool} variant="detailed" />;
}
```

Tools filtered by category:

```tsx
'use client';

import React from 'react';
import { ToolCard, ToolCardSkeleton } from '@/components/tools';
import { useToolsByCategory } from '@/lib/supabase/hooks/useTools';

export function ToolsByCategory({ categoryId }: { categoryId: string }) {
	const { tools, isLoading } = useToolsByCategory(categoryId);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{isLoading
				? Array.from({ length: 4 }).map((_, i) => <ToolCardSkeleton key={i} />)
				: tools.map((tool) => <ToolCard key={tool.id} tool={tool} variant="compact" />)}
		</div>
	);
}
```


