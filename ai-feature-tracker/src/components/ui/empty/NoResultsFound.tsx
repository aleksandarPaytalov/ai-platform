import React from 'react';
import { EmptyState } from './EmptyState';

export interface NoResultsFoundProps {
  /**
   * Search query that returned no results
   */
  searchQuery?: string;
  /**
   * Type of content being searched
   */
  contentType?: 'tools' | 'features' | 'updates' | 'users' | 'generic';
  /**
   * Custom message override
   */
  message?: string;
  /**
   * Whether to show search suggestions
   */
  showSuggestions?: boolean;
  /**
   * Search suggestions array
   */
  suggestions?: string[];
  /**
   * Callback to clear search/filters
   */
  onClearSearch?: () => void;
  /**
   * Callback to modify search
   */
  onNewSearch?: (query: string) => void;
  /**
   * Callback to browse all items
   */
  onBrowseAll?: () => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Applied filters information
   */
  appliedFilters?: Array<{
    key: string;
    value: string;
    label?: string;
  }>;
  /**
   * Callback to clear filters
   */
  onClearFilters?: () => void;
}

/**
 * NoResultsFound - Specific empty state for search/filter results
 * 
 * Provides helpful messaging and recovery options when search queries
 * return no results. Includes suggestions, filter management, and
 * alternative browsing options.
 */
export const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  searchQuery,
  contentType = 'generic',
  message: _message,
  showSuggestions = true,
  suggestions = [],
  onClearSearch,
  onNewSearch,
  onBrowseAll,
  size = 'medium',
  className = '',
  appliedFilters = [],
  onClearFilters,
}) => {
  const [newSearchQuery, setNewSearchQuery] = React.useState('');

  // Title is static; content-specific message is handled in description/actions

  /**
   * Generate helpful description with suggestions
   */
  const getDescription = (): string => {
    const tips: string[] = [];

    if (searchQuery) {
      tips.push('Check your spelling');
      tips.push('Try different keywords');
      tips.push('Use more general terms');
    }

    if (appliedFilters.length > 0) {
      tips.push('Remove some filters');
      tips.push('Adjust filter criteria');
    }

    tips.push('Browse all available items');

    return `Try the following: ${tips.join(', ')}.`;
  };

  /**
   * Generate default search suggestions based on content type
   */
  const getDefaultSuggestions = (): string[] => {
    if (suggestions.length > 0) return suggestions;

    switch (contentType) {
      case 'tools':
        return ['ChatGPT', 'Claude', 'Midjourney', 'GitHub Copilot', 'DALL-E'];
      case 'features':
        return ['API', 'integration', 'automation', 'analytics', 'export'];
      case 'updates':
        return ['new features', 'improvements', 'bug fixes', 'performance'];
      default:
        return [];
    }
  };

  /**
   * Handle new search submission
   */
  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSearchQuery.trim() && onNewSearch) {
      onNewSearch(newSearchQuery.trim());
      setNewSearchQuery('');
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: string) => {
    if (onNewSearch) {
      onNewSearch(suggestion);
    }
  };

  /**
   * Get primary action based on available callbacks
   */
  const getPrimaryAction = () => {
    if (onClearSearch && (searchQuery || appliedFilters.length > 0)) {
      return {
        label: 'Clear Search & Filters',
        onClick: () => {
          onClearSearch();
          if (onClearFilters) {
            onClearFilters();
          }
        },
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      };
    }

    if (onBrowseAll) {
      return {
        label: `Browse All ${contentType === 'generic' ? 'Items' : contentType}`,
        onClick: onBrowseAll,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
      };
    }

    return undefined;
  };

  /**
   * Get secondary action
   */
  const getSecondaryAction = () => {
    if (onBrowseAll && onClearSearch) {
      return {
        label: `Browse All ${contentType === 'generic' ? 'Items' : contentType}`,
        onClick: onBrowseAll,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
      };
    }

    return undefined;
  };

  const displaySuggestions = getDefaultSuggestions();

  return (
    <div className={`space-y-6 ${className}`}>
      <EmptyState
        title="No Results Found"
        description={getDescription()}
        icon="search"
        {...(getPrimaryAction() ? { primaryAction: getPrimaryAction()! } : {})}
        {...(getSecondaryAction() ? { secondaryAction: getSecondaryAction()! } : {})}
        size={size}
        background="subtle"
      />

      {/* Applied Filters Display */}
      {appliedFilters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Applied Filters:</h4>
            {onClearFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                type="button"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filter.label || filter.key}: {filter.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* New Search */}
      {onNewSearch && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Try a different search:</h4>
          
          <form onSubmit={handleNewSearch} className="flex gap-2">
            <input
              type="text"
              value={newSearchQuery}
              onChange={(e) => setNewSearchQuery(e.target.value)}
              placeholder={`Search for ${contentType}...`}
              className="
                flex-1 
                px-3 py-2 
                border border-gray-300 
                rounded-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:border-blue-500
              "
            />
            <button
              type="submit"
              disabled={!newSearchQuery.trim()}
              className="
                px-4 py-2 
                bg-blue-600 
                text-white 
                rounded-md 
                hover:bg-blue-700 
                disabled:bg-gray-300 
                disabled:cursor-not-allowed
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-offset-2
                transition-colors
              "
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && displaySuggestions.length > 0 && onNewSearch && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Popular searches:</h4>
          
          <div className="flex flex-wrap gap-2">
            {displaySuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="
                  px-3 py-1.5 
                  text-sm 
                  text-blue-600 
                  bg-blue-50 
                  border border-blue-200 
                  rounded-full 
                  hover:bg-blue-100 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:ring-offset-2
                  transition-colors
                "
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoResultsFound;