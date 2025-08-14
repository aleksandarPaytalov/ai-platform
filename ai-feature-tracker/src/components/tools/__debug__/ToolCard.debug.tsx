import React from 'react';
import { ToolCard, ToolCardSkeleton } from '@/components/tools';
import { useToolsWithLatestUpdates } from '@/lib/supabase/hooks/useTools';
import { ErrorMessage } from '@/components/ui/error/ErrorMessage';

export function ToolCardDebug() {
  const { tools, isLoading, error } = useToolsWithLatestUpdates();

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading && Array.from({ length: 6 }).map((_, i) => <ToolCardSkeleton key={i} />)}
      {!isLoading && error && (
        <div className="col-span-full">
          <ErrorMessage message="Failed to load tools" description={error} type="error" />
        </div>
      )}
      {!isLoading && !error && tools.map((tool, i) => (
        <ToolCard key={tool.id ?? tool.slug ?? `tool-${i}`} tool={tool} />
      ))}
    </div>
  );
}

export default ToolCardDebug;


